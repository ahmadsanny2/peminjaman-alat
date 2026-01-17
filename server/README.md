server/
├── src/
│   ├── config/             # Konfigurasi DB (mongoose), environment variables
│   │   ├── db.js
│   │   └── config.js
│   ├── controllers/        # Logika request/response
│   │   ├── authController.js
│   │   ├── toolController.js
│   │   ├── loanController.js
│   │   └── logController.js
│   ├── middleware/         # Interceptor request
│   │   ├── authMiddleware.js   # Verifikasi JWT
│   │   ├── roleMiddleware.js   # Validasi role (Admin/Petugas)
│   │   └── loggerMiddleware.js # Mencatat aktivitas ke DB (Log Aktifitas)
│   ├── models/             # Schema MongoDB (Mongoose)
│   │   ├── User.js
│   │   ├── Tool.js
│   │   ├── Category.js
│   │   ├── Transaction.js
│   │   └── ActivityLog.js
│   ├── routes/             # Definisi endpoint API
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   └── loanRoutes.js
│   └── utils/              # Helper functions (format tanggal, error handler)
├── .env                    # Variabel sensitif (DB_URI, JWT_SECRET)
└── server.js               # Entry point aplikasi