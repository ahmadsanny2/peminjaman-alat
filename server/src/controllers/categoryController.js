import { Op } from "sequelize";
import { Category } from "../models/index.js";
import { recordActivity } from "../utils/logger.js";

export default {
    async getAllCategories(req, res) {
        try {
            let { page, limit, sort, search } = req.query;
            const queryOptions = {}

            // Search Category Name
            if (search) {
                queryOptions.where = {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                }
            }

            // Sorting Data
            if (sort === "oldest") {
                queryOptions.order = [["createdAt", "ASC"]]
            } else {
                queryOptions.order = [["createdAt", "DESC"]]
            }

            // Pagination
            if (page && limit) {
                page = parseInt(page);
                limit = parseInt(limit);

                queryOptions.limit = limit
                queryOptions.offset = (page - 1) * limit;
            }

            const { count, rows } = await Category.findAndCountAll({
                ...queryOptions,
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
                "ADD CATEGORY",
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

            await recordActivity(
                req.user.id,
                "UPDATE CATEGORY",
                `${req.user.fullName} telah memperbarui kategori. ID kategori: ${category.id}`
            )

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

            await recordActivity(
                req.user.id,
                "DELETE CATEGORY",
                `${req.user.fullName} telah menghapus kategori. ID kategori: ${category.id}`
            )

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
