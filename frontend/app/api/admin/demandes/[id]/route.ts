import { NextRequest } from "next/server";
import { proxyAdminDemandes } from "@/lib/admin-demandes-proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return proxyAdminDemandes(`/${id}`, { method: "DELETE" });
}
