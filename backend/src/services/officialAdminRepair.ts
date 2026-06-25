import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";
import {
  OFFICIAL_ADMIN,
  normalizeAdminEmail,
} from "../config/officialAdmin";
import { maskDatabaseUrl, parseDatabaseInfo } from "../utils/maskDatabaseUrl";

const BCRYPT_ROUNDS = 12;
const JWT_ALGORITHM = "HS256" as const;

export type RepairResult = {
  created: boolean;
  passwordReset: boolean;
  bcryptOk: boolean;
  adminId: number;
  email: string;
};

/** Supprime les doublons email (casse différente) et garde l'email canonique. */
async function removeDuplicateAdmins(canonicalEmail: string): Promise<number> {
  const deleted = await prisma.$executeRaw`
    DELETE FROM "admins"
    WHERE LOWER("email") = LOWER(${canonicalEmail})
      AND "email" <> ${canonicalEmail}
  `;
  return Number(deleted);
}

/**
 * Crée ou réinitialise l'admin officiel dans la table `admins`.
 * Hash bcrypt de Admin@2026 — idempotent à chaque appel.
 */
export async function repairOfficialAdmin(): Promise<RepairResult> {
  const email = normalizeAdminEmail(OFFICIAL_ADMIN.email);
  const hashedPassword = await bcrypt.hash(OFFICIAL_ADMIN.password, BCRYPT_ROUNDS);

  const existing = await prisma.admin.findUnique({ where: { email } });
  const created = !existing;

  await removeDuplicateAdmins(email);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      firstName: OFFICIAL_ADMIN.firstName,
      lastName: OFFICIAL_ADMIN.lastName,
      password: hashedPassword,
      role: "super_admin",
      isActive: true,
    },
    create: {
      email,
      firstName: OFFICIAL_ADMIN.firstName,
      lastName: OFFICIAL_ADMIN.lastName,
      password: hashedPassword,
      role: "super_admin",
      isActive: true,
    },
  });

  const bcryptOk = await bcrypt.compare(OFFICIAL_ADMIN.password, admin.password);

  return {
    created,
    passwordReset: !created || !bcryptOk,
    bcryptOk,
    adminId: admin.id,
    email: admin.email,
  };
}

export type AuthDiagnosticReport = {
  databaseConnected: boolean;
  databaseHost: string | null;
  databaseName: string | null;
  databaseSchema: string;
  databaseUrlMasked: string;
  adminsTableExists: boolean;
  adminCount: number;
  officialAdminExists: boolean;
  officialAdminId: number | null;
  officialAdminIsActive: boolean | null;
  officialAdminRole: string | null;
  bcryptOk: boolean;
  jwtSecretPresent: boolean;
  jwtSecretLength: number;
  jwtTestOk: boolean;
  loginSimulationOk: boolean;
  repairApplied: boolean;
  issues: string[];
};

function checkJwtConfig(): { present: boolean; length: number; testOk: boolean } {
  const secret = process.env.JWT_SECRET?.trim() ?? "";
  const present = secret.length > 0;
  let testOk = false;
  if (present) {
    try {
      const token = jwt.sign(
        { id: 1, email: OFFICIAL_ADMIN.email, role: "super_admin" },
        secret,
        { algorithm: JWT_ALGORITHM, expiresIn: "8h" }
      );
      jwt.verify(token, secret, { algorithms: [JWT_ALGORITHM] });
      testOk = true;
    } catch {
      testOk = false;
    }
  }
  return { present, length: secret.length, testOk };
}

