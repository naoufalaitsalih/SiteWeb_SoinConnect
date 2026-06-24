import { getTranslations } from "next-intl/server";
import {
  ClipboardList,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ServiceCard, { type ServiceIconKey } from "@/components/services/ServiceCard";

const serviceKeys = ["nursing", "personalCare", "postOp"] as const;

const serviceConfig: Record<
  (typeof serviceKeys)[number],
  { image: string; icon: ServiceIconKey }
> = {
  nursing: {
    image: "/images/services/nursing-care.jpg",
    icon: "stethoscope",
  },
  personalCare: {
    image: "/images/services/personal-assistance.jpg",
    icon: "heartHandshake",
  },
  postOp: {
    image: "/images/services/post-operative-care.jpg",
    icon: "heartPulse",
  },
};

const reassuranceKeys = ["verified", "organization", "followUp", "requests"] as const;

const reassuranceIcons = {
  verified: ShieldCheck,
  organization: ClipboardList,
  followUp: Sparkles,
  requests: HeartHandshake,
} as const;

export default async function ServicesSection() {
  const t = await getTranslations("services");

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -start-24 top-20 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -end-20 bottom-10 h-64 w-64 rounded-full bg-medical-200/20 blur-3xl" />
      </div>

      <div className="section-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-200/80 bg-white/90 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            {t("badge")}
          </span>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {t("titleBefore")}{" "}
            <span className="text-blue-600">{t("titleHighlight")}</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {serviceKeys.map((key) => {
            const { image, icon } = serviceConfig[key];
            return (
              <ServiceCard
                key={key}
                title={t(`${key}.title`)}
                description={t(`${key}.description`)}
                imageSrc={image}
                imageAlt={t(`${key}.imageAlt`)}
                icon={icon}
                features={[
                  t(`${key}.features.f1`),
                  t(`${key}.features.f2`),
                  t(`${key}.features.f3`),
                  t(`${key}.features.f4`),
                ]}
              />
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8 lg:mt-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {reassuranceKeys.map((key) => {
              const Icon = reassuranceIcons[key];
              return (
                <div
                  key={key}
                  className="flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-slate-800">
                    {t(`reassurance.${key}`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
