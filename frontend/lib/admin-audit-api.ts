import type { AuditLog, AuditListResponse } from "@/lib/admin-audit-types";
import { API_UNREACHABLE_MESSAGE } from "@/lib/env";

const PROXY_BASE = "/api/admin/audit";

export async function fetchAuditLogs(params: {
  startDate?: string;
  endDate?: string;
  action?: string;
  page?: number;
  limit?: number;
}): Promise<{ logs: AuditLog[]; total: number; error?: string }> {
  const search = new URLSearchParams();
  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  if (params.action) search.set("action", params.action);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  try {
    const res = await fetch(`${PROXY_BASE}?${search.toString()}`, {
      credentials: "include",
      cache: "no-store",
    });

    const data = (await res.json()) as AuditListResponse;

    if (!res.ok || !data.success) {
      return {
        logs: [],
        total: 0,
        error: data.message ?? "Erreur de chargement de l'audit",
      };
    }

    return {
      logs: data.data ?? [],
      total: data.total ?? 0,
    };
  } catch {
    return {
      logs: [],
      total: 0,
      error: API_UNREACHABLE_MESSAGE,
    };
  }
}
