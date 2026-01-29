import mongoose from "mongoose";

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama alat wajib diisi"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stok tidak boleh negatif"],
      default: 0,
    },
    image: {
      type: String,
      default: "default-tool.png",
    },
  },
  { timestamps: true },
);

export default mongoose.model('Tool', toolSchema)
