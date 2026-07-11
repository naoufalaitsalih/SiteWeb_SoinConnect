import Logo from "@/components/ui/Logo";

export const brandLogoSizeConfig = {
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

export type BrandLogoSize = keyof typeof brandLogoSizeConfig;

export const brandLogoMarkHeight: Record<BrandLogoSize, number> = {
  sm: 36,
  md: 44,
  lg: 56,
};

/** @deprecated Utiliser BrandLogo ou Logo */
export default function BrandLogoMark() {
  return <Logo markHeight={44} />;
}
