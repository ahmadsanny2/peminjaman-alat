import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Setting = sequelize.define(
  "Setting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    siteName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pinjamku",
    },
    siteLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landingTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Sistem Peminjaman Alat Digital yang Terstruktur dan Transparan",
    },
    landingSubtitle: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Platform modern dengan sistem 3 level pengguna yang memudahkan pengelolaan, monitoring, dan pelaporan peminjaman alat secara real-time.",
    },
    landingDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { tableName: "settings" },
);

export default Setting;
