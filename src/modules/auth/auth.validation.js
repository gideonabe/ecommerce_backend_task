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

export const updateProfileSchema = z
  .object({
    fullName: z.string().trim().min(3).max(100).optional(),
    currentPassword: z.string().min(1).optional(),
    newPassword: z.string().min(8).max(100).optional(),
  })
  .strict()
  .refine(
    (data) => !data.newPassword || Boolean(data.currentPassword),
    "Current password is required to set a new password."
  )
  .refine(
    (data) => !data.currentPassword || Boolean(data.newPassword),
    "New password is required when current password is provided."
  )
  .refine((data) => Object.keys(data).length > 0, "At least one profile field is required.");