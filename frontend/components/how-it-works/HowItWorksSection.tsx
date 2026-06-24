import { getTranslations } from "next-intl/server";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Home,
  UserSearch,
} from "lucide-react";
import StepCard from "@/components/how-it-works/StepCard";

const stepKeys = ["step1", "step2", "step3"] as const;

const stepIcons = {
  step1: ClipboardList,
  step2: UserSearch,
  step3: Home,
} as const;

const whyKeys = ["verified", "centralized", "human", "organization"] as const;

export default async function HowItWorksSection() {
  const t = await getTranslations("howItWorks");

  const steps = stepKeys.map((key, index) => ({
    key,
    number: index + 1,
    icon: stepIcons[key],
    title: t(`${key}.title`),
    description: t(`${key}.description`),
    footnote: t(`${key}.footnote`),
    bullets:
      key === "step1"
        ? [
            t("step1.bullets.b1"),
            t("step1.bullets.b2"),
            t("step1.bullets.b3"),
            t("step1.bullets.b4"),
          ]
        : undefined,
  }));

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -end-24 top-16 h-72 w-72 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute -start-20 bottom-20 h-64 w-64 rounded-full bg-medical-100/25 blur-3xl" />
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

        {/* Progress line — desktop */}
        <div className="relative mx-auto mt-14 hidden max-w-5xl xl:block">
          <div className="absolute start-[16.666%] end-[16.666%] top-7 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200" />
        </div>

        {/* Steps — desktop with arrows */}
        <div className="mt-14 hidden items-stretch xl:flex">
          {steps.flatMap((step, index) => {
            const card = (
              <div key={step.key} className="min-w-0 flex-1">
                <StepCard
                  stepNumber={step.number}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  footnote={step.footnote}
                  bullets={step.bullets}
                />
              </div>
            );

            if (index < steps.length - 1) {
              return [
                card,
                <div
                  key={`arrow-${step.key}`}
                  className="flex shrink-0 items-center self-center px-1"
                >
                  <ChevronRight
                    className="h-6 w-6 text-blue-300 rtl:rotate-180"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>,
              ];
            }

            return [card];
          })}
        </div>

        {/* Steps — tablet & mobile grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 xl:hidden">
          {steps.map((step) => (
            <StepCard
              key={step.key}
              stepNumber={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
              footnote={step.footnote}
              bullets={step.bullets}
            />
          ))}
        </div>

        {/* Reassurance */}
        <div className="mt-16 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8 lg:mt-20">
          <h3 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            {t("why.title")}
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {whyKeys.map((key) => (
              <div
                key={key}
                className="flex items-start gap-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <CheckCircle2
                  className="mt-0.5 h-6 w-6 shrink-0 text-blue-600"
                  strokeWidth={2}
                />
                <div>
                  <p className="font-bold text-slate-900">{t(`why.${key}.title`)}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {t(`why.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
