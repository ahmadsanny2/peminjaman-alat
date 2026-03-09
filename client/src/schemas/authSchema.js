import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().trim().min(1, {
        message: "Username is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});
export const registerSchema = z
    .object({
        fullName: z.string().trim().min(3, "Nama lengkap minimal 3 karakter"),
        username: z
            .string()
            .trim()
            .min(4, "Username minimal 4 karakter")
            .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
        password: z
            .string()
            .min(8, "Password minimal 8 karakter")
            .regex(/[a-z]/, "Harus mengandung huruf kecil")
            .regex(/[A-Z]/, "Harus mengandung huruf besar")
            .regex(/[0-9]/, "Harus mengandung angka")
            .regex(/[^a-zA-Z0-9]/, "Harus mengandung simbol/karakter khusus"),
        confirmPassword: z.string().min(1, "Konfirmasi password diperlukan"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password tidak cocok",
        path: ["confirmPassword"],
    });