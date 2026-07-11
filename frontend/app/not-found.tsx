import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center bg-slate-50 px-4 antialiased">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-nuria">
            404
          </p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Page introuvable
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <Link
            href="/fr"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-nuria px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-nuria-dark"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </body>
    </html>
  );
}
