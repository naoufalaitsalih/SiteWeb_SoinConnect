import { getTranslations } from "next-intl/server";
import {
  ClipboardList,
  Clock,
  LayoutList,
  ShieldCheck,
} from "lucide-react";

const statKeys = ["requests", "response", "professionals", "followUp"] as const;

const statConfig = {
  requests: { icon: ClipboardList, color: "bg-nuria-soft text-nuria" },
  response: { icon: Clock, color: "bg-nuria-rose-soft text-nuria-dark" },
  professionals: { icon: ShieldCheck, color: "bg-nuria-soft text-nuria" },
  followUp: { icon: LayoutList, color: "bg-nuria-rose-soft text-nuria-dark" },
} as const;

export default async function StatsBar() {
  const t = await getTranslations("statsBar");

  return (
    <div className="relative z-10 pb-6 pt-12 sm:pt-16 lg:pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 rounded-3xl border border-slate-100/80 bg-white p-6 shadow-xl sm:grid-cols-2 sm:p-8 lg:grid-cols-4 lg:gap-6">
          {statKeys.map((key) => {
            const { icon: Icon, color } = statConfig[key];
            return (
              <div
                key={key}
                className="flex items-start gap-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{t(`${key}.title`)}</p>
                  <p className="mt-1 text-sm leading-snug text-slate-500">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
