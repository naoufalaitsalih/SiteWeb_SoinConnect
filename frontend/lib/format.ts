import { Locale } from "@/i18n/routing";

export function formatDate(dateString: string, locale: Locale = "fr"): string {
  const dateLocale = locale === "ar" ? "ar-MA" : "fr-FR";
  return new Date(dateString).toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string, locale: Locale = "fr"): string {
  const dateLocale = locale === "ar" ? "ar-MA" : "fr-FR";
  return new Date(dateString).toLocaleString(dateLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
