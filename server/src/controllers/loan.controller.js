import { Loan, Tool, User, sequelize } from "../models/index.js";

import { Op } from "sequelize";
import { recordActivity } from "../utils/logger.js";

export default {
    async getAllLoans(req, res) {
        try {
            let { search, sort, page, limit } = req.query;
            let queryOptions = {
                where: {},
                order: [["createdAt", sort === "ASC" ? "ASC" : "DESC"]],
            };

            if (search) {
                queryOptions.where["$borrower.fullName$"] = {
                    [Op.like]: `%${search}%`,
                };
            }

            if (page && limit) {
                page = parseInt(page);
                limit = parseInt(limit);

                queryOptions.limit = limit;
                queryOptions.offset = (page - 1) * limit;
            }

            const { count, rows } = await Loan.findAndCountAll({
                ...queryOptions,
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
            });

            res.status(200).json({
                message: "Got all the loan records for you.",
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                message: "Couldn't fetch the loan data right now.",
                error: error.message,
            });
        }
    },

    async getMyLoans(req, res) {
        let { search, status, sort, page, limit } = req.query;
        let queryOptions = {
            where: {
                borrowerId: req.user.id,
            },
            order: [["createdAt", sort === "ASC" ? "ASC" : "DESC"]],
        };

        if (search) {
            queryOptions.where["$Tool.name$"] = {
                [Op.like]: `%${search}%`,
            };
        }

        if (status) {
            queryOptions.where.status = status;
        }

        if (page && limit) {
            page = parseInt(page);
            limit = parseInt(limit);

            queryOptions.limit = limit;
            queryOptions.offset = (page - 1) * limit;
        }

        try {
            const { count, rows } = await Loan.findAndCountAll({
                ...queryOptions,
                include: [
                    {
                        model: Tool,
                        attributes: ["id", "name", "image"],
                    },
                ],
            });

            res.status(200).json({
                message: "Here’s a list of the tools you've borrowed.",
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                message: "Couldn't fetch the loan data right now.",
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
                    message: "We couldn't find that tool in our inventory.",
                });
            }
            if (tool.stock < 1) {
                return res.status(400).json({
                    message: "Sorry, this tool is currently out of stock.",
                });
            }

            const pendingLoan = await Loan.findOne({
                where: {
                    borrowerId,
                    toolId,
                    status: ["pending"],
                },
            });

            if (pendingLoan) {
                return res.status(409).json({
                    message:
                        "You've already requested this. Just hang tight until an officer approves it!",
                });
            }

            const activeLoan = await Loan.findOne({
                where: {
                    borrowerId,
                    toolId,
                    status: ["approved"],
                },
            });

            if (activeLoan) {
                return res.status(409).json({
                    message:
                        "You're still using this tool! Return it first before borrowing it again.",
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
                `${req.user.fullName} just requested to borrow: ${tool.name}`,
            );

            return res.status(201).json({
                message:
                    "Loan request submitted! Wait for the green light from our team.",
                data: newLoan,
            });
        } catch (error) {
            res.status(500).json({
                message: "Oops, something went wrong while processing your request.",
                error: error.message,
            });
            console.log(error);
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
                    message: "Loan request not found.",
                });
            }

            if (loan.status !== "pending") {
                await transaction.rollback();
                return res.status(400).json({
                    message: "This request isn't in 'pending' status anymore.",
                });
            }

            const tool = await Tool.findByPk(loan.toolId, { transaction });
            if (!tool || tool.stock < 1) {
                await transaction.rollback();
                return res.status(400).json({
                    message: "Can't approve this—the tool is currently out of stock.",
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
                `${req.user.fullName} approved the loan for '${tool.name}' (ID: ${loan.id})`,
            );

            res.status(200).json({
                message: "Loan approved! The tool is ready to go.",
                data: loan,
            });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({
                message: "Failed to approve the loan. Try again?",
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
                `${req.user.fullName} rejected a loan request for: ${tool.name}`,
            );

            res.status(201).json({
                message: "Loan request rejected.",
            });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({
                message: "Couldn't process the rejection. Something's off.",
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
                    message: "We couldn't find an active loan for this item.",
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
                `${req.user.fullName} validated the return of: ${tool.name}`,
            );

            res.status(200).json({
                message: "Tool returned successfully. Thanks for taking care of it!",
                data: loan,
            });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({
                message: "There was an error while processing the return.",
                error: error.message,
            });
        }
    },
};
