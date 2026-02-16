import { z } from "zod";

export const toolSchema = z.object({
    name: z.string().min(3, {
        message: "Tool name must be at least 3 characters.",
    }),
    categoryId: z.string().uuid({
        message: "Invalid category ID.",
    }),
    stock: z.preprocess(
        (val) => Number(val),
        z.number().min(0, {
            message: "Stock must be at least 0.",
        }),
    ),
    image: z.string().optional,
});
