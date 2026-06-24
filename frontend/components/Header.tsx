"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import BrandLogo from "@/components/BrandLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const NAV_LINKS = [
  { href: "#home", key: "home" },
  { href: "#services", key: "services" },
  { href: "#how-it-works", key: "howItWorks" },
  { href: "#about", key: "about" },
  { href: "#trust", key: "trust" },
  { href: "#request-form", key: "contact" },
] as const;

export default function Header() {
  const t = useTranslations("header");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.slice(1));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-h-12 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-5">
        <BrandLogo variant="light" size="sm" className="lg:hidden" />
        <BrandLogo variant="light" size="lg" className="hidden lg:inline-flex" />

        {/* Desktop navigation — centered */}
        <nav
          className="hidden flex-1 items-center justify-center gap-8 xl:flex"
          aria-label={t("menu")}
        >
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.slice(1);
            const isActive = activeSection === sectionId;

            return (
              <a
                key={link.href}
                href={link.href}
                data-track={`nav_${link.key}`}
                className={`whitespace-nowrap text-sm font-medium transition ${
                  isActive
                    ? "text-medical-600 underline decoration-medical-400 decoration-2 underline-offset-[10px]"
                    : "text-slate-700 hover:text-medical-600"
                }`}
              >
                {t(link.key)}
              </a>
            );
          })}
        </nav>

        {/* Actions — language + CTA + hamburger */}
        <div className="ms-auto flex shrink-0 items-center gap-4">
          <LanguageSwitcher />

          <a
            href="#request-form"
            data-track="header_cta_request"
            className="btn-primary hidden items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm shadow-soft lg:inline-flex"
          >
            {t("makeRequest")}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <button
            type="button"
            className="inline-flex rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("menu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white/95 backdrop-blur-md xl:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-6 py-4">
            <div className="mb-3 border-b border-slate-100 pb-3">
              <BrandLogo variant="light" size="sm" showSubtitle subtitle={t("tagline")} />
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.slice(1);
                const isActive = activeSection === sectionId;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    data-track={`nav_mobile_${link.key}`}
                    onClick={closeMobile}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-medical-50 text-medical-600"
                        : "text-slate-700 hover:bg-slate-50 hover:text-medical-600"
                    }`}
                  >
                    {t(link.key)}
                  </a>
                );
              })}
            </nav>
            <a
              href="#request-form"
              data-track="header_mobile_cta_request"
              onClick={closeMobile}
              className="btn-primary mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm shadow-soft"
            >
              {t("makeRequest")}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
