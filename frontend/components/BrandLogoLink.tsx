"use client";

import { Link } from "@/i18n/navigation";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function BrandLogoLink({ children, className }: Props) {
  return (
    <Link
      href="/"
      className={className}
      aria-label="NURIA — Accueil"
    >
      {children}
    </Link>
  );
}
