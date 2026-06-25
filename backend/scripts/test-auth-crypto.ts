/**
 * Test local crypto/JWT sans base de données.
 * Usage : npm run test:auth-crypto
 */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OFFICIAL_ADMIN } from "../src/config/officialAdmin";

async function main() {
  console.log("=== Test crypto admin (local, sans DB) ===\n");

  const hash = await bcrypt.hash(OFFICIAL_ADMIN.password, 12);
  const compareOk = await bcrypt.compare(OFFICIAL_ADMIN.password, hash);
  console.log("bcrypt.hash + compare:", compareOk ? "OK" : "FAIL");

  const hashValid = /^\$2[aby]?\$\d{2}\$/.test(hash);
  console.log("format hash bcrypt:", hashValid ? "OK" : "FAIL");

  const secret =
    process.env.JWT_SECRET?.trim() || "soinsconnect_admin_secret_2026";
  const token = jwt.sign(
    {
      id: 1,
      email: OFFICIAL_ADMIN.email,
      role: OFFICIAL_ADMIN.role,
    },
    secret,
    { algorithm: "HS256", expiresIn: "8h" }
  );
  const verified = jwt.verify(token, secret, { algorithms: ["HS256"] });
  console.log("JWT sign + verify:", verified ? "OK" : "FAIL");

  console.log("\nIdentifiants officiels:");
  console.log("  email:", OFFICIAL_ADMIN.email);
  console.log("  role:", OFFICIAL_ADMIN.role);

  const allOk = compareOk && hashValid && Boolean(verified);
  process.exit(allOk ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
