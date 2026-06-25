/**
 * Masque le mot de passe dans une URL de connexion (logs uniquement).
 */
export function maskDatabaseUrl(url: string | undefined): string {
  if (!url?.trim()) {
    return "(non défini)";
  }

  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = "***";
    }
    return parsed.toString();
  } catch {
    return url.replace(/:([^:@/]+)@/, ":***@");
  }
}
