const RENDER_API_FALLBACK = "https://soinsconnect-api.onrender.com";
const LOCAL_API_FALLBACK = "http://localhost:4000";

const LOCALES = ["fr", "ar"] as const;
export type AppLocale = (typeof LOCALES)[number];

/** URL publique du backend (sans slash final) */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  (process.env.NODE_ENV === "production"
    ? RENDER_API_FALLBACK
    : LOCAL_API_FALLBACK)
).replace(/\/+$/, "");

/** URL backend pour les proxies Next.js (server-side) */
export const SERVER_API_URL = (
  process.env.API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  (process.env.NODE_ENV === "production"
    ? RENDER_API_FALLBACK
    : LOCAL_API_FALLBACK)
).replace(/\/+$/, "");

export const DEFAULT_LOCALE: AppLocale = LOCALES.includes(
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE?.trim() as AppLocale
)
  ? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE!.trim() as AppLocale)
  : "fr";

export const APP_TIME_ZONE = "Africa/Casablanca";

export function normalizeApiUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

const isProduction = process.env.NODE_ENV === "production";

export const API_UNREACHABLE_MESSAGE = isProduction
  ? "Impossible de contacter le serveur. Veuillez réessayer plus tard."
  : "Impossible de contacter le serveur. Vérifiez que le backend tourne sur le port 4000.";

export const API_UNAVAILABLE_MESSAGE = isProduction
  ? "Impossible de contacter le serveur. Veuillez réessayer plus tard."
  : "Backend indisponible. Vérifiez que le serveur API tourne sur le port 4000.";
