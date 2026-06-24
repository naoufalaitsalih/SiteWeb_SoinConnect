type LogoProps = {
  className?: string;
};

/**
 * Marque SoinsConnect — texte fixe, jamais traduit, toujours LTR.
 * Identique en français, arabe et anglais.
 */
export default function Logo({ className = "" }: LogoProps) {
  return (
    <div
      dir="ltr"
      className={`logo ${className}`.trim()}
      role="img"
      aria-label="SoinsConnect"
    >
      <span className="logo-soins">SOINS</span>
      <span className="logo-connect">CONNECT</span>
    </div>
  );
}
