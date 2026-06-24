import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import StatsBar from "@/sections/StatsBar";
import Services from "@/sections/Services";
import HowItWorks from "@/sections/HowItWorks";
import Benefits from "@/sections/Benefits";
import Trust from "@/sections/Trust";
import CareRequestForm from "@/sections/CareRequestForm";
import { setRequestLocale } from "next-intl/server";
import { routing, Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <Services />
        <HowItWorks />
        <Benefits />
        <Trust />
        <CareRequestForm />
      </main>
      <Footer />
    </>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
