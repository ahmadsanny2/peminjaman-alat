import { Loan, Tool, User, sequelize } from "../models/index.js";

export default {
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
};
