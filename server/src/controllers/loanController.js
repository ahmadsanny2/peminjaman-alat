import Tool from "../models/Tool.js"
import Loan from "../models/Loan.js"

export default {
    async createLoan(req, res) {
        try {
            const { toolId, borrowDate, expectedReturnDate } = req.body
            const borrowerId = req.user.id

            const tool = await Tool.findById(toolId)
            if (!tool) {
                return res.status(404).json({
                    message: "Alat tidak ditemukan."
                })
            }

            if (tool.stock < 1) {
                return res.status(400).json({
                    message: "Stok alat sedang kosong."
                })
            }

            const activeLoan = await Loan.findOne({
                borrower: borrowerId,
                tool: toolId,
                status: { $in: ['pending', 'approved'] }
            })

            if (activeLoan) {
                return res.status(400).json({
                    message: "Anda masih meminjam alat ini dan belum dikembalikan."
                })
            }

            const newLoan = await Loan.create({
                borrower: borrowerId,
                tool: toolId,
                borrowDate: borrowDate || new Date(),
                expectedReturnDate,
                status: 'pending'
            })

            res.status(201).json({
                message: "Pengajuan peminjaman berhasil. Menunggu persetujuan petugas.",
                data: newLoan
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    },

    async getMyLoans(req, res) {
        try {
            const myLoans = await Loan.find({ borrower: req.user.id })
                .populate('tool', 'name image')
                .sort({ createdAt: -1 })

            res.status(200).json({
                data: myLoans
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}