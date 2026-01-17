import mongoose from 'mongoose'

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama alat wajib diisi'],
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true, // Kode inventaris unik (Barcode/QR)
    uppercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Relasi ke Category
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stok tidak boleh negatif'],
    default: 0
  },
  location: {
    type: String, // Lokasi penyimpanan (misal: Rak A2)
    default: '-'
  },
  image: {
    type: String, // URL atau path gambar
    default: 'default-tool.png'
  }
}, { timestamps: true });

export default toolSchema