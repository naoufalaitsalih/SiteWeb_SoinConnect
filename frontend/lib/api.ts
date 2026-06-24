import {
  ApiResponse,
  CareRequest,
  CareRequestPayload,
} from "@/types/care-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function submitCareRequest(
  payload: CareRequestPayload
): Promise<ApiResponse<CareRequest>> {
  const response = await fetch(`${API_URL}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse<CareRequest>(response);
}
