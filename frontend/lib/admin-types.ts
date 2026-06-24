export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

export type DemandeStatus = "en_attente" | "acceptee" | "refusee";

export type Demande = {
  id: number;
  patient: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  careType: string;
  description: string;
  requestedDate: string;
  requestedTime: string;
  proposedPrice: number;
  status: DemandeStatus;
  isUrgent: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  adminNotes: string;
  refuseReason?: string;
};

export const DEMANDE_STATUS_LABELS: Record<DemandeStatus, string> = {
  en_attente: "En attente",
  acceptee: "Acceptée",
  refusee: "Refusée",
};

export function formatDemandeDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDemandeDateTime(date: string) {
  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatProposedPrice(price: number) {
  return price > 0 ? `${price} MAD` : "Non renseigné";
}
