export default function AdminDashboardPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-medical-600">
        Administration
      </p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Bienvenue dans l&apos;administration SoinsConnect
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
        Gérez les demandes de soins, les utilisateurs et les paramètres de la
        plateforme depuis cet espace sécurisé.
      </p>
    </div>
  );
}
