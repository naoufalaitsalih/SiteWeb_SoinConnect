/**
 * Diagnostic auth admin (local ou Render via API_BASE_URL).
 * Usage : npm run diagnose:admin
 */
import { runAdminAuthDiagnostic } from "../src/services/officialAdminRepair";
import { authenticateAdmin } from "../src/services/adminAuthService";
import { OFFICIAL_ADMIN } from "../src/config/officialAdmin";

const API_BASE = (
  process.env.API_BASE_URL ?? "https://soinsconnect-api.onrender.com"
).replace(/\/+$/, "");

async function testHttpLogin(): Promise<boolean> {
  console.log("\n--- Test HTTP Render ---");
  console.log("POST", `${API_BASE}/api/admin/auth/login`);
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
    return res.ok && data.success === true;
  } catch (error) {
    console.error("HTTP injoignable:", error);
    return false;
  }
}

async function main() {
  console.log("=== Diagnostic admin (DATABASE_URL locale) ===\n");

  let localOk = false;
  try {
    const report = await runAdminAuthDiagnostic(true);
    const login = await authenticateAdmin({
      email: OFFICIAL_ADMIN.email,
      password: OFFICIAL_ADMIN.password,
    });
    localOk = report.loginSimulationOk && login.success;
    console.log("Login local service:", login.success ? "OK" : "FAIL");
  } catch (error) {
    console.error("Diagnostic local impossible (DATABASE_URL PostgreSQL requis):", error);
  }

  const httpOk = await testHttpLogin();

  console.log("\n=== RÉSUMÉ ===");
  console.log("Local DB + service:", localOk ? "✓" : "❌ (ou MySQL en .env)");
  console.log("Render HTTP:", httpOk ? "✓ Login OK" : "❌");

  process.exit(httpOk ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
