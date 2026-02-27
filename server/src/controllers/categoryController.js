import { Category } from "../models/index.js";
import { recordActivity } from "../utils/logger.js"; // <-- Tambahkan baris ini

export default {
    async getAllCategories(req, res) {
        try {
            const categories = await Category.findAll({
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json({
                data: categories,
            });
        } catch (error) {
            res.status(500).json({
                message: "An error occurred while retrieving categories",
                error: error.message,
            });
        }
    },
    async createCategory(req, res) {
        try {
            const { name, description } = req.body;

            const newCategory = await Category.create({
                name,
                description,
            });

            await recordActivity(
                req.user.id,
                "TAMBAH KATEGORI",
                `${req.user.fullName} telah menambahkan kategori baru: ${name}`,
            );

            res.status(201).json({
                message: "Category created successfully",
                data: newCategory,
            });
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({
                    message: "Category name must be unique",
                });
            }

            res.status(500).json({
                message: "An error occurred while creating the category",
                error: error.message,
            });
        }
    },

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({
                    message: "Category not found",
                });
            }

            await category.update(req.body);

            res.status(200).json({
                message: "Category updated successfully",
                data: category,
            });
        } catch (error) {
            res.status(500).json({
                message: "An error occurred while updating the category",
                error: error.message,
            });
        }
    },

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;

            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({
                    message: "Category not found",
                });
            }

            await category.destroy();

            res.status(200).json({
                message: "Category deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                message: "An error occurred while deleting the category",
                error: error.message,
            });
        }
    },
};
