import { adminFetch } from "@/lib/admin-fetch";

export type AdminNotesResponse = {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    adminNotes: string | null;
    updatedAt: string;
  };
};

export async function fetchAdminNotes(
  requestId: number
): Promise<AdminNotesResponse> {
  const res = await adminFetch(`/api/admin/requests/${requestId}/notes`);
  return res.json();
}

export async function saveAdminNotes(
  requestId: number,
  adminNotes: string
): Promise<AdminNotesResponse> {
  const res = await adminFetch(`/api/admin/requests/${requestId}/notes`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminNotes: adminNotes.trim() || null }),
  });
  return res.json();
}
