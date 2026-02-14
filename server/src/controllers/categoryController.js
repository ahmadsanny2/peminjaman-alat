import { Category } from "../models/index.js";

export default {
    async createCategory(req, res) {
        try {
            const { name, description } = req.body

            const newCategory = await Category.create({
                name,
                description
            })

            res.status(201).json({
                message: "Category created successfully",
                data: newCategory
            })
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({
                    message: "Category name must be unique"
                })
            }

            res.status(500).json({
                message: "An error occurred while creating the category",
                error: error.message
            })
        }
    },
}