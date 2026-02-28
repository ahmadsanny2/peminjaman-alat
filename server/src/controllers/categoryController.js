import { Category } from "../models/index.js";
import { recordActivity } from "../utils/logger.js";
import { Op } from "sequelize";

export default {
    async getAllCategories(req, res) {
        try {
            let { page = 1, limit = 5 } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            const offset = (page - 1) * limit;

            const { count, rows } = await Category.findAndCountAll({
                limit,
                offset,
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json({
                message: "Successfully get category data.",
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve category data.",
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
