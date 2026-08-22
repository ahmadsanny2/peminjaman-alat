import { User, sequelize } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { recordActivity } from "../utils/logger.js";

export default {
    async register(req, res) {
        const { fullName, username, password, confirmPassword } = req.body;
        const transaction = await sequelize.transaction();

        try {
            if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3) {
                await transaction.rollback();
                return res.status(400).json({
                    message: "Full name must be at least 3 characters.",
                });
            }

            if (!username || typeof username !== "string" || username.trim().length < 4) {
                await transaction.rollback();
                return res.status(400).json({
                    message: "Username must be at least 4 characters.",
                });
            }

            if (!password || !confirmPassword) {
                await transaction.rollback();
                return res.status(400).json({
                    message: "Password and confirmation password are required.",
                });
            }

            if (password !== confirmPassword) {
                await transaction.rollback();
                return res.status(400).json({
                    message: "Passwords don't match, double-check them!",
                });
            }

            const formattedFullName = fullName
                .trim()
                .toLowerCase()
                .split(/\s+/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            const cleanUsername = username.trim().toLowerCase();

            const existingUser = await User.findOne({
                where: { username: cleanUsername },
                transaction,
            });

            if (existingUser) {
                await transaction.rollback();
                return res.status(409).json({
                    message: "That username is already taken, try another one!",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Selalu tetapkan role sebagai peminjam untuk pendaftaran publik (Cegah Privilege Escalation)
            const newUser = await User.create({
                fullName: formattedFullName,
                username: cleanUsername,
                password: hashedPassword,
                role: "peminjam",
            }, { transaction });

            await recordActivity(
                newUser.id,
                "REGISTER",
                `${newUser.fullName} just joined the system.`,
                transaction
            );
            
            await transaction.commit();

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
            await transaction.rollback();
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
