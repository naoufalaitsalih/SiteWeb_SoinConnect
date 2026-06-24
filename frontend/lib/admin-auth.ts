import { jwtVerify } from "jose";

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "JWT_SECRET manquant. Définissez une clé forte (min. 32 caractères) dans .env.local"
    );
  }
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error("JWT_SECRET doit contenir au moins 32 caractères en production");
  }
  return new TextEncoder().encode(secret);
}

export const ADMIN_COOKIE = "admin_token";

export async function isValidAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getJwtSecretKey(), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
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
