import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Nama lengkap wajib diisi"],
    },
    username: {
      type: String,
      required: [true, "Username wajib diisi"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "petugas", "peminjam"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
