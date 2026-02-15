import express from "express";
import authController from "../controllers/authController.js";
import categoryController from "../controllers/categoryController.js";
// import { checkRole } from '../middleware/roleMiddleware.js'
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

router.use(verifyToken);

// Categories
router.get("/categories", categoryController.getAllCategories);
router.post(
    "/categories/add-category",
    checkRole(["admin"]),
    categoryController.createCategory,
);

export default router;