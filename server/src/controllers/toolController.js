import { Tool, Category } from "../models/index.js";
import fs from "fs";
import path from "path";

export default {
    async createTools(req, res) {
        const { name, description, stock, image, categoryId } = req.body;

        try {
            const categoryExists = await Category.findByPk(categoryId);
            if (!categoryExists) {
                return res.status(404).json({
                    message: "Category not found",
                });
            }

            const toolExist = await Tool.findOne({
                where: { name: name },
            });

            if (toolExist) {
                return res.status(409).json({
                    message: "Name tool must be unique",
                });
            }

            const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

            const newTool = await Tool.create({
                name,
                description,
                stock,
                image: imagePath,
                categoryId,
            });

            res.status(201).json({
                message: "Tool created successfully",
                data: newTool,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error creating tool",
                error: error.message,
            });
        }
    },

    async getAllTools(req, res) {
        try {
            // const tools = await Tool.findAll({
            //     include: [
            //         {
            //             model: Category,
            //             attributes: ["id", "name"],
            //         },
            //     ],
            //     order: [["createdAt", "DESC"]],
            // });

            let { page, limit } = req.query;

            const queryOptions = {
                include: [
                    {
                        model: Category,
                        attributes: ["id", "name"],
                    },
                ],
                order: [["createdAt", "DESC"]],
            }

            if (page && limit) {
                page = parseInt(page);
                limit = parseInt(limit);

                queryOptions.limit = limit
                queryOptions.offset = (page - 1) * limit;
            }

            const { count, rows } = await Tool.findAndCountAll({
                ...queryOptions
            });

            res.status(200).json({
                message: "Tools retrieved successfully",
                totalItems: count,
                totalPages: limit ? Math.ceil(count / limit) : 1,
                currentPage: page ? page : 1,
                data: rows,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error retrieving tools",
                error: error.message,
            });
        }
    },

    async getToolById(req, res) {
        try {
            const { id } = req.params;
            const tool = await Tool.findByPk(id, {
                include: [
                    {
                        model: Category,
                        attributes: ["id", "name"],
                    },
                ],
            });

            if (!tool) {
                return res.status(404).json({
                    message: "Tool not found",
                });
            }

            res.status(200).json({
                message: "Tool retrieved successfully",
                data: tool,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error retrieving tool",
                error: error.message,
            });
        }
    },

    async updateTool(req, res) {
        try {
            const { id } = req.params;
            const tool = await Tool.findByPk(id);

            if (!tool) {
                return res.status(404).json({
                    message: "Tool not found",
                });
            }

            if (req.body.categoryId) {
                const categoryExists = await Category.findByPk(req.body.categoryId);
                if (!categoryExists) {
                    return res.status(404).json({
                        message: "Category not found",
                    });
                }
            }

            let imagePath = tool.image;

            if (req.file) {
                if (tool.image) {
                    const oldPath = path.join("public", tool.image);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }
                imagePath = `/uploads/${req.file.filename}`;
            }

            const updateData = {
                name: req.body.name,
                description: req.body.description,
                stock: req.body.stock,
                categoryId: req.body.categoryId,
                image: imagePath,
            };

            await tool.update(updateData);

            res.status(200).json({
                message: "Tool updated successfully",
                data: tool,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error updating tool",
                error: error.message,
            });
        }
    },

    async deleteTool(req, res) {
        try {
            const { id } = req.params;
            const tool = await Tool.findByPk(id);

            if (!tool) {
                return res.status(404).json({
                    message: "Tool not found",
                });
            }

            if (tool.image) {
                const filePath = path.join("public", tool.image);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            await tool.destroy();
            res.status(200).json({
                message: "Tool deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                message: "Error deleting tool",
                error: error.message,
            });
        }
    },
};
