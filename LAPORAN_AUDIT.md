# Laporan Audit Kode: Peminjaman Alat

## Ringkasan Status Proyek
**Status: Perlu Banyak Perbaikan**

Secara keseluruhan, arsitektur dasar proyek ini sudah terbentuk dengan baik menggunakan stack Express.js dan Next.js, serta Sequelize sebagai ORM. Namun, terdapat celah keamanan kritis terkait manipulasi file (Path Traversal), kurangnya integrasi transaksi database pada beberapa endpoint esensial (menimbulkan inkonsistensi data), serta anti-pattern pada implementasi *dark mode* di sisi frontend yang menyalahi konsep dasar Tailwind CSS. Selain itu, terdapat potensi *Hydration Error* pada aplikasi Next.js akibat rendering tanggal dinamis. 

---

## Temuan Kritis (Backend & Logic)

### 1. Celah Keamanan *Path Traversal* pada Manipulasi File
- **Lokasi File:** `server/src/controllers/tool.controller.js` (Method: `deleteTool` & `updateTool`)
- **Deskripsi:** Path gambar dari database `tool.image` langsung digunakan dalam `path.resolve` atau `path.join` untuk menghapus file dengan `fs.unlinkSync()`. Jika nilai di database dimanipulasi untuk mengandung `../`, penyerang berpotensi menghapus file penting di sistem.
- **Rekomendasi Perbaikan:** Gunakan `path.basename` untuk memastikan hanya nama file yang diekstraksi, bukan seluruh path direktori.
- **Contoh Perbaikan (`deleteTool`):**
  ```javascript
  if (tool.image) {
      // Ekstrak hanya nama file saja untuk mencegah path traversal
      const fileName = path.basename(tool.image);
      const filePath = path.resolve(process.cwd(), "public/uploads", fileName);

      if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
      }
  }
  ```

### 2. Inkonsistensi Data (Kurangnya *Database Transaction*)
- **Lokasi File:** `server/src/controllers/auth.controller.js` (Method: `register`)
- **Deskripsi:** Proses pembuatan `User.create` dan pencatatan aktivitas `recordActivity` dijalankan terpisah tanpa transaksi. Jika `recordActivity` gagal, *user* tetap terbuat namun API mengembalikan respons error 500, menyebabkan state yang tidak sinkron antara backend dan *client*.
- **Rekomendasi Perbaikan:** Bungkus proses tersebut ke dalam `sequelize.transaction()`.
- **Contoh Perbaikan:**
  ```javascript
  const transaction = await sequelize.transaction();
  try {
      const newUser = await User.create({
          fullName: formattedFullName,
          username,
          password: hashedPassword,
          role,
      }, { transaction });

      await recordActivity(
          newUser.id,
          "REGISTER",
          `${newUser.fullName} just joined the system.`,
          transaction // Asumsikan utilitas logger diupdate untuk menerima transaction
      );

      await transaction.commit();
      // ... lanjutkan respons sukses
  } catch (error) {
      await transaction.rollback();
      // ... kembalikan respons error
  }
  ```

### 3. *Type Conversion Error* (Validasi Parameter Query)
- **Lokasi File:** `server/src/controllers/loan.controller.js` (Method: `getAllLoans` & `getMyLoans`)
- **Deskripsi:** Penggunaan fungsi `parseInt(page)` tanpa validasi input. Jika `page` atau `limit` bernilai non-numerik (misal: huruf), nilai akan menjadi `NaN` dan menyebabkan *crash* pada operasi ORM di fungsi pembagian limit/offset.
- **Rekomendasi Perbaikan:** Tambahkan nilai *fallback* (default) yang aman.
- **Contoh Perbaikan:**
  ```javascript
  if (page && limit) {
      const parsedPage = parseInt(page) || 1;
      const parsedLimit = parseInt(limit) || 10;

      queryOptions.limit = parsedLimit;
      queryOptions.offset = (parsedPage - 1) * parsedLimit;
  }
  ```

---

## Temuan Visual (Frontend & UI/UX)

### 1. *Next.js Hydration Mismatch Error*
- **Lokasi File:** `client/src/app/(dashboard)/DashboardLayouts.js` (Baris ~49)
- **Deskripsi:** Pemanggilan `new Date().toLocaleDateString()` dilakukan langsung di dalam elemen render JSX. Karena format waktu dan tanggal bergantung pada lokasi pengguna (*browser*), hal ini akan menyebabkan *Hydration Error* di Next.js saat hasil HTML dari server berbeda dengan hasil *render* di sisi klien.
- **Rekomendasi Perbaikan:** Gunakan `useEffect` untuk menunda render tanggal di sisi klien, atau gunakan nilai tanggal yang statis sementara sebelum di-hydrate.
- **Contoh Perbaikan:**
  ```javascript
  import { useState, useEffect } from "react";

  // ... dalam komponen
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
      setCurrentDate(new Date().toLocaleDateString("id-ID", {
          weekday: "long", year: "numeric", month: "long", day: "numeric"
      }));
  }, []);

  // JSX
  <span>{currentDate || "Memuat tanggal..."}</span>
  ```

### 2. Anti-Pattern pada Implementasi *Dark Mode*
- **Lokasi File:** `client/src/app/globals.css` (Baris 33-103)
- **Deskripsi:** File *stylesheet* terlalu banyak menggunakan *override* secara global dengan atribut `!important` untuk warna *dark mode* (seperti `.bg-white { background-color: var(--card-bg) !important; }`). Ini menghilangkan fleksibilitas serta prediktabilitas Tailwind CSS.
- **Rekomendasi Perbaikan:** Hapus kelas statis override tersebut. Manfaatkan varian `dark:` bawaan Tailwind CSS pada tiap komponen atau definisikan warna dinamis (menggunakan `var(--card-bg)`) pada konfigurasi Tailwind (`@theme` di Tailwind v4).
- **Contoh Perbaikan:**
  Hapus override statis, definisikan nilai token warna dalam CSS/theme, dan di *file component*:
  ```jsx
  // Hindari <div className="bg-white ..."> yang di-override
  // Gunakan varian dark native dari Tailwind:
  <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  ```

### 3. Logika *Responsiveness* yang Rentan
- **Lokasi File:** `client/src/app/(dashboard)/DashboardLayouts.js` (Prop Sidebar `className`)
- **Deskripsi:** Penggabungan string kelas bersyarat untuk *sidebar toggle* cukup kompleks dan berisiko menimbulkan *layout shift* atau pergerakan mendadak saat mengubah ukuran layar karena menggunakan `max-lg:hidden` yang dicampur dengan properti `fixed` yang berganti-ganti.
- **Rekomendasi Perbaikan:** Implementasikan sistem *transform / translate* dari Tailwind untuk transisi sidebar *off-canvas* yang lebih mulus dan tidak meloncat.
- **Contoh Perbaikan:**
  ```javascript
  <Sidebar
      className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebar ? "translate-x-0" : "-translate-x-full"
      }`}
  />
  ```

---

## Kesimpulan

Aplikasi memiliki alur dan desain logika bisnis yang baik, namun harus segera menangani risiko keamanan kritis seperti manipulasi berkas (Path Traversal) di sisi backend. Konsistensi state database pada sistem Autentikasi perlu diperkuat dengan *transaction*. Pada sisi Frontend, disarankan untuk mengadopsi standar praktik terbaik (*best-practice*) Tailwind CSS dan React/Next.js terkait pewarnaan (khususnya *dark-mode*) dan siklus rendering (hidrasi data dinamis) untuk meningkatkan skalabilitas dan pemeliharaan antarmuka ke depannya.
