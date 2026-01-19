import Category from "../models/Category.js";

export default {
    // 1. CREATE: Tambah Kategori
    async create(req, res) {
        try {

            const { name, description } = req.body;

            const newCategory = await Category.create({
                name,
                description
            });

            res.status(201).json({
                message: "Kategori berhasil dibuat",
                data: newCategory,
            });

        } catch (error) {
            // Error handling jika nama kembar (karena unique: true di schema)
            if (error.code === 11000) {
                return res.status(409).json({
                    message: "Nama kategori sudah ada",
                });
            }
            res.status(500).json({ message: error.message });
        }
    },

    // 2. READ: Ambil Semua Kategori (Untuk Dropdown di Frontend nanti)
    async getAll(req, res) {
        try {
            const categories = await Category.find();
            res.status(200).json({ data: categories });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // 3. UPDATE: Edit Kategori
    async update(req, res) {
        try {
            const { id } = req.params;
            const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            if (!updatedCategory)
                return res.status(404).json({ message: "Kategori tidak ditemukan" });

            res
                .status(200)
                .json({ message: "Update berhasil", data: updatedCategory });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // 4. DELETE: Hapus Kategori
    async delete(req, res) {
        try {
            const { id } = req.params;
            // TODO: Sebaiknya cek dulu apakah ada Alat yang memakai kategori ini sebelum dihapus
            await Category.findByIdAndDelete(id);
            res.status(200).json({ message: "Kategori dihapus" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
