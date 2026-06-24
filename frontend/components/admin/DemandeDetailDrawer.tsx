"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  StickyNote,
  User,
  X,
} from "lucide-react";
import DemandeStatusBadge from "@/components/admin/DemandeStatusBadge";
import AdminUrgencyBadge from "@/components/admin/AdminUrgencyBadge";
import { saveDemandeNotes } from "@/lib/admin-demandes-api";
import {
  formatDemandeDate,
  formatDemandeDateTime,
  formatProposedPrice,
  type Demande,
} from "@/lib/admin-types";

type Props = {
  demande: Demande | null;
  onClose: () => void;
  onAccept: (id: number) => void;
  onRefuse: (id: number) => void;
  onDelete: (id: number) => void;
  onNotesSaved: (message: string) => void;
  onNotesUpdate: (id: number, adminNotes: string, updatedAt: string) => void;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-medical-500" />
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900" dir={dir}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function DemandeDetailDrawer({
  demande,
  onClose,
  onAccept,
  onRefuse,
  onDelete,
  onNotesSaved,
  onNotesUpdate,
}: Props) {
  const [notesDraft, setNotesDraft] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesError, setNotesError] = useState("");

  useEffect(() => {
    if (!demande) return;
    setNotesDraft(demande.adminNotes ?? "");
    setNotesError("");
    setLoadingNotes(false);
  }, [demande?.id, demande?.adminNotes]);

  async function handleSaveNotes() {
    if (!demande) return;

    setSavingNotes(true);
    setNotesError("");

    try {
      const result = await saveDemandeNotes(demande.id, notesDraft);

      if (!result.success || !result.data) {
        setNotesError(result.message ?? "Enregistrement impossible");
        return;
      }

      const savedNotes = result.data.adminNotes ?? "";
      setNotesDraft(savedNotes);
      onNotesUpdate(demande.id, savedNotes, result.data.updatedAt);
      onNotesSaved("Notes administrateur enregistrées avec succès");
    } catch {
      setNotesError("Erreur réseau lors de l'enregistrement");
    } finally {
      setSavingNotes(false);
    }
  }

  if (!demande) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Fermer"
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="fixed inset-y-0 end-0 z-50 flex w-full max-w-lg flex-col border-s border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-medical-600">
              Demande #{demande.id}
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {demande.patient}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <DemandeStatusBadge status={demande.status} />
              <AdminUrgencyBadge isUrgent={demande.isUrgent} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          <Section title="Informations patient">
            <InfoRow icon={User} label="Nom complet" value={demande.patient} />
            <InfoRow
              icon={Phone}
              label="Téléphone"
              value={demande.phone}
              dir="ltr"
            />
            <InfoRow
              icon={Mail}
              label="Email"
              value={demande.email}
              dir="ltr"
            />
            <InfoRow
              icon={MapPin}
              label="Adresse complète"
              value={demande.address}
            />
            <InfoRow icon={MapPin} label="Ville" value={demande.city} />
          </Section>

          <Section title="Informations demande">
            <InfoRow icon={StickyNote} label="Type de soin" value={demande.careType} />
            <div>
              <p className="text-xs text-slate-500">Description</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                {demande.description}
              </p>
            </div>
            <InfoRow
              icon={Calendar}
              label="Date souhaitée"
              value={formatDemandeDate(demande.requestedDate)}
            />
            <InfoRow
              icon={Clock}
              label="Heure souhaitée"
              value={demande.requestedTime}
              dir="ltr"
            />
            <InfoRow
              icon={StickyNote}
              label="Prix proposé"
              value={formatProposedPrice(demande.proposedPrice)}
            />
            <div className="flex gap-3">
              <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-medical-500" />
              <div>
                <p className="text-xs text-slate-500">Statut</p>
                <div className="mt-1">
                  <DemandeStatusBadge status={demande.status} />
                </div>
              </div>
            </div>
            {demande.refuseReason && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                <p className="text-xs font-medium text-red-700">Motif de refus</p>
                <p className="mt-1 text-sm text-red-600">{demande.refuseReason}</p>
              </div>
            )}
            <InfoRow
              icon={Calendar}
              label="Date de création"
              value={formatDemandeDateTime(demande.createdAt)}
              dir="ltr"
            />
          </Section>

          <Section title="Suivi admin">
            <InfoRow icon={User} label="Créée par" value={demande.createdBy} />
            <InfoRow
              icon={Clock}
              label="Dernière modification"
              value={formatDemandeDateTime(demande.updatedAt)}
              dir="ltr"
            />
            <div>
              <label
                htmlFor="admin-notes"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Notes admin
              </label>
              <p className="mb-2 text-xs text-slate-400">
                Visibles uniquement par les administrateurs.
              </p>
              {loadingNotes ? (
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement des notes...
                </div>
              ) : (
                <textarea
                  id="admin-notes"
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={5}
                  placeholder="Ajoutez des notes internes sur cette demande..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-medical-400 focus:ring-2 focus:ring-medical-100"
                />
              )}
              {notesError && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {notesError}
                </p>
              )}
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={loadingNotes || savingNotes}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-medical-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-medical-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingNotes ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </Section>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-200 px-6 py-4">
          {demande.status !== "acceptee" && (
            <button
              type="button"
              onClick={() => onAccept(demande.id)}
              className="flex-1 rounded-xl bg-medical-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-medical-700 sm:flex-none"
            >
              Accepter la demande
            </button>
          )}
          {demande.status !== "refusee" && (
            <button
              type="button"
              onClick={() => onRefuse(demande.id)}
              className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 sm:flex-none"
            >
              Refuser la demande
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(demande.id)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Supprimer
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Fermer
          </button>
        </div>
      </aside>
    </>
  );
}
