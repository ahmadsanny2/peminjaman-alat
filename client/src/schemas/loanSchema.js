import { z } from "zod";

export const loanRequestSchema = z.object({
    toolId: z.string().uuid({
        message: "Invalid tool ID.",
    }),
    expectedReturnDate: z.string().refine(
        (dateString) => {
            const selectedDate = new Date(dateString);
            const today = new Date();

            return selectedDate >= new Date(today.setHours(0, 0, 0, 0));
        },
        {
            message: "Expected return date must be today or in the future.",
        },
    ),
});