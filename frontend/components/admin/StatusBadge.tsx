"use client";

import { useTranslations } from "next-intl";
import { CareRequest } from "@/types/care-request";

const ACTIVE_STATUSES = new Set(["pending", "in_progress"]);

export default function StatusBadge({ status }: { status: CareRequest["status"] }) {
  const t = useTranslations("admin.status");
  const isActive = ACTIVE_STATUSES.has(status);

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isActive
          ? "bg-medical-100 text-medical-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {t(status)}
    </span>
  );
}
