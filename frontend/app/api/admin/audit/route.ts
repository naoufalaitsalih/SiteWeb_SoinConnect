import { NextRequest, NextResponse } from "next/server";
import { proxyAdminAudit } from "@/lib/admin-logs-proxy";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.search;
  return proxyAdminAudit(search);
}
