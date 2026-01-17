import User from "../models/User.js"; // Pastikan nama import konsisten
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
    // FITUR: Registrasi Pengguna Baru
    async register(req, res) {
        const { fullName, username, password, confirmPassword, role, nis, classInfo } = req.body;

        try {
            // 1. Validasi Input Dasar
            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: "Password dan konfirmasi password tidak cocok."
                });
            }

            // 2. Cek apakah username sudah digunakan
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ // 409 Conflict
                    message: "Username sudah terdaftar."
                });
            }

            // 3. Hashing Password (Keamanan)
            // Salt generated 10 rounds adalah standar industri saat ini
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 4. Buat User Baru
            // Perhatikan: kita memasukkan hashedPassword, bukan password mentah
            const newUser = await User.create({
                fullName,
                username,
                password: hashedPassword,
                role,
                nis: role === 'peminjam' ? nis : undefined,
                classInfo: role === 'peminjam' ? classInfo : undefined
            });

            // 5. Response Sukses (Jangan kembalikan password di response)
            res.status(201).json({
                message: "Registrasi berhasil",
                data: {
                    id: newUser._id,
                    username: newUser.username,
                    role: newUser.role,
                    fullName: newUser.fullName
                }
            });

        } catch (error) {
            console.error(error); // Untuk debugging di server console
            res.status(500).json({
                message: "Terjadi kesalahan server saat registrasi",
                error: error.message
            });
        }
    },

    // FITUR: Login Pengguna
    async login(req, res) {
        const { username, password } = req.body;

        try {
            // 1. Cari User berdasarkan Username
            // Kita perlu .select('+password') karena field password di set { select: false } di Schema
            const user = await User.findOne({ username }).select('+password');

            if (!user) {
                return res.status(401).json({ // 401 Unauthorized
                    message: "Username atau password salah."
                });
            }

            // 2. Verifikasi Password (Bandingkan input dengan hash di DB)
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    message: "Username atau password salah."
                });
            }

            // 3. Generate JSON Web Token (JWT)
            // Payload berisi ID dan Role untuk keperluan otorisasi di middleware nanti
            const payload = {
                id: user._id,
                role: user.role
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1d' // Token berlaku 1 hari
            });

            // 4. Response Sukses dengan Token
            res.status(200).json({
                message: "Login berhasil",
                token: token,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    fullName: user.fullName
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Terjadi kesalahan server saat login",
                error: error.message
            });
        }
    }
}