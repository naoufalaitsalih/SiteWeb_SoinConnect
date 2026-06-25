import { adminApiRequest } from "@/lib/api";
import type { Demande, DemandeStatus } from "@/lib/admin-types";
import { API_UNAVAILABLE_MESSAGE } from "@/lib/env";

export type ApiDemandeStatus = "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE";

export type ApiDemande = {
  id: number;
  patient: string;
  phone: string;
  email: string;
  careType: string;
  description: string;
  address: string;
  city: string;
  requestedDate: string;
  requestedTime: string;
  proposedPrice: number | null;
  isUrgent: boolean;
  status: ApiDemandeStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiListResponse = {
  success: boolean;
  message?: string;
  data?: ApiDemande[];
  count?: number;
};

export type ApiDemandeResponse = {
  success: boolean;
  message?: string;
  data?: ApiDemande;
};

const API_BASE = "/api/admin/demandes";

export function mapApiStatusToUi(status: ApiDemandeStatus): DemandeStatus {
  switch (status) {
    case "ACCEPTEE":
      return "acceptee";
    case "REFUSEE":
      return "refusee";
    default:
      return "en_attente";
  }
}

export function mapUiStatusToApi(status: DemandeStatus): ApiDemandeStatus {
  switch (status) {
    case "acceptee":
      return "ACCEPTEE";
    case "refusee":
      return "REFUSEE";
    default:
      return "EN_ATTENTE";
  }
}

export function mapApiDemandeToUi(item: ApiDemande): Demande {
  const adminNotes = item.adminNotes ?? "";
  const refuseMatch = adminNotes.match(/\[Motif de refus\]\s*(.+)/);

  return {
    id: item.id,
    patient: item.patient,
    phone: item.phone,
    email: item.email,
    address: item.address,
    city: item.city,
    careType: item.careType,
    description: item.description,
    requestedDate: item.requestedDate,
    requestedTime: item.requestedTime,
    proposedPrice: item.proposedPrice ?? 0,
    status: mapApiStatusToUi(item.status),
    isUrgent: item.isUrgent,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    createdBy: "Formulaire web",
    adminNotes,
    refuseReason: refuseMatch?.[1]?.trim(),
  };
}

async function parseJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchAdminDemandes(): Promise<{
  demandes: Demande[];
  error?: string;
}> {
  try {
    const result = await adminApiRequest<ApiDemande[]>(API_BASE, {
      cache: "no-store",
    });

    if (!result.success) {
      return {
        demandes: [],
        error: result.message ?? "Erreur de chargement des demandes",
      };
    }

    const items = Array.isArray(result.data) ? result.data : [];
    return { demandes: items.map(mapApiDemandeToUi) };
  } catch {
    return {
      demandes: [],
      error:
        API_UNAVAILABLE_MESSAGE,
    };
  }
}

export async function updateDemandeStatus(
  id: number,
  status: ApiDemandeStatus
): Promise<ApiDemandeResponse> {
  try {
    const result = await adminApiRequest<ApiDemande>(`${API_BASE}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return (
      result.success
        ? { success: true, data: result.data }
        : { success: false, message: result.message ?? "Erreur" }
    ) as ApiDemandeResponse;
  } catch {
    return {
      success: false,
      message:
        API_UNAVAILABLE_MESSAGE,
    };
  }
}

export async function saveDemandeNotes(
  id: number,
  adminNotes: string
): Promise<ApiDemandeResponse> {
  try {
    const result = await adminApiRequest<ApiDemande>(`${API_BASE}/${id}/notes`, {
      method: "PATCH",
      body: JSON.stringify({ admin_notes: adminNotes.trim() || "" }),
    });
    return (
      result.success
        ? { success: true, data: result.data }
        : { success: false, message: result.message ?? "Erreur" }
    ) as ApiDemandeResponse;
  } catch {
    return {
      success: false,
      message:
        API_UNAVAILABLE_MESSAGE,
    };
  }
}

export async function deleteDemande(id: number): Promise<ApiDemandeResponse> {
  try {
    const result = await adminApiRequest<ApiDemande>(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    return (
      result.success
        ? { success: true, data: result.data }
        : { success: false, message: result.message ?? "Erreur" }
    ) as ApiDemandeResponse;
  } catch {
    return {
      success: false,
      message:
        API_UNAVAILABLE_MESSAGE,
    };
  }
}

