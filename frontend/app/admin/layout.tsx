import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Connexion — Admin SoinsConnect",
  description: "Espace d'administration sécurisé SoinsConnect",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
