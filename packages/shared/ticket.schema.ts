import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
