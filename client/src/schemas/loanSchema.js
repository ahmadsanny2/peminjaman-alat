import { z } from "zod";

export const loanRequestSchema = z.object({
    toolId: z.string({
        message: "ID alat tidak valid.",
    }),
    expectedReturnDate: z.string().refine(
        (dateString) => {
            const selectedDate = new Date(dateString);
            const today = new Date();

            return selectedDate >= new Date(today.setHours(0, 0, 0, 0));
        },
        {
            message: "Tenggat pengembalian harus hari ini atau di masa mendatang.",
        },
    ),
});