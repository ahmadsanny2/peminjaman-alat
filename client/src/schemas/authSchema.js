import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().trim().min(1, {
        message: "Please enter your username.",
    }),
    password: z.string().min(1, {
        message: "Please enter your password.",
    }),
});
export const registerSchema = z
    .object({
        fullName: z.string().trim().min(3, "Full name must be at least 3 characters."),
        username: z
            .string()
            .trim()
            .min(4, "Username must be at least 4 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .regex(/[a-z]/, "Include at least one lowercase letter.")
            .regex(/[A-Z]/, "Include at least one uppercase letter.")
            .regex(/[0-9]/, "Include at least one number")
            .regex(/[^a-zA-Z0-9]/, "Include at least one special character"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });