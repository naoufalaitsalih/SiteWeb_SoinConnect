import AdminRequestsPage from "@/components/admin/AdminRequestsPage";
import { setRequestLocale } from "next-intl/server";
import { routing, Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminRequestsRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <AdminRequestsPage />;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
