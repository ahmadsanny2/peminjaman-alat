import { Tool, Category } from "../models/index.js";

export default {
    async createTools(req, res) {
        const { name, stock, image, categoryId } = req.body;

        try {
            const categoryExists = await Category.findByPk(categoryId);
            if (!categoryExists) {
                return res.status(404).json({
                    message: "Category not found",
                });
            }

            const toolExist = await Tool.findOne({
                where: { name: name }
            })

            if (toolExist) {
                return res.status(409).json({
                    message: "Name tool must be unique"
                })
            }

            const newTool = await Tool.create({
                name,
                stock,
                image,
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
            const tools = await Tool.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ["id", "name"],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json({
                message: "Tools retrieved successfully",
                data: tools,
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

            await tool.update(req.body);
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