import type { AuditLog } from "@/lib/admin-audit-types";
import { adminApiRequest } from "@/lib/api";
import { API_UNREACHABLE_MESSAGE } from "@/lib/env";

type AuditListData = {
  items?: AuditLog[];
  data?: AuditLog[];
  total?: number;
};

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
    const query = search.toString();
    const result = await adminApiRequest<AuditListData | AuditLog[]>(
      `/api/admin/audit${query ? `?${query}` : ""}`,
      { cache: "no-store" }
    );

    if (!result.success) {
      return {
        logs: [],
        total: 0,
        error: result.message ?? "Erreur de chargement de l'audit",
      };
    }

    if (Array.isArray(result.data)) {
      return { logs: result.data, total: result.data.length };
    }

    const payload = result.data as AuditListData | undefined;
    const logs = payload?.items ?? payload?.data ?? [];

    return {
      logs,
      total: payload?.total ?? logs.length,
    };
  } catch {
    return {
      logs: [],
      total: 0,
      error: API_UNREACHABLE_MESSAGE,
    };
  }
}
