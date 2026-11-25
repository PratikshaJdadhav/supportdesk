import { z } from "zod";

export const ticketCategorySchema = z.enum([
  "General",
  "Account Access",
  "Billing",
  "Technical Issue",
]);

export const ticketClassificationSchema = z.object({
  category: ticketCategorySchema,
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
}).strict();

export type TicketClassification = z.infer<
  typeof ticketClassificationSchema
>;
