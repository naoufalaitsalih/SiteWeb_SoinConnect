import { getTranslations } from "next-intl/server";
import { Eye, ListChecks, Lock, ShieldCheck } from "lucide-react";

const trustKeys = ["confidential", "verified", "process", "transparency"] as const;

const trustIcons = {
  confidential: Lock,
  verified: ShieldCheck,
  process: ListChecks,
  transparency: Eye,
} as const;

export default async function TrustSection() {
  const t = await getTranslations("trust");

  return (
    <section
      id="trust"
      className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -end-20 top-16 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute -start-16 bottom-12 h-56 w-56 rounded-full bg-medical-100/25 blur-3xl" />
      </div>

      <div className="section-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {t("titleBefore")}{" "}
            <span className="text-blue-600">{t("titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t("subtitle")}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            {t("analyticsNotice")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {trustKeys.map((key) => {
            const Icon = trustIcons[key];
            return (
              <article
                key={key}
                className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-100">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{t(`${key}.title`)}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {t(`${key}.description`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
