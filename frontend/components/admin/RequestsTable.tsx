"use client";

import { useLocale, useTranslations } from "next-intl";
import { CareRequest } from "@/types/care-request";
import StatusBadge from "@/components/admin/StatusBadge";
import UrgencyBadge from "@/components/admin/UrgencyBadge";
import { formatDate, formatDateTime } from "@/lib/format";
import { Locale } from "@/i18n/routing";

interface RequestsTableProps {
  requests: CareRequest[];
}

export default function RequestsTable({ requests }: RequestsTableProps) {
  const t = useTranslations("admin.table");
  const locale = useLocale() as Locale;

  const columns = [
    "id",
    "fullName",
    "phone",
    "email",
    "address",
    "careType",
    "urgency",
    "status",
    "requestedDate",
    "time",
    "createdAt",
  ] as const;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {t(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                  #{request.id}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {request.fullName}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700" dir="ltr">
                  {request.phone}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500" dir="ltr">
                  {request.email ?? t("noEmail")}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-slate-700" title={request.address}>
                  {request.address}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {request.careType}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <UrgencyBadge isUrgent={request.isUrgent} />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={request.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700" dir="ltr">
                  {formatDate(request.requestedDate, locale)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700" dir="ltr">
                  {request.requestedTime}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500" dir="ltr">
                  {formatDateTime(request.createdAt, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
