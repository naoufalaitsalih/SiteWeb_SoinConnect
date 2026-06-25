import bcrypt from "bcrypt";
import { prisma } from "./client";
import { OFFICIAL_ADMIN, normalizeAdminEmail } from "../config/officialAdmin";

/**
 * Garantit que l'admin officiel existe avec le bon hash bcrypt.
 * Corrige les déploiements où le seed n'a pas été exécuté ou où
 * SEED_ADMIN_PASSWORD différait de Admin@2026.
 */
export async function ensureOfficialAdmin(): Promise<void> {
  const email = normalizeAdminEmail(OFFICIAL_ADMIN.email);
  const hashedPassword = await bcrypt.hash(OFFICIAL_ADMIN.password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      firstName: OFFICIAL_ADMIN.firstName,
      lastName: OFFICIAL_ADMIN.lastName,
      password: hashedPassword,
      role: OFFICIAL_ADMIN.role,
      isActive: true,
    },
    create: {
      firstName: OFFICIAL_ADMIN.firstName,
      lastName: OFFICIAL_ADMIN.lastName,
      email,
      password: hashedPassword,
      role: OFFICIAL_ADMIN.role,
      isActive: true,
    },
  });

  const passwordOk = await bcrypt.compare(
    OFFICIAL_ADMIN.password,
    admin.password
  );

  console.log(
    `[admin] Officiel prêt: ${admin.email} (id=${admin.id}, role=${admin.role}, actif=${admin.isActive}, bcrypt=${passwordOk})`
  );
}
