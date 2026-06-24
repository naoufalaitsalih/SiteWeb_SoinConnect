import Logo from "@/components/ui/Logo";
import { brandLogoSizeConfig, type BrandLogoSize } from "@/components/BrandLogoMark";

type Props = {
  size?: BrandLogoSize;
  className?: string;
};

/** Logo admin — marque fixe, indépendante des traductions et du RTL. */
export default function AdminBrandLogo({ size = "md", className = "" }: Props) {
  return (
    <span
      dir="ltr"
      className={`inline-flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.02] ${brandLogoSizeConfig[size]} ${className}`}
    >
      <Logo />
    </span>
  );
}
