import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import BenefitCard, { type BenefitIconKey } from "@/components/benefits/BenefitCard";

const benefitKeys = ["comfort", "verified", "personalized", "process"] as const;

const benefitConfig: Record<
  (typeof benefitKeys)[number],
  { image: string; icon: BenefitIconKey; featured: boolean }
> = {
  comfort: {
    image: "/images/benefits/home-comfort.jpg",
    icon: "home",
    featured: true,
  },
  verified: {
    image: "/images/benefits/verified-professionals.jpg",
    icon: "shield",
    featured: true,
  },
  personalized: {
    image: "/images/benefits/personal-support.jpg",
    icon: "heart",
    featured: false,
  },
  process: {
    image: "/images/benefits/simple-process.jpg",
    icon: "calendar",
    featured: false,
  },
};

const gainKeys = ["simplicity", "travel", "centralized", "followUp"] as const;

export default async function BenefitsSection() {
  const t = await getTranslations("benefits");

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-nuria-bg/80 via-white to-white py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -start-28 top-24 h-80 w-80 rounded-full bg-nuria/15 blur-3xl" />
        <div className="absolute -end-24 bottom-16 h-72 w-72 rounded-full bg-nuria-rose-soft blur-3xl" />
        <div className="absolute start-1/2 top-0 h-48 w-[520px] -translate-x-1/2 rounded-full bg-nuria/10 blur-3xl rtl:translate-x-1/2" />
      </div>

      <div className="section-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {benefitKeys.map((key) => {
            const { image, icon, featured } = benefitConfig[key];
            return (
              <BenefitCard
                key={key}
                title={t(`${key}.title`)}
                description={t(`${key}.description`)}
                imageSrc={image}
                imageAlt={t(`${key}.imageAlt`)}
                icon={icon}
                featured={featured}
              />
            );
          })}
        </div>

        <div className="mt-14 rounded-[32px] border border-slate-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8 lg:mt-16">
          <h3 className="text-center text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {t("gains.title")}
          </h3>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            {gainKeys.map((key) => (
              <span
                key={key}
                className="inline-flex items-center gap-2.5 rounded-full border border-nuria/15 bg-nuria-soft/70 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-nuria/25 hover:bg-nuria-soft hover:shadow-md"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-nuria" strokeWidth={2} />
                {t(`gains.${key}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
