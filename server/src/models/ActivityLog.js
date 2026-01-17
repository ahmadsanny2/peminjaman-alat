import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Siapa yang melakukan aksi
  },
  action: {
    type: String,
    required: true // Contoh: "CREATE_TOOL", "APPROVE_LOAN", "LOGIN"
  },
  details: {
    type: String, // Deskripsi naratif. Contoh: "Menambahkan alat baru: Obeng Set"
    required: true
  },
  ipAddress: {
    type: String, // Opsional: untuk keamanan tambahan
    default: ''
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Hanya butuh waktu pembuatan
});

export default activityLogSchema