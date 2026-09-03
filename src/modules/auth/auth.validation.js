import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters."),

  email: z
    .email("Please provide a valid email address.")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100),
});


export const loginSchema = z.object({
  email: z
    .email("Please provide a valid email address.")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required."),
});