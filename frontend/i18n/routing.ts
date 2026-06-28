import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "ar"] as const;
export const defaultLocale = "fr" as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