/** Diagnostic complet + réparation auto de l'admin officiel. */
export async function runAdminAuthDiagnostic(
  applyRepair = true
): Promise<AuthDiagnosticReport> {
  const issues: string[] = [];
  const dbInfo = parseDatabaseInfo(process.env.DATABASE_URL);
  const databaseUrlMasked = maskDatabaseUrl(process.env.DATABASE_URL);

  let databaseConnected = false;
  let adminsTableExists = false;
  let adminCount = 0;
  let officialAdminExists = false;
  let officialAdminId: number | null = null;
  let officialAdminIsActive: boolean | null = null;
  let officialAdminRole: string | null = null;
  let bcryptOk = false;
  let repairApplied = false;
  let loginSimulationOk = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseConnected = true;
  } catch {
    issues.push("Base de données inaccessible");
  }

  if (databaseConnected) {
    try {
      const tableRows = await prisma.$queryRaw<Array<{ table_count: bigint }>>`
        SELECT COUNT(*) AS table_count
        FROM information_schema.tables
        WHERE table_schema = ${dbInfo.schema}
          AND table_name = 'admins'
      `;
      adminsTableExists = Number(tableRows[0]?.table_count ?? 0) > 0;
      if (!adminsTableExists) {
        issues.push("Table admins absente");
      }
    } catch {
      issues.push("Impossible de vérifier la table admins");
    }

    if (adminsTableExists) {
      adminCount = await prisma.admin.count();
      const official = await prisma.admin.findUnique({
        where: { email: normalizeAdminEmail(OFFICIAL_ADMIN.email) },
      });
      officialAdminExists = Boolean(official);
      if (official) {
        officialAdminId = official.id;
        officialAdminIsActive = official.isActive;
        officialAdminRole = official.role;
        bcryptOk = await bcrypt.compare(OFFICIAL_ADMIN.password, official.password);
        if (!bcryptOk) {
          issues.push("bcrypt compare = false");
        }
        if (!official.isActive) {
          issues.push("Compte admin officiel désactivé");
        }
      } else {
        issues.push("Admin absent");
      }
    }
  }

  const jwt = checkJwtConfig();
  if (!jwt.present) {
    issues.push("JWT_SECRET absent");
  } else if (!jwt.testOk) {
    issues.push("JWT test échoué");
  }

  if (applyRepair && databaseConnected && adminsTableExists) {
    const repair = await repairOfficialAdmin();
    repairApplied = true;
    bcryptOk = repair.bcryptOk;
    officialAdminExists = true;
    officialAdminId = repair.adminId;
    officialAdminIsActive = true;
    officialAdminRole = "super_admin";
    loginSimulationOk = repair.bcryptOk && jwt.testOk;

    if (!repair.bcryptOk) {
      issues.push("Réparation bcrypt échouée");
    }
  } else {
    loginSimulationOk = bcryptOk && jwt.testOk && officialAdminExists;
  }

  const report: AuthDiagnosticReport = {
    databaseConnected,
    databaseHost: dbInfo.host,
    databaseName: dbInfo.database,
    databaseSchema: dbInfo.schema,
    databaseUrlMasked,
    adminsTableExists,
    adminCount,
    officialAdminExists,
    officialAdminId,
    officialAdminIsActive,
    officialAdminRole,
    bcryptOk,
    jwtSecretPresent: jwt.present,
    jwtSecretLength: jwt.length,
    jwtTestOk: jwt.testOk,
    loginSimulationOk,
    repairApplied,
    issues: [...new Set(issues)],
  };

  printDiagnosticReport(report);
  return report;
}

export function printDiagnosticReport(report: AuthDiagnosticReport): void {
  console.log("\n========== RAPPORT AUTH ADMIN ==========");
  console.log(
    report.databaseConnected ? "✓ Base connectée" : "❌ Base inaccessible"
  );
  console.log("  Hôte PostgreSQL:", report.databaseHost ?? "(inconnu)");
  console.log("  Nom de la base:", report.databaseName ?? "(inconnu)");
  console.log("  Schéma:", report.databaseSchema);
  console.log("  DATABASE_URL:", report.databaseUrlMasked);
  console.log(
    report.adminsTableExists ? "✓ Table admins trouvée" : "❌ Table admins absente"
  );
  console.log("  Nombre d'admins:", report.adminCount);
  console.log(
    report.officialAdminExists ? "✓ Admin trouvé" : "❌ Admin absent"
  );
  if (report.officialAdminId) {
    console.log("  ID admin:", report.officialAdminId);
    console.log("  isActive:", report.officialAdminIsActive);
    console.log("  role:", report.officialAdminRole);
  }
  console.log(report.bcryptOk ? "✓ bcrypt OK" : "❌ bcrypt compare = false");
  console.log(
    report.jwtSecretPresent ? "✓ JWT_SECRET présent" : "❌ JWT_SECRET absent"
  );
  console.log("  JWT_SECRET longueur:", report.jwtSecretLength);
  console.log(report.jwtTestOk ? "✓ JWT OK" : "❌ JWT test échoué");
  console.log(
    report.loginSimulationOk ? "✓ Login OK (simulation)" : "❌ Login simulation échouée"
  );
  if (report.repairApplied) {
    console.log("  → Réparation admin officiel appliquée");
  }
  if (report.issues.length > 0) {
    console.log("  Problèmes:", report.issues.join(" | "));
  }
  console.log("========================================\n");
}
