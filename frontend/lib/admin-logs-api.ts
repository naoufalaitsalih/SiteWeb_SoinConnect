import { adminFetch } from "@/lib/admin-fetch";

export type EventLogEntry = {
  id: number;
  eventType: string;
  pageUrl: string | null;
  elementName: string | null;
  userRole: string;
  sessionId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  browser: string | null;
  os: string | null;
  deviceType: string | null;
  referrer: string | null;
  locale: string | null;
  country: string | null;
  city: string | null;
  timezone: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type LogsFilterParams = {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export type ApiEventLogsResponse = {
  success: boolean;
  message?: string;
  data?: EventLogEntry[];
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
};

export type ApiDeleteLogsResponse = {
  success: boolean;
  message?: string;
  count?: number;
};

export const EVENT_TYPE_LABELS: Record<string, string> = {
  page_view: "Visite de page",
  button_click: "Clic bouton",
  form_start: "Début formulaire",
  form_submit: "Formulaire envoyé",
  form_error: "Erreur formulaire",
  admin_login_success: "Connexion admin réussie",
  admin_login_failed: "Connexion admin échouée",
  api_error: "Erreur API",
};

function buildQueryString(params: LogsFilterParams): string {
  const search = new URLSearchParams();
  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchAdminEventLogs(
  params: LogsFilterParams = {}
): Promise<{ logs: EventLogEntry[]; total: number; page: number; limit: number }> {
  const res = await adminFetch(`/api/admin/logs${buildQueryString(params)}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = (await res.json()) as ApiEventLogsResponse;

  if (!res.ok || !data.success || !data.data) {
    throw new Error(data.message ?? "Impossible de charger les journaux");
  }

  return {
    logs: data.data,
    total: data.total ?? data.data.length,
    page: data.page ?? 1,
    limit: data.limit ?? 50,
  };
}

export async function deleteAdminEventLogs(ids: number[]): Promise<number> {
  const res = await adminFetch("/api/admin/logs", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  const data = (await res.json()) as ApiDeleteLogsResponse;

  if (!res.ok || !data.success) {
    throw new Error(data.message ?? "Suppression impossible");
  }

  return data.count ?? 0;
}

export async function clearAdminEventLogs(
  filters: Pick<LogsFilterParams, "startDate" | "endDate"> = {}
): Promise<number> {
  const res = await adminFetch("/api/admin/logs/clear", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });

  const data = (await res.json()) as ApiDeleteLogsResponse;

  if (!res.ok || !data.success) {
    throw new Error(data.message ?? "Suppression impossible");
  }

  return data.count ?? 0;
}

export function formatEventLocation(log: EventLogEntry): string {
  const parts = [log.city, log.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

export function formatEventDate(date: string) {
  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
