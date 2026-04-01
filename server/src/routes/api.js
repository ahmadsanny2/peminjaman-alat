import express from "express";

import authController from "../controllers/auth.controller.js";
import categoryController from "../controllers/category.controller.js";
import toolController from "../controllers/tool.controller.js";
import loanController from "../controllers/loan.controller.js";
import userController from "../controllers/user.controller.js";
import activityController from "../controllers/activity.controller.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadsMiddleware.js";

const router = express.Router();

// Auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

router.use(verifyToken);

// Management User
router.get("/users", checkRole(["admin"]), userController.getAllUsers);
router.put("/users/:id", checkRole(["admin"]), userController.updateUser);
router.delete("/users/:id", checkRole(["admin"]), userController.deleteUser);

// Management Category
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

// Management Tool
router.get("/tools", toolController.getAllTools);
router.post(
    "/tools",
    checkRole(["admin"]),
    upload.single("image"),
    toolController.createTools,
);
router.put(
    "/tools/:id",
    checkRole(["admin"]),
    upload.single("image"),
    toolController.updateTool,
);
router.delete("/tools/:id", checkRole(["admin"]), toolController.deleteTool);

// Management Loan
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
    "/loans/:id/cancel",
    checkRole(["peminjam"]),
    loanController.cancelLoan,
);
router.put(
    "/loans/:id/approve",
    checkRole(["admin", "petugas"]),
    loanController.approveLoan,
);
router.put(
    "/loans/:id/reject",
    checkRole(["admin", "petugas"]),
    loanController.rejectLoan,
);
router.put(
    "/loans/:id/return",
    checkRole(["peminjam"]),
    upload.single("image"),
    loanController.returnLoan,
);
router.put(
    "/loans/:id/verifying",
    checkRole(["admin", "petugas"]),
    loanController.verifying,
);

router.get("/logs", checkRole(["admin"]), activityController.getLogs);

export default router;
