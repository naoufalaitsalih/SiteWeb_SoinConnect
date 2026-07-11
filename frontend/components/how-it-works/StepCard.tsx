import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  icon: LucideIcon;
  title: string;
  description: string;
  footnote?: string;
  bullets?: string[];
}

export default function StepCard({
  stepNumber,
  icon: Icon,
  title,
  description,
  footnote,
  bullets,
}: StepCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-7 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-nuria/25 hover:shadow-2xl sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-nuria text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <span className="text-4xl font-bold leading-none text-nuria-soft transition-colors duration-300 group-hover:text-nuria/30">
          {String(stepNumber).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>

      {bullets && bullets.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-nuria-soft text-nuria">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="leading-snug">{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {footnote && (
        <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-500">
          {footnote}
        </p>
      )}
    </article>
  );
}
