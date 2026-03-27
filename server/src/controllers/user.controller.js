import { Op } from "sequelize";
import { User } from "../models/index.js";
import { recordActivity } from "../utils/logger.js"

export default {
    async getAllUsers(req, res) {
        try {
            let { search, sort, role, page, limit } = req.query

            let queryOptions = {
                where: {},
                order: [["createdAt", sort === "ASC" ? "ASC" : "DESC"]]
            }

            if (search) {
                queryOptions.where.fullName = {
                    [Op.like]: `%${search}%`
                }
            }

            if (role) {
                queryOptions.where.role = role
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
                message: "Successfully fetched the user list.",
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

    async updateUser(req, res) {
        const { id } = req.params;
        const { fullName, role } = req.body;


        const validRoles = ["admin", "petugas", "peminjam"];

        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message:
                    "That role isn't recognized by our system.",
            });
        }

        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    message: "User not found in our database.",
                });
            }

            if (user.id === req.user.id) {
                return res.status(403).json({
                    message:
                        "Denied! You can't change your own role.",
                });
            }

            await user.update({ fullName, role });

            await recordActivity(
                req.user.id,
                "UPDATE USER",
                `${req.user.fullName} just updated the user for ${user.fullName}.`
            )

            res.status(200).json({
                message: "User updated successfully!",
                data: { id: user.id, username: user.username, role: user.role },
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update user.",
                error: error.message,
            });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params

            const user = await User.findByPk(id)

            if (!user) {
                return res.status(404).json({
                    message: "Can't delete what's not there. User not found.",
                });
            }

            if (user.id === req.user.id) {
                return res.status(403).json({
                    message: "Access denied. You cannot delete your own account.",
                });
            }

            await user.destroy()

            await recordActivity(
                req.user.id,
                "DELETE USER",
                `${req.user.fullName} just deleted the user ${user.fullName}.`
            )

            res.status(200).json({
                message: "User deleted successfully. It's gone!"
            })
        } catch (error) {
            res.status(500).json({
                message: "Couldn't delete the user, try again!",
                error: error.message,
            });
        }

    }
};
