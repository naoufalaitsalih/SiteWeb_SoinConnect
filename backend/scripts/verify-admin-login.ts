/**
 * Vérifie l'authentification admin de bout en bout.
 * Usage : npm run verify:admin
 *         API_BASE_URL=https://soinsconnect-api.onrender.com npm run verify:admin
 */
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import {
  OFFICIAL_ADMIN,
  normalizeAdminEmail,
} from "../src/config/officialAdmin";
import { authenticateAdmin } from "../src/services/adminAuthService";

const prisma = new PrismaClient();
const API_BASE = (
  process.env.API_BASE_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");

async function verifyDatabase() {
  console.log("\n=== 1. Base de données ===");
  const email = normalizeAdminEmail(OFFICIAL_ADMIN.email);
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin) {
    console.log("❌ Admin introuvable en base");
    return false;
  }

  const hashValid = /^\$2[aby]?\$\d{2}\$/.test(admin.password);
  const passwordOk = await bcrypt.compare(
    OFFICIAL_ADMIN.password,
    admin.password
  );

  console.log("✅ Admin trouvé:", {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
    hashValid,
    bcryptCompare: passwordOk,
  });

  return admin.isActive && hashValid && passwordOk;
}

async function verifyService() {
  console.log("\n=== 2. Service authenticateAdmin ===");
  const ok = await authenticateAdmin({
    email: OFFICIAL_ADMIN.email,
    password: OFFICIAL_ADMIN.password,
  });

  if (!ok.success) {
    console.log("❌ Échec service:", ok);
    return false;
  }

  console.log("✅ JWT généré, longueur:", ok.token.length);
  console.log("✅ Admin:", ok.admin);
  return true;
}

async function verifyHttp() {
  console.log("\n=== 3. HTTP POST /api/admin/auth/login ===", API_BASE);
  try {
    const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: OFFICIAL_ADMIN.email,
        password: OFFICIAL_ADMIN.password,
      }),
    });

    const data = (await res.json()) as Record<string, unknown>;
    console.log("Status:", res.status, data);

    if (!res.ok) return false;
    return data.success === true && typeof data.token === "string";
  } catch (error) {
    console.log("❌ HTTP injoignable:", error);
    return false;
  }
}

async function main() {
  console.log("Vérification admin:", OFFICIAL_ADMIN.email);

  const dbOk = await verifyDatabase();
  const serviceOk = dbOk ? await verifyService() : false;
  const httpOk = await verifyHttp();

  console.log("\n=== Résumé ===");
  console.log("DB:", dbOk ? "OK" : "FAIL");
  console.log("Service:", serviceOk ? "OK" : "FAIL");
  console.log("HTTP:", httpOk ? "OK" : "FAIL");

  process.exit(dbOk && serviceOk && httpOk ? 0 : 1);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
