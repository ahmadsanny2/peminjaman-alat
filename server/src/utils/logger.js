import { ActivityLog } from "../models/index.js";

/**
 * * @param {string} userId
 * @param {string} action
 * @param {string} description
 */
export const recordActivity = async (userId, action, description, transaction) => {
    try {
        await ActivityLog.create({
            userId,
            action,
            description,
        }, { transaction });
    } catch (error) {
        console.error(
            "There is a discrepancy in the structure of the logging device.",
            error.message,
        );
    }
};
