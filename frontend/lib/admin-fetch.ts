import { ADMIN_FETCH_CREDENTIALS } from "@/lib/admin-auth";

/** fetch admin same-origin avec cookie admin_token (credentials: include). */
export function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: ADMIN_FETCH_CREDENTIALS,
  });
}
