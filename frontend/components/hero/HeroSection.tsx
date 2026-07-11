import { getTranslations } from "next-intl/server";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import HeroVisual from "@/components/hero/HeroVisual";

const featureKeys = ["feature1", "feature2", "feature3"] as const;
const cardKeys = ["card1", "card2", "card3"] as const;
const cardIcons = ["clock", "shield", "sparkles"] as const;

export default async function HeroSection() {
  const t = await getTranslations("hero");
  const titleLine3 = t("titleLine3");

  const cards = cardKeys.map((key, i) => ({
    key,
    title: t(`${key}.title`),
    subtitle: t(`${key}.subtitle`),
    icon: cardIcons[i],
  }));

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-nuria-bg via-white to-white pb-8 pt-16 sm:pt-20 lg:pb-12 lg:pt-24"
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-blob absolute -start-32 top-20 h-[420px] w-[420px] rounded-full bg-nuria/20 blur-3xl" />
        <div className="hero-blob-slow absolute -end-24 top-1/3 h-80 w-80 rounded-full bg-nuria-rose/20 blur-3xl" />
        <div className="absolute bottom-0 start-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-nuria/10 blur-3xl rtl:translate-x-1/2" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left — copy */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-nuria/25 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-nuria-dark shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
              <ShieldCheck className="h-4 w-4 text-nuria" strokeWidth={2} />
              {t("badge")}
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-nuria-ink md:text-5xl lg:text-6xl">
              <span className="block">{t("titleLine1")}</span>
              <span className="block text-nuria">{t("titleLine2")}</span>
              {titleLine3.trim() ? (
                <span className="block">{titleLine3}</span>
              ) : null}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              {t("subtitle")}
            </p>

            <ul className="mt-8 space-y-3.5">
              {featureKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700 md:text-base"
                >
                  <CheckCircle2
                    className="h-5 w-5 shrink-0 text-nuria"
                    strokeWidth={2}
                  />
                  {t(key)}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#request-form"
                data-track="hero_cta_request"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-nuria px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-nuria-dark hover:shadow-xl sm:w-auto"
              >
                {t("ctaRequest")}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
              <a
                href="#services"
                data-track="hero_cta_discover"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-nuria/25 hover:bg-nuria-soft/50 hover:text-nuria-dark sm:w-auto"
              >
                {t("ctaDiscover")}
              </a>
            </div>
          </div>

          {/* Right — visual */}
          <div className="w-full lg:justify-self-end">
            <HeroVisual cards={cards} imageAlt={t("imageAlt")} />
          </div>
        </div>
      </div>
    </section>
  );
}
