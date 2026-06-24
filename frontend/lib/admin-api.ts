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
  const res = await fetch(`/api/admin/requests/${requestId}/notes`, {
    credentials: "include",
  });
  return res.json();
}

export async function saveAdminNotes(
  requestId: number,
  adminNotes: string
): Promise<AdminNotesResponse> {
  const res = await fetch(`/api/admin/requests/${requestId}/notes`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ adminNotes: adminNotes.trim() || null }),
  });
  return res.json();
}
