import type { CareRequest } from "@prisma/client";

export type AdminDemandeStatus = "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE";

const DB_TO_ADMIN_STATUS: Record<string, AdminDemandeStatus> = {
  pending: "EN_ATTENTE",
  en_attente: "EN_ATTENTE",
  EN_ATTENTE: "EN_ATTENTE",
  in_progress: "ACCEPTEE",
  accepted: "ACCEPTEE",
  acceptee: "ACCEPTEE",
  ACCEPTEE: "ACCEPTEE",
  completed: "ACCEPTEE",
  cancelled: "REFUSEE",
  refused: "REFUSEE",
  refusee: "REFUSEE",
  REFUSEE: "REFUSEE",
};

const ADMIN_TO_DB_STATUS: Record<AdminDemandeStatus, string> = {
  EN_ATTENTE: "pending",
  ACCEPTEE: "accepted",
  REFUSEE: "refused",
};

export function toAdminStatus(dbStatus: string): AdminDemandeStatus {
  return DB_TO_ADMIN_STATUS[dbStatus] ?? "EN_ATTENTE";
}

export function toDbStatus(adminStatus: AdminDemandeStatus): string {
  return ADMIN_TO_DB_STATUS[adminStatus];
}

function extractCity(address: string): string {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length <= 1) return "";
  return parts[parts.length - 1];
}

function extractStreetAddress(address: string): string {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length <= 1) return address.trim();
  return parts.slice(0, -1).join(", ");
}

export function mapCareRequestToAdminDemande(request: CareRequest) {
  const city = extractCity(request.address);
  const address = extractStreetAddress(request.address);

  return {
    id: request.id,
    patient: request.fullName,
    phone: request.phone,
    email: request.email ?? "",
    careType: request.careType,
    description: request.description ?? "",
    address,
    city,
    requestedDate: request.requestedDate.toISOString().slice(0, 10),
    requestedTime: request.requestedTime,
    proposedPrice: null as number | null,
    isUrgent: request.isUrgent,
    status: toAdminStatus(request.status),
    adminNotes: request.adminNotes,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  };
}
