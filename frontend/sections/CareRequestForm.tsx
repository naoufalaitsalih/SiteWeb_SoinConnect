import { getTranslations } from "next-intl/server";
import CareRequestFormClient from "@/components/request-form/CareRequestFormClient";
import RequestFormAside from "@/components/request-form/RequestFormAside";

export default async function CareRequestForm() {
  const t = await getTranslations("form");

  return (
    <section
      id="request-form"
      className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -start-24 top-20 h-72 w-72 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute -end-20 bottom-16 h-64 w-64 rounded-full bg-medical-100/20 blur-3xl" />
      </div>

      <div className="section-container relative">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <CareRequestFormClient />
          </div>
          <div className="lg:col-span-2">
            <RequestFormAside />
          </div>
        </div>
      </div>
    </section>
  );
}
