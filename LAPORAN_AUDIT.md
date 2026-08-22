# Laporan Audit Kode: Sistem Peminjaman Alat (PinjamKu)

## 1. Ringkasan Status Proyek

**Status: Perlu Banyak Perbaikan (Action Required)**

Secara keseluruhan, arsitektur dasar proyek peminjaman alat ini telah terstruktur dengan baik menggunakan **Express.js (Node.js)** dengan **Sequelize ORM** di sisi Backend dan **Next.js (App Router)** bersama **Tailwind CSS v4** di sisi Frontend. 

Namun, berdasarkan audit statis menyeluruh dan simulasi alur operasional QA, ditemukan beberapa **celah keamanan kritis (IDOR, Privilege Escalation, dan Unauthenticated Client-Side Route Guard)**, **potensi runtime crash (ReferenceError)** pada modul admin, **inkonsistensi masif pada visual Dark Mode**, serta **kegagalan konfigurasi aset gambar di lingkungan produksi**.

### Matriks Evaluasi Kualitas

| Aspek Evaluasi | Status | Catatan Utama |
| :--- | :---: | :--- |
| **Keamanan Backend (Auth & AuthZ)** | ⚠️ Kritis | Ditemukan celah IDOR pada pengembalian/pembatalan pinjaman dan *Privilege Escalation* pada registrasi. |
| **Integritas Transaksi & Database** | ⚠️ Butuh Perbaikan | Potensi *race condition* stok negatif pada *approval* paralel dan penanganan *fallback* pagination. |
| **Kestabilan Frontend (Runtime)** | ⚠️ Kritis | Terdapat variabel `errors` tak terdefinisi yang memicu *ReferenceError crash* pada halaman Manajemen Alat. |
| **Konsistensi UI/UX & Dark Mode** | ⚠️ Butuh Perbaikan | Banyak komponen tabel dan modal menggunakan kelas warna statis (`bg-white`) yang merusak mode gelap. |
| **Kesiapan Produksi (Deployability)** | ⚠️ Butuh Perbaikan | URL backend di-*hardcode* (`localhost:5000`), konfigurasi `next/image` terbatas hanya di lokal. |

---

## 2. Temuan Kritis (Backend & Logic)

### 1. Celah Keamanan *Insecure Direct Object References* (IDOR) pada Pengembalian Alat
- **Lokasi File:** `server/src/controllers/loan.controller.js` (Method: `returnLoan`, Baris ~376–424)
- **Tingkat Keparahan:** **Kritis (Critical)**
- **Deskripsi:** Endpoint `PUT /api/loans/:id/return` hanya memvalidasi apakah pengguna memiliki *role* `peminjam`, tetapi **tidak memverifikasi** apakah transaksi pinjaman (`loan.borrowerId`) adalah milik pengguna yang sedang login (`req.user.id`). Akibatnya, peminjam manapun dapat mengubah status dan mengunggah gambar bukti pengembalian atas transaksi milik pengguna lain.
- **Rekomendasi Perbaikan:** Tambahkan validasi kepemilikan transaksi dengan memeriksa `loan.borrowerId !== req.user.id`.
- **Contoh Solusi Kode:**
  ```javascript
  // server/src/controllers/loan.controller.js
  async returnLoan(req, res) {
      const { id } = req.params;
      const { actualReturnDate } = req.body;
      const transaction = await sequelize.transaction();

      try {
          const loan = await Loan.findByPk(id, { transaction });
          
          if (!loan || loan.status !== "approved") {
              await transaction.rollback();
              return res.status(404).json({
                  message: "Data peminjaman aktif tidak ditemukan.",
              });
          }

          // Validasi kepemilikan transaksi (Mencegah IDOR)
          if (loan.borrowerId !== req.user.id) {
              await transaction.rollback();
              return res.status(403).json({
                  message: "Akses ditolak. Anda tidak memiliki izin mengembalikan alat ini.",
              });
          }

          const tool = await Tool.findByPk(loan.toolId, { transaction });
          const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

          await loan.update(
              {
                  status: "verifying",
                  actualReturnDate: actualReturnDate,
                  image: imagePath,
              },
              { transaction }
          );

          await transaction.commit();

          await recordActivity(
              req.user.id,
              "RETURN LOAN",
              `${req.user.fullName} mengajukan pengembalian untuk: ${tool?.name || "Alat"}`
          );

          return res.status(200).json({
              message: "Pengembalian berhasil diajukan dan menunggu verifikasi petugas.",
              data: loan,
          });
      } catch (error) {
          await transaction.rollback();
          return res.status(500).json({
              message: "Gagal memproses pengembalian alat.",
              error: error.message,
          });
      }
  }
  ```

