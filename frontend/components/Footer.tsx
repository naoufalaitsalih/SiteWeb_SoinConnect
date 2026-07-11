import { getTranslations } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "@/components/footer/FooterContactIcons";
import BrandLogo from "@/components/BrandLogo";
import FooterSocialLinks from "@/components/footer/FooterSocialLinks";
import { siteConfig } from "@/lib/site-config";

const navLinks = [
  { href: "#home", key: "home" },
  { href: "#services", key: "services" },
  { href: "#how-it-works", key: "howItWorks" },
  { href: "#trust", key: "trust" },
  { href: "#request-form", key: "request" },
] as const;

const serviceLinks = [
  { href: "#services", key: "nursing" },
  { href: "#services", key: "personalCare" },
  { href: "#services", key: "postOp" },
  { href: "#services", key: "senior" },
  { href: "#services", key: "homeCare" },
] as const;

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-nuria-footer/80 bg-nuria-footer text-slate-300">
      <div className="section-container py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo
              variant="dark"
              size="lg"
              showTagline
              linked={false}
            />
            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              {t("description")}
            </p>
            <div className="mt-6">
              <FooterSocialLinks />
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("navigation")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map(({ href, key }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="text-slate-400 transition-colors duration-300 hover:text-nuria-rose"
                  >
                    {t(`nav.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("servicesTitle")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {serviceLinks.map(({ href, key }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="text-slate-400 transition-colors duration-300 hover:text-nuria-rose"
                  >
                    {t(`services.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("contact")}
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={siteConfig.contact.phoneHref}
                  dir="ltr"
                  className="group flex items-start gap-3 text-slate-400 transition-colors duration-300 hover:text-nuria-rose"
                >
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-nuria"
                    strokeWidth={2}
                  />
                  <span>{siteConfig.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.emailHref}
                  dir="ltr"
                  className="group flex items-start gap-3 break-all text-slate-400 transition-colors duration-300 hover:text-nuria-rose"
                >
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-nuria"
                    strokeWidth={2}
                  />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-nuria"
                  strokeWidth={2}
                />
                <span>{t("area")}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-nuria"
                  strokeWidth={2}
                />
                <span>{t("availability")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-center text-xs text-slate-500 sm:text-start">
            {t("copyright")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href={siteConfig.legal.privacyPolicy}
              className="text-slate-500 transition-colors duration-300 hover:text-nuria-rose"
            >
              {t("privacy")}
            </a>
            <span className="hidden text-slate-700 sm:inline" aria-hidden>
              |
            </span>
            <a
              href={siteConfig.legal.termsOfUse}
              className="text-slate-500 transition-colors duration-300 hover:text-nuria-rose"
            >
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
