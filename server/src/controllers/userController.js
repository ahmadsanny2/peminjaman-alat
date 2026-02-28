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
            res.status(500).json({
                message: "Failed to retrieve user data.",
                error: error.message,
            });
        }
    },

    async updateRole(req, res) {
        const { id } = req.params;
        const { role } = req.body;


        const validRoles = ["admin", "petugas", "peminjam"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message:
                    "The role parameter is not recognized by the system.",
            });
        }

        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    message: "User not found in the database.",
                });
            }

            if (user.id === req.user.id) {
                return res.status(403).json({
                    message:
                        "Action denied: You can’t change your own role.",
                });
            }

            await user.update({ role });

            res.status(200).json({
                message: "Role successfully updated.",
                data: { id: user.id, username: user.username, role: user.role },
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update role user.",
                error: error.message,
            });
        }
    },
};
