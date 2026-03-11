import { Op } from "sequelize";
import { ActivityLog, User } from "../models/index.js";

export default {
    async getLogs(req, res) {
        try {
            let { sort, activity, page, limit } = req.query;

            const queryOptions = {
                where: {}
            }

            if (sort === "oldest") {
                queryOptions.order = [["createdAt", "ASC"]]
            } else {
                queryOptions.order = [["createdAt", "DESC"]]
            }

            if (activity) {
                queryOptions.where.action = {
                    [Op.like]: `%${activity}%`
                }
            }

            if (page && limit) {
                page = parseInt(page)
                limit = parseInt(limit)

                queryOptions.limit = limit
                queryOptions.offset = (page - 1) * limit
            }

            const { count, rows } = await ActivityLog.findAndCountAll({
                ...queryOptions,
                include: [
                    { model: User, as: "actor", attributes: ["fullName", "role"] },
                ],
            })

            res.status(200).json({
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve user activity log data.",
                error: error.message,
            });
        }
    },
};
