import { z } from "zod";

const phoneRegex = /^[\d\s+().-]{8,20}$/;

const CARE_TYPES = [
  "Soins infirmiers",
  "Aide à la personne",
  "Suivi post-opératoire",
  "Accompagnement senior",
  "Soins spécialisés",
  "Autre besoin",
] as const;

export const createCareRequestSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Le nom complet doit contenir au moins 2 caractères")
    .max(255, "Le nom complet est trop long"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Numéro de téléphone invalide"),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  address: z
    .string()
    .trim()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(1000, "L'adresse est trop longue"),
  careType: z.enum(CARE_TYPES, {
    errorMap: () => ({ message: "Type de soin invalide" }),
  }),
  description: z
    .string()
    .trim()
    .max(2000, "La description est trop longue")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  requestedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide (format YYYY-MM-DD)"),
  requestedTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Heure invalide (format HH:MM)"),
  isUrgent: z.boolean(),
});

export type CreateCareRequestInput = z.infer<typeof createCareRequestSchema>;

export { CARE_TYPES };
