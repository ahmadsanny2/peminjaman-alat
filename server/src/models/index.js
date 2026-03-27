import sequelize from "../config/db.js";
import User from "./user.model.js";
import Category from "./category.model.js";
import Tool from "./tool.model.js";
import Loan from "./loan.model.js"
import ActivityLog from "./activity.model.js";

Category.hasMany(Tool, { foreignKey: "categoryId" });
Tool.belongsTo(Category, { foreignKey: "categoryId" });

User.hasMany(Loan, { foreignKey: "borrowerId", as: "borrowings" });
Loan.belongsTo(User, { foreignKey: "borrowerId", as: "borrower" });

User.hasMany(Loan, { foreignKey: "officerId", as: "approvals" });
Loan.belongsTo(User, { foreignKey: "officerId", as: "officer" });

Tool.hasMany(Loan, { foreignKey: "toolId" });
Loan.belongsTo(Tool, { foreignKey: "toolId" });

User.hasMany(ActivityLog, { foreignKey: "userId", as: "activities" });
ActivityLog.belongsTo(User, { foreignKey: "userId", as: "actor" });

export { sequelize, User, Category, Tool, Loan, ActivityLog };