import { prisma } from "../prisma/client";
import {
  mapCareRequestToAdminDemande,
  toDbStatus,
  type AdminDemandeStatus,
} from "./adminDemandesMapper";

export async function listAdminDemandes() {
  const rows = await prisma.careRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return rows.map(mapCareRequestToAdminDemande);
}

export async function updateAdminDemandeStatus(
  id: number,
  status: AdminDemandeStatus
) {
  const request = await prisma.careRequest.update({
    where: { id },
    data: { status: toDbStatus(status) },
  });

  return mapCareRequestToAdminDemande(request);
}

export async function updateAdminDemandeNotes(id: number, adminNotes: string | null) {
  const request = await prisma.careRequest.update({
    where: { id },
    data: { adminNotes },
  });

  return mapCareRequestToAdminDemande(request);
}

export async function deleteAdminDemande(id: number) {
  await prisma.careRequest.delete({ where: { id } });
}
