import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiToken } from "@/lib/require-admin-api";
import { serverApiUrl } from "@/lib/api-base";
import { API_UNREACHABLE_MESSAGE } from "@/lib/env";
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const tokenOrResponse = await requireAdminApiToken();
  if (tokenOrResponse instanceof NextResponse) {
    return tokenOrResponse;
  }

  const { id } = await context.params;

  try {
    const backendRes = await fetch(serverApiUrl(`/api/admin/requests/${id}/notes`), {
      headers: { Authorization: `Bearer ${tokenOrResponse}` },
      cache: "no-store",
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("[admin/requests/notes GET proxy]", error);
    return NextResponse.json(
      { success: false, message: API_UNREACHABLE_MESSAGE },
      { status: 503 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const tokenOrResponse = await requireAdminApiToken();
  if (tokenOrResponse instanceof NextResponse) {
    return tokenOrResponse;
  }

  const { id } = await context.params;
  const body = await request.json();

  try {
    const backendRes = await fetch(serverApiUrl(`/api/admin/requests/${id}/notes`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenOrResponse}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("[admin/requests/notes PATCH proxy]", error);
    return NextResponse.json(
      { success: false, message: API_UNREACHABLE_MESSAGE },
      { status: 503 }
    );
  }
}
