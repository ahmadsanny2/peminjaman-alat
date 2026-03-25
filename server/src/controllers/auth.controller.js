import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { recordActivity } from "../utils/logger.js";

export default {
    async register(req, res) {
        const { fullName, username, password, confirmPassword, role } = req.body;

        try {
            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: "Passwords don't match, double-check them!",
                });
            }

            const formattedFullName = fullName
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            const existingUser = await User.findOne({
                where: { username },
            });

            if (existingUser) {
                return res.status(409).json({
                    message: "That username is already taken, try another one!",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                fullName: formattedFullName,
                username,
                password: hashedPassword,
                role,
            });

            await recordActivity(
                newUser.id,
                "REGISTER",
                `${newUser.fullName} just joined the system.`
            )

            res.status(201).json({
                message: "Nice! User registered successfully.",
                data: {
                    id: newUser.id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    role: newUser.role,
                },
            });
        } catch (error) {
            res.status(500).json({
                message: "Oops, something went wrong while registering the user.",
                error: error.message,
            });
        }
    },
    
    async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({
                where: { username },
            });

            if (!user) {
                return res.status(401).json({
                    message: "We couldn't find that username.",
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    message: "Incorrect password, give it another shot!",
                });
            }

            const payload = {
                id: user.id,
                fullName: user.fullName,
                role: user.role,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            await recordActivity(
                user.id,
                "LOGIN",
                `${user.fullName} just logged in.`
            )

            res.status(200).json({
                message: "Logged in successfully. Welcome back!",
                token: token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    role: user.role,
                },
            });
        } catch (error) {
            res.status(500).json({
                message: "Something went wrong on our end while logging you in.",
                error: error.message,
            });
        }
    },
};
