import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().min(2, {
        message: "Nama kategori minimal 2 karakter.",
    }),
    description: z.string().optional(),
});
