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

export function parseDatabaseInfo(url: string | undefined): {
  host: string | null;
  database: string | null;
  schema: string;
  port: string | null;
} {
  if (!url?.trim()) {
    return { host: null, database: null, schema: "public", port: null };
  }

  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      database: parsed.pathname.replace(/^\//, "") || null,
      schema: parsed.searchParams.get("schema") ?? "public",
      port: parsed.port || "5432",
    };
  } catch {
    return { host: null, database: null, schema: "public", port: null };
  }
}
