"use client";

import { useTranslations } from "next-intl";

export default function UrgencyBadge({ isUrgent }: { isUrgent: boolean }) {
  const t = useTranslations("admin.urgency");

  if (isUrgent) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
        {t("yes")}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
      {t("no")}
    </span>
  );
}
