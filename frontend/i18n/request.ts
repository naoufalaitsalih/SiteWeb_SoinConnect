import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "./routing";
import frMessages from "../messages/fr.json";
import arMessages from "../messages/ar.json";

const messages = {
  fr: frMessages,
  ar: arMessages,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = hasLocale(routing.locales, requested)
    ? (requested as Locale)
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale],
    onError(error) {
      if (error.code === "ENVIRONMENT_FALLBACK") {
        return;
      }
      console.error(error);
    },
  };
});
