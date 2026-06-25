/** Identifiant admin officiel unique SoinsConnect */
export const OFFICIAL_ADMIN = {
  email: "admin@soinsconnect.ma",
  password: "Admin@2026",
  firstName: "Admin",
  lastName: "SoinsConnect",
  role: "super_admin",
} as const;

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}
