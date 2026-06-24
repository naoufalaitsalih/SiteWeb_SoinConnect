import { getRequestConfig } from "next-intl/server";
import { hasLocale, IntlErrorCode } from "next-intl";
import { routing, type Locale } from "./routing";
import { APP_TIME_ZONE } from "@/lib/env";
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
    timeZone: APP_TIME_ZONE,
    now: new Date(),
    onError(error) {
      if (
        error.code === IntlErrorCode.MISSING_MESSAGE ||
        error.code === IntlErrorCode.ENVIRONMENT_FALLBACK
      ) {
        return;
      }
      console.error(error);
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter(Boolean).join(".");
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return path;
      }
      return path;
    },
  };
});
