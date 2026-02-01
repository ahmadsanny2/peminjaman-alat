import express from "express";
import authController from "../controllers/authController.js";
import toolController from "../controllers/toolController.js";
import categoryController from "../controllers/categoryController.js";
import { checkRole, verifyToken } from "../middleware/authMiddleware.js";
import loanController from "../controllers/loanController.js";

const router = express.Router();

// Auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.use(verifyToken);

// Tool
router.get("/admin/dashboard/tools", toolController.getAll);
router.post("/admin/dashboard/tools/add-tool", toolController.create);

// Category
router.get("/admin/dashboard/categories", categoryController.getAll);
router.post(
    "/admin/dashboard/categories/add-category",
    categoryController.create,
);

router.post(
    "/loans/request",
    checkRole(["peminjam"]),
    loanController.createLoan,
);
router.get("/loans/my-loans", loanController.getMyLoans);
router.put('/loans/:id/approve', checkRole(['petugas', 'admin']), loanController.approveLoan)

export default router;