---

### 2. Celah Keamanan IDOR dan Polusi Relasi Data pada Pembatalan Pinjaman
- **Lokasi File:** `server/src/controllers/loan.controller.js` (Method: `cancelLoan`, Baris ~191–250)
- **Tingkat Keparahan:** **Tinggi (High)**
- **Deskripsi:** 
  1. Endpoint `cancelLoan` tidak memeriksa apakah `loan.borrowerId === req.user.id`, sehingga peminjam A dapat membatalkan permohonan pinjaman peminjam B.
  2. Variabel `officerId` diisi dengan `req.user.id` (`const officerId = req.user.id; await loan.update({ status: "canceled", officerId })`). Karena yang membatalkan adalah *peminjam*, pengisian `officerId` dengan ID peminjam merusak integritas relasi foreign key pada data transaksi.
- **Rekomendasi Perbaikan:** Validasi `loan.borrowerId === req.user.id` dan jangan set `officerId` pada pembatalan mandiri oleh peminjam.
- **Contoh Solusi Kode:**
  ```javascript
  // server/src/controllers/loan.controller.js
  async cancelLoan(req, res) {
      const { id } = req.params;
      const transaction = await sequelize.transaction();

      try {
          const loan = await Loan.findByPk(id, { transaction });

          if (!loan) {
              await transaction.rollback();
              return res.status(404).json({ message: "Data peminjaman tidak ditemukan." });
          }

          if (loan.borrowerId !== req.user.id) {
              await transaction.rollback();
              return res.status(403).json({ message: "Anda tidak berhak membatalkan pengajuan ini." });
          }

          if (loan.status !== "pending") {
              await transaction.rollback();
              return res.status(400).json({ message: "Hanya pengajuan berstatus 'pending' yang dapat dibatalkan." });
          }

          const tool = await Tool.findByPk(loan.toolId, { transaction });

          await loan.update(
              { status: "canceled" }, // Jangan set officerId saat dibatalkan peminjam
              { transaction }
          );

          await transaction.commit();

          await recordActivity(
              req.user.id,
              "CANCEL LOAN APPLICATION",
              `${req.user.fullName} membatalkan permohonan pinjam: ${tool?.name || "Alat"}`
          );

          return res.status(200).json({ // Gunakan status 200 OK
              message: "Permohonan peminjaman berhasil dibatalkan.",
          });
      } catch (error) {
          await transaction.rollback();
          return res.status(500).json({
              message: "Gagal memproses pembatalan peminjaman.",
              error: error.message,
          });
      }
  }
  ```

---

### 3. Celah *Privilege Escalation* pada Registrasi Akun Pengguna
- **Lokasi File:** `server/src/controllers/auth.controller.js` (Method: `register`, Baris ~8 & 43)
- **Tingkat Keparahan:** **Kritis (Critical)**
- **Deskripsi:** Pada fungsi `register`, nilai `role` diekstrak langsung dari `req.body` (`const { fullName, username, password, confirmPassword, role } = req.body;`) dan disimpan ke database tanpa sanitasi. Pengguna luar dapat mengirimkan request HTTP dengan payload `{ "role": "admin" }` untuk langsung membuat akun Administrator tanpa otorisasi.
- **Rekomendasi Perbaikan:** Tetapkan nilai default `role: "peminjam"` pada endpoint publik `/api/auth/register` secara eksplisit dan abaikan parameter `role` dari input pengguna.
- **Contoh Solusi Kode:**
  ```javascript
  // server/src/controllers/auth.controller.js
  async register(req, res) {
      const { fullName, username, password, confirmPassword } = req.body;
      const transaction = await sequelize.transaction();

      try {
          if (!fullName || !username || !password || !confirmPassword) {
              await transaction.rollback();
              return res.status(400).json({ message: "Semua field registrasi wajib diisi." });
          }

          if (password !== confirmPassword) {
              await transaction.rollback();
              return res.status(400).json({ message: "Konfirmasi password tidak cocok." });
          }

          const existingUser = await User.findOne({
              where: { username },
              transaction,
          });

          if (existingUser) {
              await transaction.rollback();
              return res.status(409).json({ message: "Username sudah digunakan, silakan pilih username lain." });
          }

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          const newUser = await User.create({
              fullName: fullName.trim(),
              username: username.trim().toLowerCase(),
              password: hashedPassword,
              role: "peminjam", // Hardcode role peminjam untuk registrasi publik
          }, { transaction });

          await recordActivity(
              newUser.id,
              "REGISTER",
              `${newUser.fullName} berhasil mendaftar sebagai peminjam.`,
              transaction
          );

          await transaction.commit();

          return res.status(201).json({
              message: "Registrasi berhasil!",
              data: {
                  id: newUser.id,
                  fullName: newUser.fullName,
                  username: newUser.username,
                  role: newUser.role,
              },
          });
      } catch (error) {
          await transaction.rollback();
          return res.status(500).json({
              message: "Terjadi kesalahan pada server saat melakukan registrasi.",
              error: error.message,
          });
      }
  }
  ```

