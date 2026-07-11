import { getLocale, getTranslations } from "next-intl/server";
import { MessageCircle } from "lucide-react";
import WhatsAppContactVisual from "@/components/whatsapp-contact/WhatsAppContactVisual";
import { getWhatsAppContactUrl } from "@/lib/whatsapp";

const stepKeys = ["step1", "step2", "step3"] as const;

export default async function CareRequestForm() {
  const t = await getTranslations("form");
  const locale = await getLocale();
  const whatsappUrl = getWhatsAppContactUrl(locale);

  return (
    <section
      id="request-form"
      className="relative overflow-hidden bg-gradient-to-b from-nuria-bg via-nuria-soft/50 to-white py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -start-24 top-20 h-72 w-72 rounded-full bg-nuria-soft/40 blur-3xl" />
        <div className="absolute -end-20 bottom-16 h-64 w-64 rounded-full bg-nuria-rose-soft blur-3xl" />
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

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <WhatsAppContactVisual
            imageAlt={t("imageAlt")}
            badgeHomeCare={t("badgeHomeCare")}
            badgeSupport={t("badgeSupport")}
          />

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl sm:p-10">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("cardTitle")}
            </h3>

            <ol className="mt-8 space-y-6">
              {stepKeys.map((key, index) => (
                <li key={key} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nuria text-sm font-bold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <p className="pt-2 text-base leading-relaxed text-slate-700">
                    {t(key)}
                  </p>
                </li>
              ))}
            </ol>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp_contact_cta"
              aria-label={t("cta")}
              className="mt-10 inline-flex w-full items-center justify-center gap-3 rounded-full bg-green-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-green-700 hover:shadow-xl sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2} />
              {t("cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
