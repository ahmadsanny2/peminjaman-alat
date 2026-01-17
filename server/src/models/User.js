import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: [true, 'Nama lengkap wajib diisi']
  },
  username: {
    type: String,
    required: [true, 'Username wajib diisi'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    select: false // Password tidak akan dikirim saat query default (Keamanan)
  },
  role: {
    type: String,
    enum: ['admin', 'petugas', 'peminjam'], // Validasi ketat sesuai tabel fitur
    required: true
  },
  // Field khusus untuk siswa/peminjam
  nis: {
    type: String,
    unique: true,
    sparse: true // Mengizinkan nilai null/unik hanya jika field ini ada
  },
  classInfo: {
    type: String, // Contoh: "XII RPL 1"
    required: function () { return this.role === 'peminjam'; }
  }
}, {
  timestamps: true // Otomatis membuat createdAt dan updatedAt
});

export default mongoose.model('User', userSchema)