import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { routing, Locale } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations({ locale, namespace: "admin.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="section-container flex h-14 items-center justify-between gap-4">
          <Link href="/admin/requests" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-medical-600 text-xs font-bold text-white">
              SC
            </span>
            <span className="text-sm font-bold text-slate-900">
              {t("brand")}{" "}
              <span className="font-normal text-slate-500">SoinsConnect</span>
            </span>
          </Link>

          <nav className="flex items-center gap-3 text-sm sm:gap-4">
            <Link href="/admin/requests" className="font-medium text-medical-600">
              {t("requests")}
            </Link>
            <LanguageSwitcher />
            <Link href="/" className="text-slate-500 transition hover:text-medical-600">
              {t("backToSite")}
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
