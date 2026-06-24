import { getTranslations } from "next-intl/server";
import { CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";

const stepKeys = ["step1", "step2", "step3"] as const;
const trustKeys = ["confidential", "verified", "noCommitment"] as const;

const trustIcons = {
  confidential: ShieldCheck,
  verified: UserCheck,
  noCommitment: CheckCircle2,
} as const;

export default async function RequestFormAside() {
  const t = await getTranslations("form.sidebar");

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
      <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-xl sm:p-8">
        <h3 className="text-xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h3>
        <ol className="mt-6 space-y-5">
          {stepKeys.map((key, index) => (
            <li key={key} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {index + 1}
              </span>
              <p className="pt-1 text-sm leading-relaxed text-slate-700">{t(key)}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-[32px] border border-blue-100 bg-blue-50/60 p-6 sm:p-8">
        <ul className="space-y-4">
          {trustKeys.map((key) => {
            const Icon = trustIcons[key];
            return (
              <li key={key} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" strokeWidth={2} />
                <p className="text-sm leading-snug text-slate-700">{t(`trust.${key}`)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
