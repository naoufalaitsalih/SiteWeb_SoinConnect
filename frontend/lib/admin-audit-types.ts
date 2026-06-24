export type AuditLog = {
  id: number;
  action: string;
  userId: number | null;
  userEmail: string | null;
  userRole: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  resource: string | null;
  resourceId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type AuditListResponse = {
  success: boolean;
  message?: string;
  data?: AuditLog[];
  total?: number;
  page?: number;
  limit?: number;
};

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  login_success: "Connexion réussie",
  login_failed: "Échec connexion",
  logout: "Déconnexion",
  password_change: "Changement mot de passe",
  account_create: "Création compte",
  data_create: "Création données",
  data_update: "Modification données",
  data_delete: "Suppression données",
  logs_clear: "Purge logs",
  access_denied: "Accès refusé",
};
