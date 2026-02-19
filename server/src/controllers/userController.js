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
};
