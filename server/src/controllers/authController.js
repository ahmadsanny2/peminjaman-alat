import { User } from "../models/index.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export default {
    async register(req, res) {
        const { fullName, username, password, confirmPassword, role } = req.body;

        try {
            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: "Password and confirm password do not match",
                })
            }

            const existingUser = await User.findOne({
                where: { username }
            })

            if (existingUser) {
                return res.status(409).json({
                    message: "Username already exists"
                })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = await User.create({
                fullName,
                username,
                password: hashedPassword,
                role
            })

            res.status(201).json({
                message: "User registered successfully",
                data: {
                    id: newUser.id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    role: newUser.role
                }
            })
        } catch (error) {
            res.status(500).json({
                message: "An error occurred while registering the user",
                error:error.message
            })
        }
    },
    async login(req, res) {
        const { username, password } = req.body

        try {
            const user = await User.findOne({
                where: { username }
            })

            if (!user) {
                return res.status(401).json({
                    message: "Username not found"
                })
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({
                    message: "Incorrect password"
                })
            }

            const payload = {
                id: user.id,
                role: user.role
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })

            res.status(200).json({
                message: "Login successfully",
                token: token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    role: user.role
                }
            })
        } catch (error) {
            res.status(500).json({
                message: "An error occurred while logging in the user",
                error: error.message
            })
        }
    }
}