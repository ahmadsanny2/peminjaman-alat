import { User } from "../models/index.js";

export default {
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
                attributes: ["id", "fullName", "username", "role", "createdAt"],
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json({ data: users });
        } catch (error) {
            res
                .status(500)
                .json({
                    message: "Kegagalan sistem saat mengekstraksi matriks pengguna",
                    error: error.message,
                });
        }
    },

    async updateRole(req, res) {
        const { id } = req.params;
        const { role } = req.body;

        // Validasi parameter otorisasi
        const validRoles = ["admin", "petugas", "peminjam"];
        if (!validRoles.includes(role)) {
            return res
                .status(400)
                .json({
                    message:
                        "Parameter peran (role) tidak teridentifikasi dalam spesifikasi sistem.",
                });
        }

        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res
                    .status(404)
                    .json({
                        message: "Entitas pengguna tidak ditemukan di pangkalan data.",
                    });
            }

            if (user.id === req.user.id) {
                return res
                    .status(403)
                    .json({
                        message:
                            "Tindakan ditolak: Anda tidak diizinkan memodifikasi otoritas pada sesi Anda sendiri.",
                    });
            }

            await user.update({ role });

            res.status(200).json({
                message: "Ekskalasi/Dekskalasi hak istimewa berhasil dieksekusi.",
                data: { id: user.id, username: user.username, role: user.role },
            });
        } catch (error) {
            res
                .status(500)
                .json({
                    message: "Gagal memodifikasi otorisasi pengguna",
                    error: error.message,
                });
        }
    },
};
