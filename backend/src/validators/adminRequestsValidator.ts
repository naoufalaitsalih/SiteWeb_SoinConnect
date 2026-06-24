import { z } from "zod";

export const updateAdminNotesSchema = z.object({
  adminNotes: z.string().max(5000).nullable(),
});

export type UpdateAdminNotesInput = z.infer<typeof updateAdminNotesSchema>;
