import Image from "next/image";

type LogoProps = {
  variant?: "light" | "dark";
  /** Mark height in px — proportions preserved */
  markHeight?: number;
  className?: string;
  showWordmark?: boolean;
};

/**
 * Logo officiel NURIA (image) + wordmark.
 * Toujours LTR, jamais traduit.
 */
export default function Logo({
  variant = "light",
  markHeight = 44,
  className = "",
  showWordmark = true,
}: LogoProps) {
  const wordmarkColor = variant === "dark" ? "text-white" : "text-[#009493]";
  // Source 162×176 — keep aspect ratio
  const markWidth = Math.round((markHeight * 162) / 176);

  return (
    <div
      dir="ltr"
      className={`logo inline-flex items-center gap-3 ${className}`.trim()}
      role="img"
      aria-label="NURIA"
    >
      <Image
        src="/images/nuria-mark.png"
        alt="NURIA"
        width={markWidth}
        height={markHeight}
        className="h-auto w-auto shrink-0 object-contain"
        style={{ height: markHeight, width: "auto" }}
        priority
      />
      {showWordmark && (
        <span
          className={`font-sans uppercase ${wordmarkColor}`}
          style={{
            fontWeight: 700,
            letterSpacing: "0.08em",
            fontSize: Math.max(15, Math.round(markHeight * 0.42)),
            lineHeight: 1,
          }}
        >
          NURIA
        </span>
      )}
    </div>
  );
}
