import { z } from "zod";
import { sanitizeMetadata } from "../utils/sanitizeMetadata";

/** Événements autorisés côté public (analytics) */
export const PUBLIC_EVENT_TYPES = [
  "page_view",
  "button_click",
  "form_start",
  "form_submit",
  "form_error",
  "api_error",
] as const;

/** Tous les types (y compris admin — réservés au serveur) */
export const EVENT_TYPES = [
  ...PUBLIC_EVENT_TYPES,
  "admin_login_success",
  "admin_login_failed",
] as const;

export const createPublicEventLogSchema = z
  .object({
    eventType: z.enum(PUBLIC_EVENT_TYPES),
    pageUrl: z.string().trim().max(500).optional(),
    elementName: z.string().trim().max(255).optional(),
    sessionId: z.string().trim().max(64).optional(),
    userAgent: z.string().trim().max(1000).optional(),
    browser: z.string().trim().max(100).optional(),
    os: z.string().trim().max(100).optional(),
    deviceType: z.string().trim().max(50).optional(),
    referrer: z.string().trim().max(500).optional(),
    locale: z.string().trim().max(10).optional(),
    timezone: z.string().trim().max(100).optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .transform((data) => ({
    ...data,
    userRole: "visitor" as const,
    metadata: sanitizeMetadata(data.metadata),
  }));

export type CreatePublicEventLogInput = z.infer<typeof createPublicEventLogSchema>;

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)");

export const listEventLogsQuerySchema = z.object({
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const deleteEventLogsSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1).max(500),
});

export const clearEventLogsSchema = z.object({
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
});

export type ListEventLogsQuery = z.infer<typeof listEventLogsQuerySchema>;
