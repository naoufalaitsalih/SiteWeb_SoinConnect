import { defaultLocale, locales } from "@/i18n/routing";

export type AppLocale = (typeof locales)[number];

/** Aligné sur i18n/routing (Edge-safe) — ne pas lire process.env ici pour le middleware. */
export const DEFAULT_LOCALE: AppLocale = defaultLocale;

export const APP_TIME_ZONE = "Africa/Casablanca";
