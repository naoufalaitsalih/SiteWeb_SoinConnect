"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminProtectedError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-card">
      <AlertTriangle className="mx-auto h-8 w-8 text-red-600" />
      <h2 className="mt-4 text-lg font-bold text-red-900">
        Erreur de chargement
      </h2>
      <p className="mt-2 text-sm text-red-700">
        Une erreur est survenue dans l&apos;espace admin. Rechargez la page ou
        redémarrez le serveur de développement après{" "}
        <code className="text-xs">npm run clean</code>.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
      >
        <RotateCcw className="h-4 w-4" />
        Réessayer
      </button>
    </div>
  );
}
