import { NextResponse } from "next/server";
import { requireAdminApiToken } from "@/lib/require-admin-api";
import { serverApiUrl } from "@/lib/api-base";

export async function proxyAdminLogs(
  path: string,
  init?: RequestInit
): Promise<NextResponse> {
  const tokenOrResponse = await requireAdminApiToken();
  if (tokenOrResponse instanceof NextResponse) {
    return tokenOrResponse;
  }

  try {
    const backendRes = await fetch(serverApiUrl(`/api/admin/logs${path}`), {
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
    console.error(`[admin/logs proxy ${path}]`, error);
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

export async function proxyAdminAudit(
  path: string,
  init?: RequestInit
): Promise<NextResponse> {
  const tokenOrResponse = await requireAdminApiToken();
  if (tokenOrResponse instanceof NextResponse) {
    return tokenOrResponse;
  }

  try {
    const backendRes = await fetch(serverApiUrl(`/api/admin/audit${path}`), {
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
    console.error(`[admin/audit proxy ${path}]`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Impossible de contacter le serveur d'audit.",
      },
      { status: 503 }
    );
  }
}
