import bcrypt from "bcrypt";
import { prisma } from "./client";
import { OFFICIAL_ADMIN, normalizeAdminEmail } from "../config/officialAdmin";

/** Réinitialise l'admin officiel au démarrage (équivalent seed). */
export async function ensureOfficialAdmin(): Promise<void> {
  const email = normalizeAdminEmail(OFFICIAL_ADMIN.email);
  const hashedPassword = await bcrypt.hash(OFFICIAL_ADMIN.password, 12);

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

  const passwordOk = await bcrypt.compare(
    OFFICIAL_ADMIN.password,
    admin.password
  );

  console.log(
    `[admin] Réinitialisé: ${admin.email} (id=${admin.id}, role=${admin.role}, isActive=${admin.isActive}, bcryptOk=${passwordOk})`
  );
}
