import { z } from "zod";

export const adminDemandeStatusSchema = z.enum([
  "ACCEPTEE",
  "REFUSEE",
  "EN_ATTENTE",
]);

export const updateAdminDemandeStatusSchema = z.object({
  status: adminDemandeStatusSchema,
});

export const updateAdminDemandeNotesSchema = z.object({
  admin_notes: z.string().max(5000),
});
