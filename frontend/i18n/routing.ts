import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE } from "@/lib/env";

export const routing = defineRouting({
  locales: ["fr", "ar"],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
