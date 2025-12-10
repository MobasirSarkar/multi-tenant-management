import { z } from "zod";
export const formSchema = z.object({
    name: z.string().min(3, "Project name must be at least 3 characters"),
    description: z.string().optional(),
    dueDate: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
