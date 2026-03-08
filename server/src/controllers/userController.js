import { Op } from "sequelize";
import { User } from "../models/index.js";
import { recordActivity } from "../utils/logger.js"

export default {
    async getAllUsers(req, res) {
        try {
            const { search, sort, page, limit, role } = req.query
            let queryOptions = {
                where: {}
            }

            if (search) {
                queryOptions.where = {
                    fullName: {
                        [Op.like]: `%${search}%`
                    }
                }
            }

            if (role) {
                queryOptions.where.role = {
                    [Op.like]: `%${role}%`
                }
            }

            if (sort === "oldest") {
                queryOptions.order = [["createdAt", "ASC"]]
            } else {
                queryOptions.order = [["createdAt", "DESC"]]
            }

            if (page && limit) {
                page = parseInt(page)
                limit = parseInt(limit)

                queryOptions.limit = limit
                queryOptions.offset = (page - 1) * limit
            }

            const { count, rows } = await User.findAndCountAll({
                ...queryOptions,
            });

            res.status(200).json({
                message: "Successfully get users",
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                data: rows
            });
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

            await recordActivity(
                req.user.id,
                "UPDATE ROLE",
                `${req.user.fullName} telah memperbarui role untuk users ${user.fullName}`
            )

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
