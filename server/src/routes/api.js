import express from "express";
import authController from "../controllers/authController.js";
import toolController from "../controllers/toolController.js";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

// Auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Tool
router.post("/admin/dashboard/tools/add-tool", toolController.create);
router.get("/admin/dashboard/tools", toolController.getAll);

// Category
router.post("/admin/dashboard/categories/add-category", categoryController.create);

export default router;
