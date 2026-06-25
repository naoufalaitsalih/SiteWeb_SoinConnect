"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LogOut, Menu, ScrollText, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import AdminBrandLogo from "@/components/admin/AdminBrandLogo";
import { clearAdminSession } from "@/lib/admin-session";

const NAV_ITEMS = [
  { href: "/admin/demandes", label: "Demandes", icon: ClipboardList },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
  { href: "/admin/audit", label: "Audit", icon: ShieldCheck },
] as const;

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-medical-50 text-medical-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await adminFetch("/api/admin/auth/logout", { method: "POST" });
    clearAdminSession();
    window.location.assign("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 z-50 flex w-[260px] flex-col border-e border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 lg:hidden">
          <AdminBrandLogo size="sm" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          <p className="mb-2 hidden px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 lg:block">
            Menu
          </p>
          <NavLinks
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
          />
        </nav>
      </aside>

      <div className="lg:ps-[260px]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/admin/dashboard">
                <AdminBrandLogo size="sm" />
              </Link>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
