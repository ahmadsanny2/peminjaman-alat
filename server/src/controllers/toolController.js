import Tool from '../models/Tool.js';
import Category from '../models/Category.js'; // Import untuk validasi kategori

export default {
    // 1. CREATE: Menambahkan Alat Baru
    async create(req, res) {
        const { name, code, category, stock, location, image } = req.body;

        try {
            // Validasi 1: Cek apakah Kategori valid (Referential Integrity)
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({
                    message: "Kategori yang dipilih tidak ditemukan."
                });
            }

            // Validasi 2: Cek Uniqness Kode Alat
            const codeExists = await Tool.findOne({ code });
            if (codeExists) {
                return res.status(409).json({ // 409 Conflict
                    message: "Kode inventaris alat sudah digunakan."
                });
            }

            // Proses Penyimpanan
            const newTool = await Tool.create({
                name,
                code,
                category, // Menyimpan ObjectId kategori
                stock,
                location,
                image
            });

            res.status(201).json({
                message: "Alat berhasil ditambahkan",
                data: newTool
            });

        } catch (error) {
            res.status(500).json({
                message: "Gagal menambahkan alat",
                error: error.message
            });
        }
    },

    // 2. READ: Mengambil Semua Data Alat
    async getAll(req, res) {
        try {
            // .populate('category', 'name') berfungsi seperti JOIN di SQL
            // Ini akan mengganti ID kategori dengan Objek Kategori (hanya ambil field name)
            const tools = await Tool.find()
                .populate('category', 'name description')
                .sort({ createdAt: -1 }); // Urutkan dari yang terbaru

            res.status(200).json({
                message: "Berhasil mengambil data alat",
                data: tools
            });
        } catch (error) {
            res.status(500).json({
                message: "Gagal mengambil data",
                error: error.message
            });
        }
    },

    // 3. READ: Mengambil Satu Alat by ID (Detail)
    async getById(req, res) {
        try {
            const { id } = req.params;
            const tool = await Tool.findById(id).populate('category', 'name');

            if (!tool) {
                return res.status(404).json({ message: "Alat tidak ditemukan" });
            }

            res.status(200).json({
                data: tool
            });
        } catch (error) {
            res.status(500).json({
                message: "Terjadi kesalahan server",
                error: error.message
            });
        }
    },

    // 4. UPDATE: Mengubah Data Alat
    async update(req, res) {
        const { id } = req.params;
        const updates = req.body;

        try {
            // Opsi { new: true } agar yang dikembalikan adalah data setelah diedit
            const updatedTool = await Tool.findByIdAndUpdate(id, updates, {
                new: true,
                runValidators: true // Pastikan validasi schema tetap berjalan
            });

            if (!updatedTool) {
                return res.status(404).json({ message: "Alat tidak ditemukan untuk diupdate" });
            }

            res.status(200).json({
                message: "Data alat berhasil diperbarui",
                data: updatedTool
            });
        } catch (error) {
            res.status(500).json({
                message: "Gagal mengupdate alat",
                error: error.message
            });
        }
    },

    // 5. DELETE: Menghapus Alat
    async delete(req, res) {
        const { id } = req.params;

        try {
            const deletedTool = await Tool.findByIdAndDelete(id);

            if (!deletedTool) {
                return res.status(404).json({ message: "Alat tidak ditemukan" });
            }

            res.status(200).json({
                message: "Alat berhasil dihapus permanen"
            });
        } catch (error) {
            res.status(500).json({
                message: "Gagal menghapus alat",
                error: error.message
            });
        }
    }
};