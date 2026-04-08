# PinjamKu: Sistem Manajemen Peminjaman Alat Digital

## Abstrak
PinjamKu merupakan sebuah manifestasi solusi digital yang dirancang untuk mengatasi kompleksitas manajemen inventaris dan sirkulasi peminjaman alat dalam ekosistem organisasi. Dalam paradigma manajemen aset tradisional, tantangan utama sering kali terletak pada rendahnya transparansi data, risiko kehilangan aset yang tinggi, serta inefisiensi dalam pelacakan status peminjaman. PinjamKu hadir dengan mengintegrasikan prinsip-prinsip akuntabilitas dan presisi data melalui platform terpusat yang memfasilitasi seluruh siklus hidup peminjaman—mulai dari reservasi, verifikasi oleh petugas, hingga pemantauan keterlambatan pengembalian. Signifikansi sistem ini terletak pada kemampuannya untuk mentransformasi data mentah inventaris menjadi informasi strategis yang menunjang pengambilan keputusan operasional.

## Arsitektur Sistem
Sistem ini mengadopsi pola arsitektur *Client-Server* yang terpisah secara modular untuk menjamin skalabilitas dan pemeliharaan jangka panjang:

1.  **Lapisan Presentasi (Frontend):** Dikembangkan menggunakan **Next.js**, menyediakan antarmuka pengguna yang reaktif dan dinamis. Komunikasi dengan backend dilakukan melalui protokol HTTP/HTTPS secara asinkron menggunakan pustaka Axios.
2.  **Lapisan Logika Bisnis (Backend):** Memanfaatkan **ExpressJS** sebagai motor utama API Gateway. Lapisan ini menangani validasi skema, autentikasi berbasis token, serta orkestrasi logika bisnis sebelum data diproses ke lapisan persistensi.
3.  **Lapisan Persistensi (Database):** Menggunakan **MySQL** sebagai sistem manajemen basis data relasional. Integrasi antara kode program dan basis data dijembatani oleh **Sequelize (ORM)**, yang memastikan integritas data melalui skema model yang terdefinisi dengan ketat.

## Prasyarat (Prerequisites)
Sebelum melakukan inisialisasi proyek, pastikan lingkungan pengembangan Anda telah memenuhi spesifikasi berikut:

*   **Runtime:** Node.js v18.x atau versi yang lebih tinggi.
*   **Package Manager:** NPM (Node Package Manager) atau PNPM.
*   **Database:** MySQL Server v8.0+.
*   **Operating System:** Kompatibel dengan lingkungan Linux, macOS, atau Windows (via WSL2 sangat direkomendasikan).

## Konfigurasi Lingkungan (Environment Setup)
Keamanan dan operasional sistem sangat bergantung pada konfigurasi variabel lingkungan yang tepat. Anda diwajibkan untuk membuat berkas `.env` pada masing-masing direktori (`client` dan `server`).

### Konfigurasi Server (`server/.env`)
Penetapan `JWT_SECRET` sangat krusial untuk menjamin integritas token autentikasi pengguna.

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=pinjamku_db

# Security
JWT_SECRET=gunakan_string_acak_dan_panjang_disini
JWT_EXPIRES_IN=1d
```

### Konfigurasi Client (`client/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Metodologi Instalasi
Ikuti langkah-langkah sistematis berikut untuk mereplikasi lingkungan produksi ke lokal:

1.  **Klonalisasi Repositori:**
    ```bash
    git clone https://github.com/username/peminjaman-alat.git
    cd peminjaman-alat
    ```

2.  **Persiapan Basis Data:**
    Masuk ke konsol MySQL Anda dan buatlah basis data baru:
    ```sql
    CREATE DATABASE pinjamku_db;
    ```

3.  **Inisialisasi Backend:**
    ```bash
    cd server
    npm install
    # Pastikan .env sudah dikonfigurasi sebelum menjalankan perintah di bawah
    npm start
    ```

4.  **Inisialisasi Frontend:**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

## Implementasi & Penggunaan
Sistem PinjamKu membagi otorisasi pengguna ke dalam tiga level utama untuk menjaga alur kerja yang terstruktur:

*   **Administrator:** Memiliki kendali penuh terhadap manajemen pengguna, kategori alat, dan audit log aktivitas.
*   **Officer (Petugas):** Bertanggung jawab atas validasi permintaan peminjaman dan verifikasi fisik saat pengembalian alat.
*   **Borrower (Peminjam):** Dapat menjelajahi katalog alat, mengajukan peminjaman, dan memantau riwayat transaksi secara personal.

### Contoh Pemanggilan API (Otentikasi)
Sistem menggunakan JWT untuk mengamankan setiap *endpoint* sensitif. Berikut adalah cuplikan logika penggunaan token pada sisi klien:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Interceptor untuk menyematkan token pada setiap permintaan
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---
**Standar Pengoperasian:** Setiap perubahan pada skema basis data wajib dilakukan melalui mekanisme migrasi Sequelize untuk menjaga konsistensi struktur antar lingkungan pengembangan.
