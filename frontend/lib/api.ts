import type {
  CareRequest,
  CareRequestPayload,
} from "@/types/care-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export const API_URL_MISSING_MESSAGE =
  "NEXT_PUBLIC_API_URL est manquant. Configurez l'URL du backend Render dans les variables d'environnement.";

export function requireApiUrl(): string {
  if (!API_URL) {
    throw new Error(API_URL_MISSING_MESSAGE);
  }
  return API_URL;
}

export type ApiResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
};

export type AdminUser = {
  id: number;
  email: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
};

export type AdminLoginData = {
  token: string;
  admin: AdminUser;
};

export type EventLogPayload = {
  eventType: string;
  pageUrl?: string;
  elementName?: string;
  userRole?: string;
  sessionId?: string;
  browser?: string;
  os?: string;
  deviceType?: string;
  referrer?: string;
  locale?: string;
  metadata?: Record<string, unknown>;
};

export type EventLogEntry = {
  id: number;
  eventType: string;
  pageUrl: string | null;
  elementName: string | null;
  userRole: string;
  sessionId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  browser: string | null;
  os: string | null;
  deviceType: string | null;
  referrer: string | null;
  locale: string | null;
  country: string | null;
  city: string | null;
  timezone: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type AdminLogsData = {
  items: EventLogEntry[];
  count: number;
  total: number;
  page: number;
  limit: number;
};

export const ADMIN_TOKEN_KEY = "admin_token";
export const ADMIN_USER_KEY = "admin_user";

async function parseJson<T>(response: Response): Promise<ApiResult<T>> {
  try {
    return (await response.json()) as ApiResult<T>;
  } catch {
    return {
      success: false,
      message: "Réponse serveur invalide",
    };
  }
}

function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function saveAdminSession(token: string, admin: AdminUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken());
}

async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  authenticated = false
): Promise<ApiResult<T>> {
  const baseUrl = requireApiUrl();
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const token = getAdminToken();
    if (!token) {
      return { success: false, message: "Non authentifié" };
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });

  return parseJson<T>(response);
}

export async function createCareRequest(
  payload: CareRequestPayload
): Promise<ApiResult<CareRequest>> {
  return apiRequest<CareRequest>("/api/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** @deprecated utiliser createCareRequest */
export const submitCareRequest = createCareRequest;

export async function adminLogin(
  email: string,
  password: string
): Promise<ApiResult<AdminLoginData>> {
  return apiRequest<AdminLoginData>("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function createLog(
  payload: EventLogPayload
): Promise<ApiResult<null>> {
  return apiRequest<null>("/api/logs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAdminLogs(params: {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
} = {}): Promise<ApiResult<AdminLogsData>> {
  const search = new URLSearchParams();
  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const query = search.toString();
  return apiRequest<AdminLogsData>(
    `/api/admin/logs${query ? `?${query}` : ""}`,
    { method: "GET" },
    true
  );
}

export async function deleteAdminLogs(
  ids: number[]
): Promise<ApiResult<{ count: number }>> {
  return apiRequest<{ count: number }>(
    "/api/admin/logs",
    {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    },
    true
  );
}

export async function clearAdminLogs(filters: {
  startDate?: string;
  endDate?: string;
} = {}): Promise<ApiResult<{ count: number }>> {
  return apiRequest<{ count: number }>(
    "/api/admin/logs/clear",
    {
      method: "DELETE",
      body: JSON.stringify(filters),
    },
    true
  );
}

export async function adminApiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  return apiRequest<T>(path, init, true);
}
