export type { EventLogEntry } from "@/lib/api";

export type LogsFilterParams = {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
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

export async function fetchAdminEventLogs(
  params: LogsFilterParams = {}
): Promise<{ logs: import("@/lib/api").EventLogEntry[]; total: number; page: number; limit: number }> {
  const { getAdminLogs } = await import("@/lib/api");
  const result = await getAdminLogs(params);

  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Impossible de charger les journaux");
  }

  return {
    logs: result.data.items,
    total: result.data.total,
    page: result.data.page,
    limit: result.data.limit,
  };
}

export async function deleteAdminEventLogs(ids: number[]): Promise<number> {
  const { deleteAdminLogs } = await import("@/lib/api");
  const result = await deleteAdminLogs(ids);

  if (!result.success) {
    throw new Error(result.message ?? "Suppression impossible");
  }

  return result.data?.count ?? 0;
}

export async function clearAdminEventLogs(
  filters: Pick<LogsFilterParams, "startDate" | "endDate"> = {}
): Promise<number> {
  const { clearAdminLogs } = await import("@/lib/api");
  const result = await clearAdminLogs(filters);

  if (!result.success) {
    throw new Error(result.message ?? "Suppression impossible");
  }

  return result.data?.count ?? 0;
}

export function formatEventLocation(log: import("@/lib/api").EventLogEntry): string {
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
