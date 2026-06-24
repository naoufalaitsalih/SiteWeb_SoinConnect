"use client";

import { BarChart3, ClipboardList, Users } from "lucide-react";
import AdminBrandLogo from "@/components/admin/AdminBrandLogo";

const features = [
  {
    icon: ClipboardList,
    title: "Gestion des demandes",
    description: "Suivez et traitez chaque demande de soins en temps réel.",
  },
  {
    icon: Users,
    title: "Gestion des professionnels",
    description: "Organisez les profils et la mise en relation avec les patients.",
  },
  {
    icon: BarChart3,
    title: "Statistiques en temps réel",
    description: "Visualisez l'activité et les indicateurs clés de la plateforme.",
  },
] as const;

export default function AdminLoginHero() {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#4F6FFF] via-[#3d5ce8] to-[#1e3a8a] lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-10 py-12 xl:px-16 xl:py-16">
        <div className="inline-flex w-fit rounded-2xl bg-white px-5 py-3 shadow-lg shadow-blue-900/20">
          <AdminBrandLogo size="lg" />
        </div>

        <h1 className="mt-10 max-w-md text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
          Administration SoinsConnect
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-blue-100/90">
          Pilotez les demandes de soins, les professionnels et l&apos;activité de
          votre plateforme depuis un espace sécurisé.
        </p>

        <ul className="mt-12 space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <li
                key={feature.title}
                className="group flex gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition duration-300 hover:border-white/20 hover:bg-white/15"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white transition group-hover:bg-white/25">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-blue-100/80">
                    {feature.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="relative z-10 px-10 pb-8 text-xs text-blue-200/60 xl:px-16">
        © {new Date().getFullYear()} SoinsConnect — Espace réservé aux
        administrateurs
      </p>
    </aside>
  );
}
