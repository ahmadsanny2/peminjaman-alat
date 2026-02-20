import express from "express";

import authController from "../controllers/authController.js";
import categoryController from "../controllers/categoryController.js";
import toolController from "../controllers/toolController.js";
import loanController from "../controllers/loanController.js";
import userController from "../controllers/userController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

router.use(verifyToken);

router.get("/users", checkRole(["admin"]), userController.getAllUsers);
router.put("/users/:id/role", checkRole(["admin"]), userController.updateRole);

router.get("/categories", categoryController.getAllCategories);
router.post(
    "/categories",
    checkRole(["admin"]),
    categoryController.createCategory,
);
router.put(
    "/categories/:id",
    checkRole(["admin"]),
    categoryController.updateCategory,
);
router.delete(
    "/categories/:id",
    checkRole(["admin"]),
    categoryController.deleteCategory,
);



export default router;
