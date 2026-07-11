type LogoProps = {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const markSize = {
  sm: 28,
  md: 32,
  lg: 40,
} as const;

/**
 * Marque NURIA — texte fixe, jamais traduit, toujours LTR.
 * Identique en français, arabe et anglais.
 */
export default function Logo({
  variant = "light",
  size = "md",
  className = "",
}: LogoProps) {
  const px = markSize[size];
  const markFill = variant === "dark" ? "#FFFFFF" : "#009493";
  const roseFill = variant === "dark" ? "#FFB6A6" : "#FFB6A6";

  return (
    <div
      dir="ltr"
      className={`logo ${className}`.trim()}
      role="img"
      aria-label="NURIA"
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Two people connected — abstract N */}
        <circle cx="11" cy="10" r="4.2" fill={markFill} />
        <path
          d="M7.2 16.5c0-1.2.9-2.2 2.1-2.4 1.2-.2 6.2-.2 7.4 0 1.2.2 2.1 1.2 2.1 2.4v11.2c0 1.3-1.1 2.4-2.4 2.4h-6.8c-1.3 0-2.4-1.1-2.4-2.4V16.5Z"
          fill={markFill}
        />
        <circle cx="29" cy="10" r="4.2" fill={roseFill} />
        <path
          d="M21.2 16.5c0-1.2.9-2.2 2.1-2.4 1.2-.2 6.2-.2 7.4 0 1.2.2 2.1 1.2 2.1 2.4v11.2c0 1.3-1.1 2.4-2.4 2.4h-6.8c-1.3 0-2.4-1.1-2.4-2.4V16.5Z"
          fill={markFill}
        />
        {/* Connection bridge — forms the N diagonal */}
        <path
          d="M16.5 18.5c3.2 2.8 6.8 5.6 10.2 8.2"
          stroke={roseFill}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`logo-nuria logo-nuria--${variant} logo-nuria--${size}`}
      >
        NURIA
      </span>
    </div>
  );
}
