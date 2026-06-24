import Logo from "@/components/ui/Logo";
import { brandLogoSizeConfig } from "@/components/BrandLogoMark";
import BrandLogoLink from "@/components/BrandLogoLink";

interface BrandLogoProps {
  variant?: "light" | "dark";
  size?: keyof typeof brandLogoSizeConfig;
  linked?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
}

export default function BrandLogo({
  variant = "light",
  size = "md",
  linked = true,
  showSubtitle = false,
  subtitle,
  className = "",
}: BrandLogoProps) {
  const subtitleClass =
    variant === "dark" ? "text-slate-400" : "text-slate-500";

  const content = (
    <span className={`inline-flex flex-col ${className}`}>
      <span
        dir="ltr"
        className={`inline-flex shrink-0 items-center ${brandLogoSizeConfig[size]}`}
      >
        <Logo />
      </span>
      {showSubtitle && subtitle && (
        <span
          className={`mt-2.5 text-[11px] font-medium leading-snug ${subtitleClass}`}
        >
          {subtitle}
        </span>
      )}
    </span>
  );

  const hoverClass =
    "inline-flex shrink-0 transition-transform duration-300 hover:scale-[1.02]";

  if (!linked) {
    return <div className={hoverClass}>{content}</div>;
  }

  return <BrandLogoLink className={hoverClass}>{content}</BrandLogoLink>;
}
