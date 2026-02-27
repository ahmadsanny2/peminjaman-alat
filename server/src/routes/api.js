import express from "express";

import authController from "../controllers/authController.js";
import categoryController from "../controllers/categoryController.js";
import toolController from "../controllers/toolController.js";
import loanController from "../controllers/loanController.js";
import userController from "../controllers/userController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import activityController from "../controllers/activityController.js";

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

router.get("/tools", toolController.getAllTools);
router.post("/tools", checkRole(["admin"]), toolController.createTools);
router.put("/tools/:id", checkRole(["admin"]), toolController.updateTool);
router.delete("/tools/:id", checkRole(["admin"]), toolController.deleteTool);

router.post(
    "/loans/request",
    checkRole(["peminjam"]),
    loanController.createLoans,
);
router.get(
    "/loans/my-loans",
    checkRole(["peminjam"]),
    loanController.getMyLoans,
);
router.get(
    "/loans",
    checkRole(["admin", "petugas"]),
    loanController.getAllLoans,
);
router.put(
    "/loans/:id/approve",
    checkRole(["admin", "petugas"]),
    loanController.approveLoan,
);
router.put(
    "/loans/:id/return",
    checkRole(["admin", "petugas"]),
    loanController.returnLoan,
);

router.get('/logs', checkRole(['admin']), activityController.getLogs);

export default router;
