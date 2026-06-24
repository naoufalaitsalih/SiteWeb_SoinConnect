import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord — Admin SoinsConnect",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
