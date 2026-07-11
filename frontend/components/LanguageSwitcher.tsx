"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Locale } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const locales: Locale[] = ["fr", "ar"];

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            locale === loc
              ? "bg-nuria text-white shadow-sm"
              : "text-slate-600 hover:bg-white hover:text-nuria"
          }`}
        >
          {t(loc)}
        </Link>
      ))}
    </div>
  );
}
