import { z } from "zod";

export const orderIdSchema = z.object({
  id: z.string().cuid("Invalid order ID."),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().cuid("Invalid product ID."),
    quantity: z.coerce.number().int().positive().max(100),
  }).strict()).min(1, "At least one product is required.").max(50),
}).strict();

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
}).strict();
