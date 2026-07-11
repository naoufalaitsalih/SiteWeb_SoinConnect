import Logo from "@/components/ui/Logo";
import { brandLogoSizeConfig } from "@/components/BrandLogoMark";
import BrandLogoLink from "@/components/BrandLogoLink";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showTagline?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  linked?: boolean;
  className?: string;
}

const DEFAULT_TAGLINE = "Le soin, là où vous êtes.";

export default function BrandLogo({
  size = "md",
  variant = "light",
  showTagline = false,
  showSubtitle = false,
  subtitle,
  linked = true,
  className = "",
}: BrandLogoProps) {
  const taglineOrSubtitle = showTagline
    ? subtitle ?? DEFAULT_TAGLINE
    : showSubtitle
      ? subtitle
      : undefined;

  const taglineClass =
    variant === "dark" ? "text-slate-400" : "text-slate-500";

  const content = (
    <span className={`inline-flex flex-col ${className}`}>
      <span
        dir="ltr"
        className={`inline-flex shrink-0 items-center ${brandLogoSizeConfig[size]}`}
      >
        <Logo variant={variant} size={size} />
      </span>
      {taglineOrSubtitle && (
        <span
          className={`mt-2.5 text-[11px] font-medium leading-snug ${taglineClass}`}
        >
          {taglineOrSubtitle}
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