---

### 4. Potensi *Race Condition* & Stok Negatif pada Persetujuan Peminjaman (*Approval*)
- **Lokasi File:** `server/src/controllers/loan.controller.js` (Method: `approveLoan`, Baris ~252–313)
- **Tingkat Keparahan:** **Tinggi (High)**
- **Deskripsi:** Ketika dua petugas menyetujui dua permohonan peminjaman secara bersamaan pada alat yang hanya tersisa 1 unit stok, pengecekan `tool.stock < 1` dan operasi `tool.decrement('stock')` terjadi tanpa *pessimistic row locking*. Hal ini dapat menyebabkan *race condition* dan membuat nilai stok di database menjadi minus (`-1`).
- **Rekomendasi Perbaikan:** Gunakan opsi `lock: transaction.LOCK.UPDATE` saat mengambil entitas `Tool` di dalam transaksi.
- **Contoh Solusi Kode:**
  ```javascript
  // server/src/controllers/loan.controller.js
  const tool = await Tool.findByPk(loan.toolId, {
      transaction,
      lock: transaction.LOCK.UPDATE, // Kunci baris data alat hingga transaksi selesai
  });

  if (!tool || tool.stock < 1) {
      await transaction.rollback();
      return res.status(400).json({
          message: "Peminjaman tidak dapat disetujui, stok alat sudah habis.",
      });
  }
  ```

---

### 5. Nilai Pagination `NaN` dan Penanganan Parameter Query yang Rapuh
- **Lokasi File:** 
  - `server/src/controllers/category.controller.js` (Baris ~10–38)
  - `server/src/controllers/tool.controller.js` (Baris ~36–58)
  - `server/src/controllers/loan.controller.js` (Baris ~21–52)
  - `server/src/controllers/user.controller.js` (Baris ~26–41)
  - `server/src/controllers/activity.controller.js` (Baris ~25–46)
- **Tingkat Keparahan:** **Sedang (Medium)**
- **Deskripsi:** Pada `category.controller.js`, `parseInt(page)` dan `parseInt(limit)` dieksekusi tanpa validasi fallback. Jika `page` atau `limit` tidak dikirim dari client (default `undefined`), variabel bernilai `NaN`. Rumus `totalPages: Math.ceil(count / limit)` menghasilkan `NaN` pada JSON response.
- **Rekomendasi Perbaikan:** Tetapkan nilai default `page = 1` dan `limit = 10` (atau `20`) secara konsisten.
- **Contoh Solusi Kode:**
  ```javascript
  // Standardisasi pagination di seluruh controller:
  const parsedPage = Math.max(1, parseInt(req.query.page, 10) || 1);
  const parsedLimit = Math.max(1, parseInt(req.query.limit, 10) || 10);

  queryOptions.limit = parsedLimit;
  queryOptions.offset = (parsedPage - 1) * parsedLimit;

  // Response:
  res.status(200).json({
      message: "Data berhasil diambil.",
      totalItems: count,
      totalPages: Math.ceil(count / parsedLimit) || 1,
      currentPage: parsedPage,
      data: rows,
  });
  ```

---

## 3. Temuan Visual (Frontend & UI/UX)

### 1. *Runtime Crash* (*ReferenceError*) pada Komponen Manajemen Alat
- **Lokasi File:** `client/src/app/(dashboard)/admin/management-tools/management-tools.js` (Baris 261–265 & Baris 292–296)
- **Tingkat Keparahan:** **Kritis (Critical)**
- **Deskripsi:** 
  1. Pada baris 263, kode memanggil `{errors.categoryId.message}` padahal variabel `errors` **tidak didefinisikan/didestruktur** dari hook `useTool()`. Jika error terjadi, seluruh halaman Admin akan mengalami *Uncaught ReferenceError: errors is not defined* dan halaman blank/crash.
  2. Pada baris 293–295 di dalam input "Kondisi", terdapat duplikasi kode yang mengecek `error.categoryId` alih-alih `error.condition`.
