const LOCALES = ["fr", "ar"] as const;
export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = LOCALES.includes(
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE?.trim() as AppLocale
)
  ? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE!.trim() as AppLocale)
  : "fr";

export const APP_TIME_ZONE = "Africa/Casablanca";
