// src/models/Category.js
import mongoose from "mongoose"; // Ubah require menjadi import

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

// Ubah module.exports menjadi export default
export default mongoose.model("Category", categorySchema);
