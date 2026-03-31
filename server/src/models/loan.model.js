import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Loan = sequelize.define(
    "Loan",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM("pending", "approved", "canceled", "rejected", "returned"),
            defaultValue: "pending",
        },
        borrowDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        expectedReturnDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        actualReturnDate: {
            type: DataTypes.DATE,
        },
        image: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: "loans",
    },
);

export default Loan;
