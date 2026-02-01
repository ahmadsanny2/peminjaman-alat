import Tool from "../models/Tool.js";
import Loan from "../models/Loan.js";

export default {
    async createLoan(req, res) {
        try {
            const { toolId, borrowDate, expectedReturnDate } = req.body;
            const borrowerId = req.user.id;

            const tool = await Tool.findById(toolId);
            if (!tool) {
                return res.status(404).json({
                    message: "Alat tidak ditemukan.",
                });
            }

            if (tool.stock < 1) {
                return res.status(400).json({
                    message: "Stok alat sedang kosong.",
                });
            }

            const activeLoan = await Loan.findOne({
                borrower: borrowerId,
                tool: toolId,
                status: { $in: ["pending", "approved"] },
            });

            if (activeLoan) {
                return res.status(400).json({
                    message: "Anda masih meminjam alat ini dan belum dikembalikan.",
                });
            }

            const newLoan = await Loan.create({
                borrower: borrowerId,
                tool: toolId,
                borrowDate: borrowDate || new Date(),
                expectedReturnDate,
                status: "pending",
            });

            res.status(201).json({
                message: "Pengajuan peminjaman berhasil. Menunggu persetujuan petugas.",
                data: newLoan,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    },

    async getMyLoans(req, res) {
        try {
            const myLoans = await Loan.find({ borrower: req.user.id })
                .populate("tool", "name image")
                .sort({ createdAt: -1 });

            res.status(200).json({
                data: myLoans,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    },

    async approveLoan(req, res) {
        const { id } = req.params;
        const officerId = req.user.id;

        try {
            const loan = await Loan.findById(id);
            if (!loan) {
                return res.status(404).json({
                    message: "Pinjaman tidak ditemukan.",
                });
            }

            if (loan.status !== "pending") {
                return res.status(400).json({
                    message: "Hanya peminjaman berstatus 'pending' yang bisa disetujui.",
                });
            }

            const tool = await Tool.findById(loan.tool);
            if (!tool || tool.stock < 1) {
                return res.status(400).json({
                    message: "Stok alat habis, tidak bisa menyetujui.",
                });
            }

            loan.status = "approved";
            loan.officer = officerId;

            tool.stock -= 1;

            await loan.save();
            await tool.save();

            res.status(200).json({
                message: "Peminjaman disetujui dan stok alat telah diperbarui.",
                data: loan,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    },

    async returnLoan(req, res) {
        const { id } = req.params;

        try {
            const loan = await Loan.findById(id);
            if (!loan) {
                return res.status(404).json({
                    message: "Pinjaman tidak ditemukan.",
                });
            }

            if (loan.status !== "approved") {
                return res.status(400).json({
                    message: "Barang ini belum dipinjam atau sudah dikembalikan.",
                });
            }

            loan.status = "returned";
            loan.actualReturnDate = new Date();

            const tool = await Tool.findById(loan.tool);
            if (tool) {
                tool.stock += 1;
                await tool.save();
            }

            await loan.save();

            res.status(200).json({
                message: "Barang berhasil dikembalikan. Stok telah dipulihkan.",
                data: loan,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    },

    async getAllLoans(req, res) {
        try {
            const loans = await Loan.find()
                .populate("borrower", "fullName")
                .populate("tool", "name")
                .populate("officer", "fullName")
                .sort({ createdAt: -1 });

            res.status(200).json({
                data: loans,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    },
};
