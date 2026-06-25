import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_OPTIONS } from "@/lib/admin-auth";
import { requireAdminApiToken } from "@/lib/require-admin-api";
import { serverApiUrl } from "@/lib/api-base";

export async function POST() {
  const tokenOrResponse = await requireAdminApiToken();

  if (typeof tokenOrResponse === "string") {
    try {
      await fetch(serverApiUrl("/api/admin/auth/logout"), {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenOrResponse}` },
      });
    } catch {
      // Déconnexion locale même si le backend est indisponible
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    ...ADMIN_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
