const LOCAL_API_FALLBACK = "http://localhost:4000";

/** URL publique du backend (client — formulaire, fetch direct) */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || LOCAL_API_FALLBACK;

/** URL backend pour les proxies Next.js (server-side) */
export const SERVER_API_URL =
  process.env.API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  LOCAL_API_FALLBACK;

export function normalizeApiUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

const isProduction = process.env.NODE_ENV === "production";

/** Message quand le backend est injoignable (proxies API) */
export const API_UNREACHABLE_MESSAGE = isProduction
  ? "Impossible de contacter le serveur. Veuillez réessayer plus tard."
  : "Impossible de contacter le serveur. Vérifiez que le backend tourne sur le port 4000.";

/** Message quand l'API admin renvoie une erreur réseau (client) */
export const API_UNAVAILABLE_MESSAGE = isProduction
  ? "Impossible de contacter le serveur. Veuillez réessayer plus tard."
  : "Backend indisponible. Vérifiez que le serveur API tourne sur le port 4000.";