- **Rekomendasi Perbaikan:** Bersihkan referensi variabel tak terdefinisi dan gunakan state error terpadu.
- **Contoh Solusi Kode:**
  ```jsx
  // client/src/app/(dashboard)/admin/management-tools/management-tools.js
  {/* Select Category */}
  <div className="w-full">
      <Label name="Kategori" />
      <div className="relative">
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
          <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isLoading}
          >
              <Option optionName="Pilih Kategori" optionValue="" />
              {categories.map((category) => (
                  <Option key={category.id} optionValue={category.id} optionName={category.name} />
              ))}
          </Select>
      </div>
  </div>
  ```

---

### 2. Celah Keamanan *Client Route Guard Bypass* pada Cookie & Interceptor Axios
- **Lokasi File:** `client/src/proxy.js` (Baris ~9–47) & `client/src/lib/api.js` (Baris ~28–37)
- **Tingkat Keparahan:** **Tinggi (High)**
- **Deskripsi:** 
  1. File `proxy.js` membaca data `role` pengguna langsung dari plain cookie `Cookies.get("user")` tanpa memvalidasi payload JWT `token`. Penyerang cukup mengubah nilai cookie `user={"role":"admin"}` di browser untuk mengakses antarmuka `/admin`.
  2. File route guard Next.js seharusnya bernama `middleware.js` (atau `src/middleware.js`), penamaan `proxy.js` berisiko tidak dieksekusi oleh runtime Next.js standar jika matcher tidak terkonfigurasi.
  3. Interceptor Axios di `client/src/lib/api.js` menghapus token dan memaksa redirect ke `/login` saat menerima status **403 Forbidden**. Status 403 adalah penolakan hak akses per aksi spesifik, bukan tanda sesi habis (401 Unauthorized). Hal ini menyebabkan pengguna yang valid tiba-tiba ter-logout secara mendadak.
- **Rekomendasi Perbaikan:** 
  - Gunakan `middleware.js` standar.
  - Batasi pembersihan sesi hanya pada status HTTP `401`.
- **Contoh Solusi Kode (`client/src/lib/api.js`):**
  ```javascript
  api.interceptors.response.use(
      (response) => response,
      (error) => {
          const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

          // Hanya bersihkan session jika 401 (Unauthorized / Token Expired)
          if (error.response && error.response.status === 401) {
              Cookies.remove("token");
              Cookies.remove("user");

              if (typeof window !== "undefined" && !isLoginPage) {
                  window.location.href = "/login";
              }
          }
          return Promise.reject(error);
      }
  );
  ```

---

### 3. Kerusakan Visual Mode Gelap (*Dark Mode Breakage*) Akibat Kelas Warna Statis
- **Lokasi File:**
  - `client/src/app/(dashboard)/admin/page.js` (Baris ~74)
  - `client/src/app/(dashboard)/admin/activity-logs/activity-logs.js` (Baris ~141)
  - `client/src/app/(dashboard)/admin/loan-transactions/loan-transactions.js` (Baris ~144)
  - `client/src/app/(dashboard)/admin/management-categories/management-categories.js` (Baris ~221)
  - `client/src/app/(dashboard)/admin/management-tools/management-tools.js` (Baris ~393)
  - `client/src/app/(dashboard)/admin/management-users/management-users.js` (Baris ~213)
  - `client/src/app/(dashboard)/borrower/borrower.js` (Baris ~78 & 95)
  - `client/src/app/(dashboard)/borrower/transactions-history/transactions-history.js` (Baris ~230 & 294)
  - `client/src/app/(dashboard)/officer/loan-requests/loan-requests.js` (Baris ~238)
  - `client/src/components/Modals/ProofImageReturnLoan.js` (Baris ~29–52)
