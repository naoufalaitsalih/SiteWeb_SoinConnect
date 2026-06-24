/**
 * URL de base API (sans slash final).
 * Utilisé par le formulaire public qui appelle le backend directement.
 */
export function getPublicApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "http://localhost:4000";
  return raw.replace(/\/+$/, "");
}

/** Proxies Next.js (server) — préfère API_URL puis NEXT_PUBLIC_API_URL */
export function getServerApiBaseUrl(): string {
  const raw =
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "http://localhost:4000";
  return raw.replace(/\/+$/, "");
}

export function publicApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicApiBaseUrl()}${normalizedPath}`;
}

export function serverApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getServerApiBaseUrl()}${normalizedPath}`;
}
