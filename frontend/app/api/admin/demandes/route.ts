import { proxyAdminDemandes } from "@/lib/admin-demandes-proxy";

export async function GET() {
  return proxyAdminDemandes("");
}
