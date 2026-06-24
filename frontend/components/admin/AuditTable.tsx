"use client";

import { AuditLog, AUDIT_ACTION_LABELS } from "@/lib/admin-audit-types";
import { formatDateTime } from "@/lib/format";

type Props = {
  logs: AuditLog[];
};

export default function AuditTable({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        Aucun événement d&apos;audit pour cette période.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-start font-semibold text-slate-600">
                Date
              </th>
              <th className="px-4 py-3 text-start font-semibold text-slate-600">
                Action
              </th>
              <th className="px-4 py-3 text-start font-semibold text-slate-600">
                Utilisateur
              </th>
              <th className="px-4 py-3 text-start font-semibold text-slate-600">
                Rôle
              </th>
              <th className="px-4 py-3 text-start font-semibold text-slate-600">
                IP
              </th>
              <th className="px-4 py-3 text-start font-semibold text-slate-600">
                Ressource
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {formatDateTime(log.createdAt, "fr")}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                    {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {log.userEmail ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {log.userRole ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {log.ipAddress ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {log.resource
                    ? `${log.resource}${log.resourceId ? ` #${log.resourceId}` : ""}`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
