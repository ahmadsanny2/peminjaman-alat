import { z } from "zod";

export const toolSchema = z.object({
    name: z.string().min(3, "Nama alat minimal 3 karakter"),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),

    condition: z.union([
        z.enum(["Bagus", "Rusak"]),
        z.literal("").refine(() => false, { message: "Pilih kondisi alat" })
    ]),

    categoryId: z
        .string()
        .min(1, "Silakan pilih kategori alat")
        .uuid("Format kategori tidak valid"),

    stock: z.any()
        .refine((val) => val !== "", { message: "Stok harus diisi" })
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: "Stok harus berupa angka" })
        .pipe(z.number().min(0, "Stok minimal 0")),

    image: z.any().optional()
});