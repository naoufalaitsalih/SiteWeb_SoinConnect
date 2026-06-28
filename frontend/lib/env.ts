import { defaultLocale, locales } from "@/i18n/routing";

export type AppLocale = (typeof locales)[number];

/** Locale par défaut alignée sur i18n/routing. */
export const DEFAULT_LOCALE: AppLocale = defaultLocale;

export const APP_TIME_ZONE = "Africa/Casablanca";
