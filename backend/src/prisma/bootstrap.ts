import { ensureDatabaseSchema } from "./ensureSchema";
import { runAdminAuthDiagnostic } from "../services/officialAdminRepair";

export { ensureDatabaseSchema };

/** Schéma + diagnostic/réparation admin au démarrage. */
export async function prepareDatabaseAndAdmin(): Promise<void> {
  await ensureDatabaseSchema();
  await runAdminAuthDiagnostic(true);
}
