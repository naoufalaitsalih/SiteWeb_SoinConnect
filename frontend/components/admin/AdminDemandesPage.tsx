"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import AdminToastContainer from "@/components/admin/AdminToast";
import type { Toast } from "@/lib/admin-types";
import DemandeDetailDrawer from "@/components/admin/DemandeDetailDrawer";
import DemandeStatusBadge from "@/components/admin/DemandeStatusBadge";
import AdminUrgencyBadge from "@/components/admin/AdminUrgencyBadge";
import {
  deleteDemande,
  fetchAdminDemandes,
  updateDemandeStatus,
  saveDemandeNotes,
} from "@/lib/admin-demandes-api";
import {
  DEMANDE_STATUS_LABELS,
  formatDemandeDate,
  formatProposedPrice,
  type Demande,
  type DemandeStatus,
} from "@/lib/admin-types";

type StatusFilter = "all" | DemandeStatus;

const STAT_CARDS = [
  { key: "total", label: "Total demandes", icon: CheckCircle2, color: "text-medical-600 bg-medical-50" },
  { key: "en_attente", label: "En attente", icon: Clock, color: "text-amber-600 bg-amber-50" },
  { key: "acceptee", label: "Acceptées", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  { key: "refusee", label: "Refusées", icon: XCircle, color: "text-red-600 bg-red-50" },
  { key: "urgent", label: "Urgentes", icon: AlertTriangle, color: "text-orange-600 bg-orange-50" },
] as const;

function ActionButton({
  onClick,
  title,
  children,
  className = "",
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 ${className}`}
    >
      {children}
    </button>
  );
}

export default function AdminDemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [careTypeFilter, setCareTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [selected, setSelected] = useState<Demande | null>(null);
  const [refuseTarget, setRefuseTarget] = useState<number | null>(null);
  const [refuseReason, setRefuseReason] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDemandes = useCallback(async () => {
    const result = await fetchAdminDemandes();
    setDemandes(result.demandes);
    setLoadError(result.error ?? null);
    return result;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadDemandes().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [loadDemandes]);

  useEffect(() => {
    setSelected((prev) => {
      if (!prev) return prev;
      return demandes.find((d) => d.id === prev.id) ?? prev;
    });
  }, [demandes]);

  const careTypes = useMemo(
    () => [...new Set(demandes.map((d) => d.careType))].sort(),
    [demandes]
  );

  const cities = useMemo(
    () =>
      [...new Set(demandes.map((d) => d.city).filter(Boolean))].sort(),
    [demandes]
  );

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return demandes.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (careTypeFilter !== "all" && d.careType !== careTypeFilter) return false;
      if (cityFilter !== "all" && d.city !== cityFilter) return false;
      if (!q) return true;
      return (
        d.patient.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.address.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q)
      );
    });
  }, [demandes, search, statusFilter, careTypeFilter, cityFilter]);

  const stats = useMemo(
    () => ({
      total: demandes.length,
      en_attente: demandes.filter((d) => d.status === "en_attente").length,
      acceptee: demandes.filter((d) => d.status === "acceptee").length,
      refusee: demandes.filter((d) => d.status === "refusee").length,
      urgent: demandes.filter((d) => d.isUrgent).length,
    }),
    [demandes]
  );

  const updateDemande = useCallback((id: number, patch: Partial<Demande>) => {
    const now = new Date().toISOString();
    setDemandes((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, ...patch, updatedAt: now } : d
      )
    );
    setSelected((prev) =>
      prev?.id === id ? { ...prev, ...patch, updatedAt: now } : prev
    );
  }, []);

  const handleNotesUpdate = useCallback(
    (id: number, adminNotes: string, updatedAt: string) => {
      updateDemande(id, { adminNotes, updatedAt });
    },
    [updateDemande]
  );

  const handleAccept = useCallback(
    async (id: number) => {
      setActionLoading(true);
      const result = await updateDemandeStatus(id, "ACCEPTEE");
      setActionLoading(false);

      if (!result.success || !result.data) {
        addToast(result.message ?? "Impossible d'accepter la demande", "error");
        return;
      }

      await loadDemandes();
      addToast(`Demande #${id} acceptée avec succès`);
      setSelected((prev) => (prev?.id === id ? null : prev));
    },
    [addToast, loadDemandes]
  );

  const handleRefuseConfirm = useCallback(async () => {
    if (!refuseTarget || !refuseReason.trim()) return;

    setActionLoading(true);
    const target = demandes.find((d) => d.id === refuseTarget);
    const notesWithReason = target?.adminNotes
      ? `${target.adminNotes}\n\n[Motif de refus] ${refuseReason.trim()}`
      : `[Motif de refus] ${refuseReason.trim()}`;

    const notesResult = await saveDemandeNotes(refuseTarget, notesWithReason);
    if (!notesResult.success) {
      setActionLoading(false);
      addToast(notesResult.message ?? "Impossible d'enregistrer le motif", "error");
      return;
    }

    const statusResult = await updateDemandeStatus(refuseTarget, "REFUSEE");
    setActionLoading(false);

    if (!statusResult.success) {
      addToast(statusResult.message ?? "Impossible de refuser la demande", "error");
      return;
    }

    await loadDemandes();
    addToast(`Demande #${refuseTarget} refusée`);
    setRefuseTarget(null);
    setRefuseReason("");
    setSelected((prev) => (prev?.id === refuseTarget ? null : prev));
  }, [refuseTarget, refuseReason, demandes, addToast, loadDemandes]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;

    setActionLoading(true);
    const result = await deleteDemande(deleteTarget);
    setActionLoading(false);

    if (!result.success) {
      addToast(result.message ?? "Impossible de supprimer la demande", "error");
      return;
    }

    await loadDemandes();
    addToast(`Demande #${deleteTarget} supprimée`, "info");
    setDeleteTarget(null);
    setSelected((prev) => (prev?.id === deleteTarget ? null : prev));
  }, [deleteTarget, addToast, loadDemandes]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCareTypeFilter("all");
    setCityFilter("all");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await loadDemandes();
    setRefreshing(false);
    if (result.error) {
      addToast(result.error, "error");
    } else {
      addToast("Liste des demandes actualisée", "info");
    }
  };

  const handleExport = () => {
    const headers = [
      "ID",
      "Patient",
      "Téléphone",
      "Email",
      "Ville",
      "Type",
      "Date",
      "Statut",
      "Urgence",
      "Prix",
    ];
    const rows = filtered.map((d) => [
      d.id,
      d.patient,
      d.phone,
      d.email,
      d.city,
      d.careType,
      d.requestedDate,
      DEMANDE_STATUS_LABELS[d.status],
      d.isUrgent ? "Oui" : "Non",
      d.proposedPrice,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demandes-soinsconnect-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`${filtered.length} demande(s) exportée(s)`);
  };

  const openRefuse = (id: number) => {
    setRefuseTarget(id);
    setRefuseReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Gestion des demandes
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Pilotez les demandes de soins à domicile : consultez, filtrez, acceptez
            ou refusez les requêtes patients en temps réel.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl bg-medical-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-medical-700 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        </div>
      </div>

      {loadError && (
        <div
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20 text-sm text-slate-600 shadow-card">
          <Loader2 className="h-5 w-5 animate-spin text-medical-600" />
          Chargement des demandes...
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <div
            key={key}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
          >
            <div className={`inline-flex rounded-xl p-2 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {stats[key as keyof typeof stats]}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Patient, téléphone, adresse..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 ps-10 pe-3 text-sm outline-none focus:border-medical-400 focus:ring-2 focus:ring-medical-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-medical-400 focus:ring-2 focus:ring-medical-100"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="acceptee">Acceptée</option>
            <option value="refusee">Refusée</option>
          </select>
          <select
            value={careTypeFilter}
            onChange={(e) => setCareTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-medical-400 focus:ring-2 focus:ring-medical-100"
          >
            <option value="all">Tous les types</option>
            {careTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-medical-400 focus:ring-2 focus:ring-medical-100"
          >
            <option value="all">Toutes les villes</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-medical-600 hover:text-medical-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Patient",
                  "Téléphone",
                  "Type de soin",
                  "Ville / Adresse",
                  "Date souhaitée",
                  "Urgence",
                  "Statut",
                  "Actions",
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
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                    {d.patient}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600" dir="ltr">
                    {d.phone}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {d.careType}
                  </td>
                  <td className="max-w-[200px] px-4 py-3">
                    <p className="font-medium text-slate-800">{d.city}</p>
                    <p className="truncate text-xs text-slate-500" title={d.address}>
                      {d.address}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {formatDemandeDate(d.requestedDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <AdminUrgencyBadge isUrgent={d.isUrgent} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <DemandeStatusBadge status={d.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      <ActionButton
                        onClick={() => setSelected(d)}
                        title="Voir détails"
                        className="hover:text-medical-600"
                      >
                        <Eye className="h-4 w-4" />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleAccept(d.id)}
                        title="Accepter"
                        className="hover:bg-medical-50 hover:text-medical-600"
                      >
                        <Check className="h-4 w-4" />
                      </ActionButton>
                      <ActionButton
                        onClick={() => openRefuse(d.id)}
                        title="Refuser"
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </ActionButton>
                      <ActionButton
                        onClick={() => setDeleteTarget(d.id)}
                        title="Supprimer"
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && !loadError && (
          <p className="px-4 py-16 text-center text-sm text-slate-500">
            {demandes.length === 0
              ? "Aucune demande trouvée."
              : "Aucune demande ne correspond à vos filtres."}
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((d) => (
          <article
            key={d.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{d.patient}</p>
                <p className="text-xs text-slate-500" dir="ltr">
                  {d.phone}
                </p>
              </div>
              <DemandeStatusBadge status={d.status} />
            </div>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-700">Type :</span>{" "}
                {d.careType}
              </p>
              <p>
                <span className="font-medium text-slate-700">Ville :</span>{" "}
                {d.city}
              </p>
              <p className="line-clamp-2">{d.address}</p>
              <p>
                <span className="font-medium text-slate-700">Date :</span>{" "}
                {formatDemandeDate(d.requestedDate)}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <AdminUrgencyBadge isUrgent={d.isUrgent} />
              <span className="text-xs font-semibold text-medical-600">
                {formatProposedPrice(d.proposedPrice)}
              </span>
            </div>
            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setSelected(d)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700"
              >
                <Eye className="h-4 w-4" />
                Détails
              </button>
              <button
                type="button"
                onClick={() => handleAccept(d.id)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-medical-50 py-2.5 text-xs font-semibold text-medical-700"
              >
                <Check className="h-4 w-4" />
                Accepter
              </button>
              <button
                type="button"
                onClick={() => openRefuse(d.id)}
                className="rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-600"
                aria-label="Refuser"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(d.id)}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-500"
                aria-label="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && !loadError && (
          <p className="rounded-2xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
            {demandes.length === 0
              ? "Aucune demande trouvée."
              : "Aucune demande ne correspond à vos filtres."}
          </p>
        )}
      </div>

      {/* Detail drawer */}
      <DemandeDetailDrawer
        demande={selected}
        onClose={() => setSelected(null)}
        onAccept={handleAccept}
        onRefuse={openRefuse}
        onDelete={(id) => setDeleteTarget(id)}
        onNotesSaved={(message) => addToast(message)}
        onNotesUpdate={handleNotesUpdate}
      />

      {/* Refuse modal */}
      {refuseTarget && (
        <>
          <button
            type="button"
            aria-label="Fermer"
            className="fixed inset-0 z-[60] bg-slate-900/40"
            onClick={() => setRefuseTarget(null)}
          />
          <div className="fixed start-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Refuser la demande</h3>
            <p className="mt-1 text-sm text-slate-600">
              Indiquez le motif de refus pour la demande #{refuseTarget}.
            </p>
            <textarea
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
              rows={3}
              placeholder="Motif de refus..."
              className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-medical-400 focus:ring-2 focus:ring-medical-100"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleRefuseConfirm}
                disabled={!refuseReason.trim() || actionLoading}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirmer le refus
              </button>
              <button
                type="button"
                onClick={() => setRefuseTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <>
          <button
            type="button"
            aria-label="Fermer"
            className="fixed inset-0 z-[60] bg-slate-900/40"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="fixed start-1/2 top-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Supprimer la demande</h3>
            <p className="mt-2 text-sm text-slate-600">
              Êtes-vous sûr de vouloir supprimer la demande #{deleteTarget} ? Cette
              action est irréversible.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Supprimer
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </>
      )}
        </>
      )}

      <AdminToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
