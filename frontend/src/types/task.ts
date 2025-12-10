import { z } from "zod";

export const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    assigneeEmail: z
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
