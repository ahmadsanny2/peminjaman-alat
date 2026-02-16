import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});

export const registerSchema = z
    .object({
        fullName: z.string().min(3, {
            message: "Full name must be at least 3 characters long",
        }),
        username: z
            .string()
            .min(4, {
                message: "Username must be at least 4 characters long",
            })
            .regex(/^[a-zA-Z0-9_]+$/, {
                message: "Username can only contain letters, numbers, and underscores",
            }),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters long",
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });