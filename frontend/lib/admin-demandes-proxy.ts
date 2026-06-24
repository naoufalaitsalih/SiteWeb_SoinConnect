import { NextResponse } from "next/server";
import { requireAdminApiToken } from "@/lib/require-admin-api";
import { serverApiUrl } from "@/lib/api-base";
export async function getAdminToken() {
  const result = await requireAdminApiToken();
  return typeof result === "string" ? result : null;
}

export async function proxyAdminDemandes(
  path: string,
  init?: RequestInit
): Promise<NextResponse> {
  const tokenOrResponse = await requireAdminApiToken();
  if (tokenOrResponse instanceof NextResponse) {
    return tokenOrResponse;
  }

  try {
    const backendRes = await fetch(serverApiUrl(`/api/admin/demandes${path}`), {
      ...init,
      headers: {
        Authorization: `Bearer ${tokenOrResponse}`,
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
      cache: "no-store",
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error(`[admin/demandes proxy ${path}]`, error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Impossible de contacter le serveur. Vérifiez que le backend tourne sur le port 4000.",
      },
      { status: 503 }
    );
  }
}
