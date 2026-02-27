import { ActivityLog } from '../models/index.js';

/**
 * Utilitas sentral untuk merekam jejak aktivitas operasional.
 * * @param {string} userId 
 * @param {string} action 
 * @param {string} description 
 */
export const recordActivity = async (userId, action, description) => {
    try {
        await ActivityLog.create({
            userId,
            action,
            description
        });
    } catch (error) {

        console.error('There is a discrepancy in the structure of the logging device.', error.message);
    }
};