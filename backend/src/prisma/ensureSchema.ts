import { prisma } from "./client";

/**
 * Vérifie / répare le schéma minimal requis au démarrage
 * (migrations Prisma non appliquées, colonnes manquantes).
 */
export async function ensureDatabaseSchema() {
  const tableRows = await prisma.$queryRaw<Array<{ table_count: bigint }>>`
    SELECT COUNT(*) AS table_count
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'admins'
  `;

  if (Number(tableRows[0]?.table_count ?? 0) === 0) {
    throw new Error(
      "Table admins absente. Exécutez: npx prisma migrate deploy && npx prisma db seed"
    );
  }

  const columnRows = await prisma.$queryRaw<Array<{ column_count: bigint }>>`
    SELECT COUNT(*) AS column_count
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'care_requests'
      AND COLUMN_NAME = 'admin_notes'
  `;

  const hasAdminNotes = Number(columnRows[0]?.column_count ?? 0) > 0;

  if (!hasAdminNotes) {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE `care_requests` ADD COLUMN `admin_notes` TEXT NULL"
    );
    console.log("[schema] Colonne care_requests.admin_notes ajoutée");
  }

  const eventLogRows = await prisma.$queryRaw<Array<{ table_count: bigint }>>`
    SELECT COUNT(*) AS table_count
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'event_logs'
  `;

  if (Number(eventLogRows[0]?.table_count ?? 0) === 0) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`event_logs\` (
        \`id\` INTEGER NOT NULL AUTO_INCREMENT,
        \`event_type\` VARCHAR(100) NOT NULL,
        \`page_url\` VARCHAR(500) NULL,
        \`element_name\` VARCHAR(255) NULL,
        \`user_role\` VARCHAR(20) NOT NULL DEFAULT 'visitor',
        \`session_id\` VARCHAR(64) NULL,
        \`ip_address\` VARCHAR(45) NULL,
        \`user_agent\` TEXT NULL,
        \`browser\` VARCHAR(100) NULL,
        \`os\` VARCHAR(100) NULL,
        \`device_type\` VARCHAR(50) NULL,
        \`referrer\` VARCHAR(500) NULL,
        \`locale\` VARCHAR(10) NULL,
        \`country\` VARCHAR(100) NULL,
        \`city\` VARCHAR(100) NULL,
        \`timezone\` VARCHAR(100) NULL,
        \`metadata\` JSON NULL,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX \`event_logs_created_at_idx\`(\`created_at\`),
        INDEX \`event_logs_event_type_idx\`(\`event_type\`),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
    console.log("[schema] Table event_logs créée");
  }

  const auditLogRows = await prisma.$queryRaw<Array<{ table_count: bigint }>>`
    SELECT COUNT(*) AS table_count
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'audit_logs'
  `;

  if (Number(auditLogRows[0]?.table_count ?? 0) === 0) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`audit_logs\` (
        \`id\` INTEGER NOT NULL AUTO_INCREMENT,
        \`action\` VARCHAR(100) NOT NULL,
        \`user_id\` INTEGER NULL,
        \`user_email\` VARCHAR(255) NULL,
        \`user_role\` VARCHAR(50) NULL,
        \`ip_address\` VARCHAR(45) NULL,
        \`user_agent\` TEXT NULL,
        \`resource\` VARCHAR(255) NULL,
        \`resource_id\` VARCHAR(50) NULL,
        \`metadata\` JSON NULL,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX \`audit_logs_created_at_idx\`(\`created_at\`),
        INDEX \`audit_logs_action_idx\`(\`action\`),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
    console.log("[schema] Table audit_logs créée");
  }
}
