import { Loan, Tool, User, sequelize } from "../models/index.js";
import { recordActivity } from "../utils/logger.js";

export default {
    async getAllLoans(req, res) {
        try {
            const loan = await Loan.findAll({
                include: [
                    {
                        model: Tool,
                        attributes: ["name"],
                    },
                    {
                        model: User,
                        as: "borrower",
                        attributes: ["fullName", "username"],
                    },
                    {
                        model: User,
                        as: "officer",
                        attributes: ["fullName"],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json({
                message: "All loans retrieved successfully",
                data: loan,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error fetching loans",
                error: error.message,
            });
        }
    },

    async getMyLoans(req, res) {
        try {
            const myLoans = await Loan.findAll({
                where: { borrowerId: req.user.id },
                include: [
                    {
                        model: Tool,
                        attributes: ["id", "name", "image"],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json({
                message: "My loans retrieved successfully",
                data: myLoans,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error fetching loans",
                error: error.message,
            });
        }
    },

    async createLoans(req, res) {
        const { toolId, expectedReturnDate } = req.body;
        const borrowerId = req.user.id;

        try {
            const tool = await Tool.findByPk(toolId);
            if (!tool) {
                return res.status(404).json({
                    message: "Tool not found",
                });
            }
            if (tool.stock < 1) {
                return res.status(400).json({
                    message: "Tool is not available",
                });
            }

            const activeLoan = await Loan.findOne({
                where: {
                    borrowerId,
                    toolId,
                    status: ["pending", "approved"],
                },
            });

            if (activeLoan) {
                return res.status(409).json({
                    message: "You have already borrowed this tool",
                });
            }

            const newLoan = await Loan.create({
                borrowerId,
                toolId,
                expectedReturnDate,
                status: "pending",
            });

            await recordActivity(
                req.user.id,
                "LOAN APPLICATION",
                `${req.user.fullName} telah melakukan pengajuan peminjaman alat. Nama alat: ${tool.name}`,
            );

            return res.status(201).json({
                message: "Loan request created successfully",
                data: newLoan,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error creating loan request",
                error: error.message,
            });
        }
    },

    async approveLoan(req, res) {
        const { id } = req.params;
        const officerId = req.user.id;

        const transaction = await sequelize.transaction();

        try {
            const loan = await Loan.findByPk(id, { transaction });
            if (!loan) {
                await transaction.rollback();
                return res.status(404).json({
                    message: "Loan not found",
                });
            }

            if (loan.status !== "pending") {
                await transaction.rollback();
                return res.status(400).json({
                    message: "Loan is not pending",
                });
            }

            const tool = await Tool.findByPk(loan.toolId, { transaction });
            if (!tool || tool.stock < 1) {
                await transaction.rollback();
                return res.status(400).json({
                    message: "Tool is not available",
                });
            }

            await loan.update(
                {
                    status: "approved",
                    officerId,
                },
                { transaction },
            );
            await tool.decrement("stock", { by: 1, transaction });

            await transaction.commit();

            await recordActivity(
                req.user.id,
                "APPROVE LOAN",
                `${req.user.fullName} telah menyetujui peminjaman alat '${tool.name}' untuk ID transaksi: ${loan.id}`,
            );

            res.status(200).json({
                message: "Loan approved successfully",
                data: loan,
            });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({
                message: "Error approving loan",
                error: error.message,
            });
        }
    },

    async rejectLoan(req, res) {
        const { id } = req.params;
        const officerId = req.user.id;

        const transaction = await sequelize.transaction();

        try {
            const loan = await Loan.findByPk(id, { transaction });

            if (!loan) {
                await transaction.rollback();
                res.status(404).json({
                    message: "Loan not found",
                });
            }

            if (!loan.status === "pending") {
                await transaction.rollback();
                res.status(400).json({
                    message: "Loan is not pending",
                });
            }

            const tool = await Tool.findByPk(loan.toolId, { transaction });
            if (!tool || tool.stock < 1) {
                await transaction.rollback();
                res.status(400).json({
                    message: "Tool is not available",
                });
            }

            await loan.update(
                {
                    status: "rejected",
                    officerId,
                },
                {
                    transaction,
                },
            );

            await transaction.commit();

            await recordActivity(
                req.user.id,
                "REJECT LOAN APPLICATION",
                `${req.user.fullName} telah menolak pengajuan peminjaman alat. Nama alat: ${tool.name}`,
            );

            res.status(201).json({
                message: "Loan request is rejected",
            });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({
                message: "Error reject loan",
                error: error.message,
            });
        }
    },

    async returnLoan(req, res) {
        const { id } = req.params;
        const transaction = await sequelize.transaction();

        try {
            const loan = await Loan.findByPk(id, { transaction });
            if (!loan || loan.status !== "approved") {
                await transaction.rollback();
                return res.status(404).json({
                    message: "Loan not found or not approved",
                });
            }

            const tool = await Tool.findByPk(loan.toolId, { transaction });

            await loan.update(
                {
                    status: "returned",
                    actualReturnDate: new Date(),
                },
                { transaction },
            );

            if (tool) {
                await tool.increment("stock", { by: 1, transaction });
            }

            await transaction.commit();

            await recordActivity(
                req.user.id,
                "RETURN LOAN",
                `${req.user.fullName} telah memvalidasi pengembalian peminjaman alat. Nama alat: ${tool.name}`,
            );

            res.status(200).json({
                message: "Loan returned successfully",
                data: loan,
            });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({
                message: "Error returning loan",
                error: error.message,
            });
        }
    },
};
