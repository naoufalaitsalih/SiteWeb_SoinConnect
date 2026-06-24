import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin-auth";

export async function requireAdminApiToken(): Promise<string | NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Non authentifié" },
      { status: 401 }
    );
  }

  const valid = await isValidAdminToken(token);
  if (!valid) {
    return NextResponse.json(
      { success: false, message: "Session invalide ou expirée" },
      { status: 401 }
    );
  }

  return token;
}
