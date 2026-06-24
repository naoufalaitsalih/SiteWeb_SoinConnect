import { NextRequest } from "next/server";
import { proxyAdminDemandes } from "@/lib/admin-demandes-proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.text();
  return proxyAdminDemandes(`/${id}/status`, {
    method: "PATCH",
    body,
  });
}
