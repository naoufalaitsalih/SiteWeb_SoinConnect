"use client";

import { DEMANDE_STATUS_LABELS, type DemandeStatus } from "@/lib/admin-types";

const STYLES: Record<DemandeStatus, string> = {
  en_attente: "bg-amber-50 text-amber-700",
  acceptee: "bg-medical-100 text-medical-700",
  refusee: "bg-red-50 text-red-700",
};

export default function DemandeStatusBadge({ status }: { status: DemandeStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[status]}`}
    >
      {DEMANDE_STATUS_LABELS[status]}
    </span>
  );
}
