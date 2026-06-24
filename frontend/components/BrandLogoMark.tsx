import Logo from "@/components/ui/Logo";

export const brandLogoSizeConfig = {
  sm: "h-[38px] max-h-[38px]",
  md: "h-[40px] max-h-[42px]",
  lg: "h-12 max-h-12",
} as const;

export type BrandLogoSize = keyof typeof brandLogoSizeConfig;

/** @deprecated Utiliser Logo depuis @/components/ui/Logo */
export default function BrandLogoMark() {
  return <Logo />;
}
