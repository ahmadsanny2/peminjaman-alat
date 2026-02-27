import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ActivityLog = sequelize.define(
    "ActivityLog",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: "activity_logs",
        timestamps: true,
        updatedAt: false,
    },
);

export default ActivityLog;
