import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
    async register(req, res) {
        const {
            fullName,
            username,
            password,
            confirmPassword,
            role,
        } = req.body;

        try {
            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: "Password dan konfirmasi password tidak cocok.",
                });
            }

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({
                    message: "Username sudah terdaftar.",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                fullName,
                username,
                password: hashedPassword,
                role,
            });

            res.status(201).json({
                message: "Registrasi berhasil",
                data: {
                    id: newUser._id,
                    username: newUser.username,
                    role: newUser.role,
                    fullName: newUser.fullName,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Terjadi kesalahan server saat registrasi",
                error: error.message,
            });
        }
    },

    async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username }).select("+password");

            if (!user) {
                return res.status(401).json({
                    message: "Username atau password salah.",
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    message: "Username atau password salah.",
                });
            }

            const payload = {
                id: user._id,
                role: user.role,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            res.status(200).json({
                message: "Login berhasil",
                token: token,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    fullName: user.fullName,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Terjadi kesalahan server saat login",
                error: error.message,
            });
        }
    },
};
