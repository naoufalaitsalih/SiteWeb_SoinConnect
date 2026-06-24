"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  EVENT_TYPE_LABELS,
  clearAdminEventLogs,
  deleteAdminEventLogs,
  fetchAdminEventLogs,
  formatEventDate,
  formatEventLocation,
  type EventLogEntry,
  type LogsFilterParams,
} from "@/lib/admin-logs-api";

const PAGE_SIZE = 50;

type FilterForm = {
  startDate: string;
  endDate: string;
};

const emptyFilters: FilterForm = { startDate: "", endDate: "" };

export default function LogsTable() {
  const [logs, setLogs] = useState<EventLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [draftFilters, setDraftFilters] = useState<FilterForm>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterForm>(emptyFilters);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const queryParams = useMemo((): LogsFilterParams => {
    const params: LogsFilterParams = { page, limit: PAGE_SIZE };
    if (appliedFilters.startDate) params.startDate = appliedFilters.startDate;
    if (appliedFilters.endDate) params.endDate = appliedFilters.endDate;
    return params;
  }, [appliedFilters, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchAdminEventLogs(queryParams);
      setLogs(result.logs);
      setTotal(result.total);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  const allSelected =
    logs.length > 0 && logs.every((log) => selectedIds.has(log.id));
  const someSelected = selectedIds.size > 0;

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(logs.map((log) => log.id)));
  }

  function toggleOne(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleApplyFilters() {
    setPage(1);
    setAppliedFilters({ ...draftFilters });
  }

  function handleResetFilters() {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  }

  async function handleDeleteSelected() {
    if (!someSelected) return;

    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ces logs ?"
    );
    if (!confirmed) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const count = await deleteAdminEventLogs(Array.from(selectedIds));
      setSuccess(`${count} log(s) supprimé(s) avec succès.`);
      await loadLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression");
    } finally {
      setDeleting(false);
    }
  }

  async function handleClearFiltered() {
    const hasFilter = appliedFilters.startDate || appliedFilters.endDate;
    const message = hasFilter
      ? "Voulez-vous vraiment supprimer tous les logs de la période filtrée ?"
      : "Voulez-vous vraiment supprimer TOUS les logs ? Cette action est irréversible.";

    if (!window.confirm(message)) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const count = await clearAdminEventLogs({
        startDate: appliedFilters.startDate || undefined,
        endDate: appliedFilters.endDate || undefined,
      });
      setSuccess(`${count} log(s) supprimé(s) avec succès.`);
      setPage(1);
      await loadLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="log-start-date"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Date début
              </label>
              <input
                id="log-start-date"
                type="date"
                dir="ltr"
                value={draftFilters.startDate}
                onChange={(e) =>
                  setDraftFilters((f) => ({ ...f, startDate: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-medical-500 focus:ring-2 focus:ring-medical-500/20"
              />
            </div>
            <div>
              <label
                htmlFor="log-end-date"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Date fin
              </label>
              <input
                id="log-end-date"
                type="date"
                dir="ltr"
                value={draftFilters.endDate}
                onChange={(e) =>
                  setDraftFilters((f) => ({ ...f, endDate: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-medical-500 focus:ring-2 focus:ring-medical-500/20"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleApplyFilters}
              className="rounded-xl bg-medical-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-medical-700"
            >
              Filtrer
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {success}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Tableau */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {total} événement{total > 1 ? "s" : ""}
            {someSelected && (
              <span className="ms-2 font-medium text-medical-600">
                · {selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}
              </span>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadLogs}
              disabled={loading || deleting}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={!someSelected || deleting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Supprimer sélection
            </button>
            <button
              type="button"
              onClick={handleClearFiltered}
              disabled={deleting || total === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Vider période
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement des journaux…
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        disabled={logs.length === 0}
                        aria-label="Tout sélectionner"
                        className="h-4 w-4 rounded border-slate-300 text-medical-600 focus:ring-medical-500/20"
                      />
                    </th>
                    {[
                      "Date",
                      "Type",
                      "Page",
                      "Élément",
                      "Appareil",
                      "Navigateur",
                      "IP",
                      "Pays/Ville",
                    ].map((col) => (
                      <th
                        key={col}
                        className="whitespace-nowrap px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-10 text-center text-slate-500"
                      >
                        Aucun événement pour cette période.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        className={`hover:bg-slate-50/80 ${
                          selectedIds.has(log.id) ? "bg-medical-50/40" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(log.id)}
                            onChange={() => toggleOne(log.id)}
                            aria-label={`Sélectionner log ${log.id}`}
                            className="h-4 w-4 rounded border-slate-300 text-medical-600 focus:ring-medical-500/20"
                          />
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-3 text-slate-700"
                          dir="ltr"
                        >
                          {formatEventDate(log.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {EVENT_TYPE_LABELS[log.eventType] ?? log.eventType}
                          </span>
                        </td>
                        <td
                          className="max-w-[160px] truncate px-4 py-3 text-slate-600"
                          dir="ltr"
                          title={log.pageUrl ?? undefined}
                        >
                          {log.pageUrl ?? "—"}
                        </td>
                        <td className="max-w-[140px] truncate px-4 py-3 text-slate-600">
                          {log.elementName ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {log.deviceType ?? "—"}
                          {log.os ? ` · ${log.os}` : ""}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {log.browser ?? "—"}
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500"
                          dir="ltr"
                        >
                          {log.ipAddress ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {formatEventLocation(log)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                <p className="text-xs text-slate-500">
                  Page {page} sur {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Suivant
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
