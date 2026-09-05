import { z } from "zod";

const productFields = {
  name: z.string().trim().min(1, "Product name is required.").max(120),
  description: z.string().trim().min(1, "Description is required.").max(2000),
  price: z.coerce.number().positive("Price must be greater than zero."),
  stock: z.coerce.number().int().nonnegative("Stock quantity cannot be negative."),
  category: z.string().trim().max(80).optional().nullable(),
  imageUrl: z.url("Image URL must be valid.").optional().nullable(),
};

export const createProductSchema = z.object(productFields).strict();

export const updateProductSchema = z
  .object(productFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, "At least one product field is required.");

export const productIdSchema = z.object({
  id: z.cuid2("Invalid product ID."),
});

export const productQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(80).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "name", "price", "stock"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
}).refine(
  (data) => data.minPrice === undefined || data.maxPrice === undefined || data.minPrice <= data.maxPrice,
  "Minimum price cannot exceed maximum price."
);
