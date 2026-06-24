import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { requireAdminApiToken } from "@/lib/require-admin-api";

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

export async function POST() {
  const tokenOrResponse = await requireAdminApiToken();

  if (typeof tokenOrResponse === "string") {
    try {
      await fetch(`${API_URL}/api/admin/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenOrResponse}` },
      });
    } catch {
      // Déconnexion locale même si le backend est indisponible
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
