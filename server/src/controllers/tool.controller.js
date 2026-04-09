import { Category, Tool } from "../models/index.js";

import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import { recordActivity } from "../utils/logger.js";

export default {
    async getAllTools(req, res) {
        try {
            let { page, limit, sort, search, category } = req.query;
            let queryOptions = {
                where: {},
                order: [["createdAt", sort === "ASC" ? "ASC" : "DESC"]]
            }

            let categoryCondition = undefined
            if (category) {
                categoryCondition = {
                    name: {
                        [Op.like]: `${category}`
                    }
                }
            }

            // Search Tools Name
            if (search) {
                queryOptions.where = {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                }
            }

            // Pagination
            if (page && limit) {
                page = parseInt(page);
                limit = parseInt(limit);

                queryOptions.limit = limit;
                queryOptions.offset = (page - 1) * limit;
            }

            const { count, rows } = await Tool.findAndCountAll({
                ...queryOptions,
                include: [
                    {
                        model: Category,
                        attributes: ["id", "name"],
                        where: categoryCondition
                    },
                ],
            });

            res.status(200).json({
                message: "Got the tools list for you!",
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
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
                    message: "Oops, we couldn't find that specific tool.",
                });
            }

            res.status(200).json({
                message: "Here are the details for the tool you requested.",
                data: tool,
            });
        } catch (error) {
            res.status(500).json({
                message: "Something went wrong while fetching the tools.",
                error: error.message,
            });
        }
    },

    async createTools(req, res) {
        const { name, description, stock, condition, categoryId } = req.body;

        try {
            const categoryExists = await Category.findByPk(categoryId);
            if (!categoryExists) {
                return res.status(404).json({
                    message: "We couldn't find the category you picked. Make sure it exists!",
                });
            }

            const toolExist = await Tool.findOne({
                where: { name: name },
            });

            if (toolExist) {
                return res.status(409).json({
                    message: "That tool name is already taken. Try adding a unique name!",
                });
            }

            const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

            const newTool = await Tool.create({
                name,
                description,
                condition,
                stock,
                image: imagePath,
                categoryId,
            });

            await recordActivity(
                req.user.id,
                "ADD TOOL",
                `${req.user.fullName} added a new tool: ${newTool.name}`,
            );

            res.status(201).json({
                message: "Nice! New tool has been added to the inventory.",
                data: newTool,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to create the tool. Please check your data again.",
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
                    message: "Can't update it because we couldn't find that tool.",
                });
            }

            if (req.body.categoryId) {
                const categoryExists = await Category.findByPk(req.body.categoryId);
                if (!categoryExists) {
                    return res.status(404).json({
                        message: "The category you're trying to switch to doesn't exist.",
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
                condition: req.body.condition,
                categoryId: req.body.categoryId,
                image: imagePath,
            };

            await tool.update(updateData);

            await recordActivity(
                req.user.id,
                "UPDATE TOOL",
                `${req.user.fullName} updated tool ID: ${tool.id}`,
            );

            res.status(200).json({
                message: "Tool updated! Everything is up to date now.",
                data: tool,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error updating the tool. Give it another shot.",
                error: error.message,
            });
        }
    },

    async deleteTool(req, res) {
        try {
            const { id } = req.params;
            const tool = await Tool.findByPk(id);

            if (!tool) {
                return res.status(404).json({ message: "Couldn't find the tool you're trying to delete." });
            }


            if (tool.image) {
                const cleanImagePath = tool.image.startsWith('/')
                    ? tool.image.substring(1)
                    : tool.image;

                const filePath = path.resolve(process.cwd(), "public", cleanImagePath);

                console.log("Mencoba menghapus file di:", filePath);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log("File berhasil dihapus dari server");
                } else {
                    console.log("File tidak ditemukan di server, hanya hapus data DB");
                }
            }

            await tool.destroy();

            await recordActivity(
                req.user.id,
                "DELETE TOOL",
                `${req.user.fullName} deleted the tool: ${tool.name}`,
            );

            res.status(200).json({ message: "The tool has been removed from the system." });
        } catch (error) {
            res.status(500).json({
                message: "Something went wrong. The tool is still here.",
                error: error.message,
            });
        }
    }
};