- **Tingkat Keparahan:** **Tinggi (High)**
- **Deskripsi:** Seluruh kontainer tabel data, kartu panduan, dan form pengembalian di atas menggunakan kelas statis `<div className="bg-white rounded-2xl border border-slate-200/80 ...">` dan elemen input `bg-white text-slate-700`. Ketika pengguna beralih ke *Dark Mode*, kontainer tersebut tetap berwarna putih terang benderang dengan teks yang bertabrakan, merusak estetika dan keterbacaan (*readability*).
- **Rekomendasi Perbaikan:** Ganti seluruh `bg-white`, `border-slate-200`, dan `text-slate-*` dengan variabel desain dinamis yang sudah terdaftar di Tailwind v4 (`bg-card-bg`, `border-border-subtle`, `text-text-primary`, `text-text-secondary`).
- **Contoh Solusi Kode:**
  ```jsx
  // SEBELUM:
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <table className="w-full text-sm text-slate-600">
          <thead className="bg-slate-100/80 border-b border-slate-200/80 text-slate-800 font-semibold">
  
  // SESUDAH (Mendukung Dark Mode Secara Presisi):
  <div className="bg-card-bg rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
      <table className="w-full text-sm text-text-secondary">
          <thead className="bg-app-bg border-b border-border-subtle text-text-primary font-bold">
  ```

---

### 4. URL Gambar Hardcoded & Konfigurasi Next.js Image Optimization
- **Lokasi File:** 
  - `client/src/app/(dashboard)/borrower/tools-catalog/tools-catalog.js` (Baris ~79 & 181)
  - `client/src/components/Modals/ProofImageReturnLoan.js` (Baris ~32)
  - `client/next.config.mjs` (Baris ~6–14)
- **Tingkat Keparahan:** **Sedang (Medium)**
- **Deskripsi:** 
  1. Pemanggilan gambar alat menggunakan string statis `http://localhost:5000${tool.image}`. Di server produksi (staging/production), gambar akan gagal dimuat (*broken image*).
  2. Jika `tool.image` bernilai `null`, URL menjadi `http://localhost:5000null` yang memicu error 404 pada request gambar.
  3. Konfigurasi `images.remotePatterns` pada `next.config.mjs` hanya membolehkan `localhost:5000`.
- **Rekomendasi Perbaikan:** Buat helper utility `getImageUrl(path)` yang memanfaatkan `process.env.NEXT_PUBLIC_API_URL` dan sediakan gambar cadangan (*fallback placeholder*).
- **Contoh Solusi Kode:**
  ```javascript
  // client/src/lib/utils.js
  export const getImageUrl = (imagePath) => {
      if (!imagePath) return "/images/placeholder-tool.png";
      if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL 
          ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") 
          : "http://localhost:5000";
      return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };
  ```

---

### 5. Inkonsistensi Jumlah `colSpan` dan Penggunaan Atribut Huruf Kecil `colspan`
- **Lokasi File:** 
  - `client/src/components/Table/TableCell.js` (Baris ~6)
  - `client/src/app/(dashboard)/admin/loan-transactions/loan-transactions.js` (Baris 65 & 73)
  - `client/src/app/(dashboard)/borrower/transactions-history/transactions-history.js` (Baris 98 & 106)
  - `client/src/app/(dashboard)/officer/loan-requests/loan-requests.js` (Baris 94 & 102)
- **Tingkat Keparahan:** **Rendah (Low)**
- **Deskripsi:**
  1. React memerlukan penulisan props dengan camelCase (`colSpan`). Penggunaan `colspan="8"` memicu React DOM warning di console.
  2. Di `loan-transactions.js`, tabel memiliki 6 kolom, tetapi baris loading/empty diberikan `colspan="8"`.
  3. Di `transactions-history.js`, tabel memiliki 9 kolom, tetapi baris loading/empty diberikan `colspan="8"`. Hal ini merusak perataan (*grid alignment*) saat data kosong atau dalam proses loading.
- **Rekomendasi Perbaikan:** Perbaiki `TableCell.js` agar mendukung prop `colSpan` secara fleksibel dan samakan angka `colSpan` sesuai jumlah kolom `th`.
- **Contoh Solusi Kode (`client/src/components/Table/TableCell.js`):**
  ```jsx
  const TableCell = ({ isHeader, children, className = "", colSpan, colspan }) => {
      const spanValue = colSpan || colspan;
      return isHeader ? (
          <th className={`px-4 py-3.5 text-xs uppercase tracking-wider font-bold text-text-secondary ${className}`}>
              {children}
          </th>
      ) : (
          <td className={`px-4 py-3.5 text-sm text-text-primary ${className}`} colSpan={spanValue}>
              {children}
          </td>
      );
  };

  export default TableCell;
  ```

---

