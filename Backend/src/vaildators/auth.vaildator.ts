import { z } from "zod";

export const emailSchema = z
.string()
.trim()
.email("Invalid email address")
.min(1);

export const passwordSchema = z
.string()
.trim()
.min(8, "Password must be at least 8 characters long")
.max(32, "Password must be less than 32 characters long");

export const registerSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: emailSchema,
    password: passwordSchema,
    avatar: z.string().trim().optional(),
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;