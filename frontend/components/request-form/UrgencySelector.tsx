"use client";

import { AlertCircle, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface UrgencySelectorProps {
  value: boolean;
  onChange: (isUrgent: boolean) => void;
}

export default function UrgencySelector({ value, onChange }: UrgencySelectorProps) {
  const t = useTranslations("form");

  const options = [
    { id: "urgency-normal", isUrgent: false, icon: Clock },
    { id: "urgency-urgent", isUrgent: true, icon: AlertCircle },
  ] as const;

  return (
    <fieldset>
      <legend className="label-field">
        {t("urgency")} <span className="text-red-500">*</span>
      </legend>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map(({ id, isUrgent, icon: Icon }) => {
          const isSelected = value === isUrgent;
          const optionKey = isUrgent ? "urgent" : "normal";

          return (
            <label
              key={id}
              htmlFor={id}
              className={`group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                isSelected
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"
              }`}
            >
              <input
                id={id}
                type="radio"
                name="isUrgent"
                checked={isSelected}
                onChange={() => onChange(isUrgent)}
                className="sr-only"
              />
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900">
                  {t(`urgencyOptions.${optionKey}.title`)}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                  {t(`urgencyOptions.${optionKey}.description`)}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
