/** Clés localStorage — session admin côté client (middleware utilise le cookie httpOnly). */
export const ADMIN_TOKEN_STORAGE_KEY = "admin_token";
export const ADMIN_PROFILE_STORAGE_KEY = "admin";

export function saveAdminSession(token: string, admin: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(admin));
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  localStorage.removeItem(ADMIN_PROFILE_STORAGE_KEY);
}

export function getStoredAdminProfile<T = Record<string, unknown>>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
