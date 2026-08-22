import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().trim().min(1, {
        message: "Silakan masukkan username Anda.",
    }),
    password: z.string().min(1, {
        message: "Silakan masukkan password Anda.",
    }),
});
export const registerSchema = z
    .object({
        fullName: z.string().trim().min(3, "Nama lengkap minimal 3 karakter."),
        username: z
            .string()
            .trim()
            .min(4, "Username minimal 4 karakter.")
            .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh memuat huruf, angka, dan garis bawah (_)."),
        password: z
            .string()
            .min(8, "Password minimal 8 karakter.")
            .regex(/[a-z]/, "Sertakan minimal satu huruf kecil.")
            .regex(/[A-Z]/, "Sertakan minimal satu huruf besar.")
            .regex(/[0-9]/, "Sertakan minimal satu angka.")
            .regex(/[^a-zA-Z0-9]/, "Sertakan minimal satu simbol khusus (@#$%^&*)."),
        confirmPassword: z.string().min(1, "Silakan konfirmasi password Anda."),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Konfirmasi password tidak cocok.",
        path: ["confirmPassword"],
    });