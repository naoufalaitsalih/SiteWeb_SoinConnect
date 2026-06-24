import { prisma } from "./client";

/**
 * Vérifie que le schéma minimal est présent (PostgreSQL).
 * Les migrations sont appliquées via `prisma migrate deploy` en production.
 */
export async function ensureDatabaseSchema() {
  const tableRows = await prisma.$queryRaw<Array<{ table_count: bigint }>>`
    SELECT COUNT(*) AS table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'admins'
  `;

  if (Number(tableRows[0]?.table_count ?? 0) === 0) {
    throw new Error(
      "Table admins absente. Exécutez: npx prisma migrate deploy && npx prisma db seed"
    );
  }
}
