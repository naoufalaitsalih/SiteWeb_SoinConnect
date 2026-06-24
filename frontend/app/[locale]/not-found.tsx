import { getTranslations, setRequestLocale } from "next-intl/server";
import LocaleLink from "@/components/i18n/LocaleLink";
import { DEFAULT_LOCALE } from "@/lib/env";
import { routing, type Locale } from "@/i18n/routing";

export default async function LocaleNotFound() {
  const locale = routing.locales.includes(DEFAULT_LOCALE as Locale)
    ? (DEFAULT_LOCALE as Locale)
    : routing.defaultLocale;

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {t("description")}
        </p>
        <LocaleLink
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          {t("home")}
        </LocaleLink>
      </div>
    </div>
  );
}
