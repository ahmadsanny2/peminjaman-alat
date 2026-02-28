import { ActivityLog, User } from "../models/index.js";

export default {
    async getLogs(req, res) {
        try {
            const logs = await ActivityLog.findAll({
                include: [
                    { model: User, as: "actor", attributes: ["fullName", "role"] },
                ],
                order: [["createdAt", "DESC"]],
                limit: 100,
            });
            res.status(200).json({ data: logs });
        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve user activity log data.",
                error: error.message,
            });
        }
    },
};