### 6. Tautan Navigasi Rusak (*Broken Anchor Link*) pada Navbar Landing Page
- **Lokasi File:** `client/src/components/Navbar/page.js` (Baris ~49) dan `client/src/app/home/why-section/page.js` (Baris ~5)
- **Tingkat Keparahan:** **Rendah (Low)**
- **Deskripsi:** Menu navigasi "Tentang" pada Navbar mengarah ke URL `#about`, namun section pada `why-section/page.js` memiliki atribut `id="tentang"`. Akibatnya, saat pengguna mengklik menu "Tentang", halaman tidak melakukan scroll otomatis ke section yang dituju.
- **Rekomendasi Perbaikan:** Ubah URL menu navigasi di `Navbar` menjadi `url: "#tentang"`.

---

### 7. Inkonsistensi Standar Bahasa pada Pesan Validasi Form (English vs Bahasa Indonesia)
- **Lokasi File:**
  - `client/src/schemas/authSchema.js` (Baris ~4–29)
  - `client/src/schemas/categorySchema.js` (Baris ~4–7)
  - `client/src/schemas/loanSchema.js` (Baris ~4–16)
- **Tingkat Keparahan:** **Rendah (Low)**
- **Deskripsi:** Berdasarkan dokumen `PRODUCT.md`, seluruh antarmuka dan pesan validasi **wajib menggunakan bahasa Indonesia yang baku**. Saat ini, skema validasi Zod masih menghasilkan pesan berbahasa Inggris seperti *"Full name must be at least 3 characters"*, *"Passwords don't match"*, dan *"Expected return date must be today or in the future."*
- **Rekomendasi Perbaikan:** Terjemahkan seluruh pesan validasi Zod ke dalam bahasa Indonesia yang baku dan informatif.
- **Contoh Solusi Kode (`client/src/schemas/authSchema.js`):**
  ```javascript
  import { z } from "zod";

  export const loginSchema = z.object({
      username: z.string().trim().min(1, { message: "Silakan masukkan username Anda." }),
      password: z.string().min(1, { message: "Silakan masukkan password Anda." }),
  });

  export const registerSchema = z
      .object({
          fullName: z.string().trim().min(3, "Nama lengkap minimal 3 karakter."),
          username: z
              .string()
              .trim()
              .min(4, "Username minimal 4 karakter.")
              .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh memuat huruf, angka, dan garis bawah (_)."),
          password: z
              .string()
              .min(8, "Password minimal 8 karakter.")
              .regex(/[a-z]/, "Sertakan minimal satu huruf kecil.")
              .regex(/[A-Z]/, "Sertakan minimal satu huruf besar.")
              .regex(/[0-9]/, "Sertakan minimal satu angka.")
              .regex(/[^a-zA-Z0-9]/, "Sertakan minimal satu simbol khusus (@#$%^&*)."),
          confirmPassword: z.string().min(1, "Silakan konfirmasi password Anda."),
      })
      .refine((data) => data.password === data.confirmPassword, {
          message: "Konfirmasi password tidak cocok.",
          path: ["confirmPassword"],
      });
  ```

---

## 4. Kesimpulan & Roadmap Perbaikan

Aplikasi **PinjamKu** memiliki fondasi fitur yang lengkap untuk alur peminjaman inventaris lab berbasis 3-tier user (Admin, Petugas, Peminjam). Namun, sebelum masuk ke tahap produksi, perbaikan wajib difokuskan pada tiga prioritas utama:

1. **Prioritas 1 (Keamanan & Kestabilan Sistem):**
   - Tambahkan validasi kepemilikan data (`borrowerId === req.user.id`) pada endpoint `returnLoan` dan `cancelLoan`.
   - Kunci pendaftaran `role: "peminjam"` pada endpoint registrasi publik untuk mencegah *privilege escalation*.
   - Perbaiki variabel tak terdefinisi `errors` di `management-tools.js` untuk mencegah aplikasi crash.
   - Tambahkan *pessimistic lock* pada transaksi persetujuan peminjaman untuk mencegah stok minus.

2. **Prioritas 2 (Desain UI/UX & Dark Mode):**
   - Refaktor semua kelas kontainer tabel dan modal dari `bg-white` ke `bg-card-bg` dan `border-border-subtle` agar mode gelap bekerja secara konsisten.
   - Perbaiki penanganan status HTTP 403 pada interceptor Axios agar tidak melogout pengguna secara keliru.

3. **Prioritas 3 (Standardisasi & Kesiapan Rilis):**
   - Standarisasi seluruh pesan error Zod ke dalam bahasa Indonesia baku sesuai panduan `PRODUCT.md`.
   - Gunakan utility dynamic image URL dan sediakan gambar fallback untuk menjamin keterbacaan gambar di server produksi.

