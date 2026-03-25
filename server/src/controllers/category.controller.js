import { Category } from "../models/index.js";
import { Op } from "sequelize";
import { recordActivity } from "../utils/logger.js";

export default {
    async getAllCategories(req, res) {
        try {
            let { page, limit, sort, search } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;

            let queryOptions = {
                where: {},
                order: [["createdAt", sort === "ASC" ? "ASC" : "DESC"]]
            }

            if (page && limit) {
                queryOptions.limit = limit
                queryOptions.offset = offset
            }

            // Search Category Name
            if (search) {
                queryOptions.where.name = {
                    [Op.like]: `%${search}%`
                }
            }

            const { count, rows } = await Category.findAndCountAll({
                ...queryOptions,
            });

            res.status(200).json({
                message: "Got the categories for you!",
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                message: "Couldn't fetch the categories, something went wrong.",
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
                `${req.user.fullName} just added a new category: ${name}`,
            );

            res.status(201).json({
                message: "Nice! New category added successfully.",
                data: newCategory,
            });
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({
                    message: "That category name already exists, try a different one.",
                });
            }

            res.status(500).json({
                message: "Oops, couldn't create the category. Give it another shot.",
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
                    message: "We couldn't find that category in our records.",
                });
            }

            await category.update(req.body);

            await recordActivity(
                req.user.id,
                "UPDATE CATEGORY",
                `${req.user.fullName} updated category ID: ${category.id}`
            )

            res.status(200).json({
                message: "Category updated! Everything looks good.",
                data: category,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update the category. Something's not right.",
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
                    message: "Can't delete what's not there. Category not found.",
                });
            }

            await category.destroy();

            await recordActivity(
                req.user.id,
                "DELETE CATEGORY",
                `${req.user.fullName} just removed category ID: ${category.id}`
            )

            res.status(200).json({
                message: "Category deleted successfully. It's gone!",
            });
        } catch (error) {
            res.status(500).json({
                message: "Couldn't delete the category, something's blocking it.",
                error: error.message,
            });
        }
    },
};
