import {z} from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
