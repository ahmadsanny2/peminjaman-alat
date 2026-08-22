import { ActivityLog, User } from "../models/index.js";

import { Op } from "sequelize";

export default {
    async getLogs(req, res) {
        try {
            let { search, sort, activity, page, limit } = req.query;

            const queryOptions = {
                where: {},
                order: [["createdAt", sort === "ASC" ? "ASC" : "DESC"]],
            };

            if (search) {
                queryOptions.where["$actor.fullName$"] = {
                    [Op.like]: `%${search}%`
                }
            }

            if (activity) {
                queryOptions.where.action = activity
            }

            const parsedPage = Math.max(1, parseInt(page, 10) || 1);
            const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);

            queryOptions.limit = parsedLimit;
            queryOptions.offset = (parsedPage - 1) * parsedLimit;

            const { count, rows } = await ActivityLog.findAndCountAll({
                ...queryOptions,
                include: [
                    {
                        model: User,
                        as: "actor",
                        attributes: ["fullName", "role"]
                    },
                ],
            });

            res.status(200).json({
                totalItems: count,
                totalPages: Math.ceil(count / parsedLimit) || 1,
                currentPage: parsedPage,
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
