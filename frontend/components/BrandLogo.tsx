import Logo from "@/components/ui/Logo";
import BrandLogoLink from "@/components/BrandLogoLink";
import {
  brandLogoMarkHeight,
  type BrandLogoSize,
} from "@/components/BrandLogoMark";

interface BrandLogoProps {
  size?: BrandLogoSize;
  variant?: "light" | "dark";
  showTagline?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  linked?: boolean;
  className?: string;
}

const DEFAULT_TAGLINE = "Des soins à domicile, simplement humains.";

export default function BrandLogo({
  size = "md",
  variant = "light",
  showTagline = false,
  showSubtitle = false,
  subtitle,
  linked = true,
  className = "",
}: BrandLogoProps) {
  const tagline =
    showTagline || showSubtitle
      ? subtitle ?? (showTagline ? DEFAULT_TAGLINE : undefined)
      : undefined;

  const taglineClass =
    variant === "dark" ? "text-slate-400" : "text-slate-600";

  const markHeight = brandLogoMarkHeight[size];

  const content = (
    <span className={`inline-flex flex-col items-start ${className}`}>
      <Logo variant={variant} markHeight={markHeight} />
      {tagline && (
        <span
          dir="ltr"
          className={`mt-2 max-w-[240px] text-[11px] font-medium leading-snug tracking-wide ${taglineClass} sm:text-xs`}
        >
          {tagline}
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
