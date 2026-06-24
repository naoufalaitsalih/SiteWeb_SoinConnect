import { API_URL, SERVER_API_URL, normalizeApiUrl } from "./env";

/**
 * URL de base API (sans slash final).
 * Utilisé par le formulaire public qui appelle le backend directement.
 */
export function getPublicApiBaseUrl(): string {
  return normalizeApiUrl(API_URL);
}

/** Proxies Next.js (server) — préfère API_URL puis NEXT_PUBLIC_API_URL */
export function getServerApiBaseUrl(): string {
  return normalizeApiUrl(SERVER_API_URL);
}

export function publicApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicApiBaseUrl()}${normalizedPath}`;
}

export function serverApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getServerApiBaseUrl()}${normalizedPath}`;
}

export { API_URL, SERVER_API_URL } from "./env";
