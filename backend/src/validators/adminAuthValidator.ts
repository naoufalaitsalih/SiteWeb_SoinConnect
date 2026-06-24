import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .trim()
    .email("Email invalide"),
  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(1, "Le mot de passe est requis"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
