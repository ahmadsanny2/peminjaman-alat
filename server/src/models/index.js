import sequelize from '../config/db.js';
import User from './User.js';
import Category from './Category.js';
import Tool from './Tool.js';
import Loan from './Loan.js';

// Relasi Kategori dan Alat (One-to-Many)
Category.hasMany(Tool, { foreignKey: 'categoryId' });
Tool.belongsTo(Category, { foreignKey: 'categoryId' });

// Relasi Peminjaman dengan Alat dan Pengguna
User.hasMany(Loan, { foreignKey: 'borrowerId', as: 'borrowings' });
Loan.belongsTo(User, { foreignKey: 'borrowerId', as: 'borrower' });

User.hasMany(Loan, { foreignKey: 'officerId', as: 'approvals' });
Loan.belongsTo(User, { foreignKey: 'officerId', as: 'officer' });

Tool.hasMany(Loan, { foreignKey: 'toolId' });
Loan.belongsTo(Tool, { foreignKey: 'toolId' });

export { sequelize, User, Category, Tool, Loan };