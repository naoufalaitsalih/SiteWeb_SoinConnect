import bcrypt from "bcrypt";
import { prisma } from "./client";
import { OFFICIAL_ADMIN, normalizeAdminEmail } from "../config/officialAdmin";

/**
 * Garantit que l'admin officiel existe dans la table `admins`
 * avec un hash bcrypt valide pour Admin@2026.
 */
export async function ensureOfficialAdmin(): Promise<void> {
  const email = normalizeAdminEmail(OFFICIAL_ADMIN.email);
  const hashedPassword = await bcrypt.hash(OFFICIAL_ADMIN.password, 12);

  const existing = await prisma.admin.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  const admin = existing
    ? await prisma.admin.update({
        where: { id: existing.id },
        data: {
          email,
          firstName: OFFICIAL_ADMIN.firstName,
          lastName: OFFICIAL_ADMIN.lastName,
          password: hashedPassword,
          role: OFFICIAL_ADMIN.role,
          isActive: true,
        },
      })
    : await prisma.admin.create({
        data: {
          email,
          firstName: OFFICIAL_ADMIN.firstName,
          lastName: OFFICIAL_ADMIN.lastName,
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
    `[admin] Table admins — officiel prêt: ${admin.email} (id=${admin.id}, role=${admin.role}, isActive=${admin.isActive}, bcrypt=${passwordOk})`
  );
}
