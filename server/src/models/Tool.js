import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Tool = sequelize.define(
    "Tool",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        image: {
            type: DataTypes.STRING,
            defaultValue: "default.png",
        },
    },
    {
        tableName: "tools",
    },
);

export default Tool;