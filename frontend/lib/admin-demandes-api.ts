import type { Demande, DemandeStatus } from "@/lib/admin-types";

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

/** Proxy same-origin (cookie admin) — forwards to backend via Next.js API routes */
const PROXY_BASE = "/api/admin/demandes";

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
    const res = await fetch(PROXY_BASE, {
      credentials: "include",
      cache: "no-store",
    });

    const data = await parseJson<ApiListResponse>(res);

    if (!data) {
      return {
        demandes: [],
        error: res.ok
          ? "Erreur de chargement des demandes"
          : "Backend indisponible. Vérifiez que le serveur API tourne sur le port 4000.",
      };
    }

    if (!res.ok || !data.success) {
      if (res.status === 503 || res.status >= 500) {
        return {
          demandes: [],
          error: data.message ?? "Erreur de chargement des demandes",
        };
      }
      return {
        demandes: [],
        error: data.message ?? "Erreur de chargement des demandes",
      };
    }

    if (!Array.isArray(data.data)) {
      return {
        demandes: [],
        error: "Erreur de chargement des demandes",
      };
    }

    return { demandes: data.data.map(mapApiDemandeToUi) };
  } catch {
    return {
      demandes: [],
      error:
        "Backend indisponible. Vérifiez que le serveur API tourne sur le port 4000.",
    };
  }
}

export async function updateDemandeStatus(
  id: number,
  status: ApiDemandeStatus
): Promise<ApiDemandeResponse> {
  try {
    const res = await fetch(`${PROXY_BASE}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    return (
      (await parseJson<ApiDemandeResponse>(res)) ?? {
        success: false,
        message: "Erreur de chargement des demandes",
      }
    );
  } catch {
    return {
      success: false,
      message:
        "Backend indisponible. Vérifiez que le serveur API tourne sur le port 4000.",
    };
  }
}

export async function saveDemandeNotes(
  id: number,
  adminNotes: string
): Promise<ApiDemandeResponse> {
  try {
    const res = await fetch(`${PROXY_BASE}/${id}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ admin_notes: adminNotes.trim() || "" }),
    });
    return (
      (await parseJson<ApiDemandeResponse>(res)) ?? {
        success: false,
        message: "Erreur de chargement des demandes",
      }
    );
  } catch {
    return {
      success: false,
      message:
        "Backend indisponible. Vérifiez que le serveur API tourne sur le port 4000.",
    };
  }
}

export async function deleteDemande(id: number): Promise<ApiDemandeResponse> {
  try {
    const res = await fetch(`${PROXY_BASE}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return (
      (await parseJson<ApiDemandeResponse>(res)) ?? {
        success: false,
        message: "Erreur de chargement des demandes",
      }
    );
  } catch {
    return {
      success: false,
      message:
        "Backend indisponible. Vérifiez que le serveur API tourne sur le port 4000.",
    };
  }
}

