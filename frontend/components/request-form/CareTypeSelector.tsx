"use client";

import {
  CircleHelp,
  HeartHandshake,
  HeartPulse,
  Sparkles,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  CARE_TYPE_API_VALUES,
  CARE_TYPE_KEYS,
  type CareTypeKey,
} from "@/types/care-request";

const careTypeIcons: Record<CareTypeKey, LucideIcon> = {
  nursing: Stethoscope,
  personalCare: HeartHandshake,
  postOp: HeartPulse,
  senior: Users,
  specialized: Sparkles,
  other: CircleHelp,
};

interface CareTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function CareTypeSelector({ value, onChange, error }: CareTypeSelectorProps) {
  const t = useTranslations("form");

  return (
    <fieldset>
      <legend className="label-field">
        {t("careType")} <span className="text-red-500">*</span>
      </legend>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CARE_TYPE_KEYS.map((key) => {
          const apiValue = CARE_TYPE_API_VALUES[key];
          const isSelected = value === apiValue;
          const Icon = careTypeIcons[key];
          const inputId = `care-type-${key}`;

          return (
            <label
              key={key}
              htmlFor={inputId}
              className={`group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                isSelected
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"
              } ${error && !isSelected ? "border-red-200" : ""}`}
            >
              <input
                id={inputId}
                type="radio"
                name="careType"
                value={apiValue}
                checked={isSelected}
                onChange={() => onChange(apiValue)}
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
                  {t(`careTypes.${key}.title`)}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                  {t(`careTypes.${key}.description`)}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {error && <p className="error-message">{error}</p>}
    </fieldset>
  );
}
