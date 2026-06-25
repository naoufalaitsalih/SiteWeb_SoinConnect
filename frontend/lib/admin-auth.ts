import { jwtVerify } from "jose";

function getJwtSecretKey(): Uint8Array | null {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    console.error(
      "[admin-auth] JWT_SECRET manquant — vérifiez les variables Vercel (.env.local en local)"
    );
    return null;
  }
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    console.warn(
      "[admin-auth] JWT_SECRET < 32 caractères en production — doit correspondre exactement au backend"
    );
  }
  return new TextEncoder().encode(secret);
}

export const ADMIN_COOKIE = "admin_token";

/** Options cookie session admin — proxy Next.js same-origin uniquement. */
export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}

/** @deprecated utiliser getAdminCookieOptions() */
export const ADMIN_COOKIE_OPTIONS = getAdminCookieOptions();

/** credentials obligatoire pour que le navigateur envoie/reçoive admin_token */
export const ADMIN_FETCH_CREDENTIALS = "include" as RequestCredentials;

export async function isValidAdminToken(token: string): Promise<boolean> {
  const secretKey = getJwtSecretKey();
  if (!secretKey) return false;

  try {
    await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return true;
  } catch (error) {
    console.warn(
      "[admin-auth] JWT verification failed:",
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

export const ADMIN_PUBLIC_PATHS = ["/admin/login"];

export function isAdminPublicPath(pathname: string): boolean {
  return ADMIN_PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/** Redirection post-login limitée aux chemins admin same-origin */
export function sanitizeAdminRedirect(path: string | null | undefined): string {
  const fallback = "/admin/dashboard";
  if (!path || typeof path !== "string") return fallback;

  const trimmed = path.trim();
  if (!trimmed.startsWith("/admin")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  if (trimmed.includes("\\")) return fallback;

  return trimmed;
}
