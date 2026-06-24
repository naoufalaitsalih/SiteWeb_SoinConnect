import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Identifiant admin officiel unique SoinsConnect */
const OFFICIAL_ADMIN = {
  email: "admin@soinsconnect.ma",
  password: "Admin@2026",
  firstName: "Admin",
  lastName: "SoinsConnect",
  role: "super_admin",
} as const;

async function main() {
  const plainPassword =
    process.env.SEED_ADMIN_PASSWORD?.trim() || OFFICIAL_ADMIN.password;
  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email: OFFICIAL_ADMIN.email },
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
      email: OFFICIAL_ADMIN.email,
      password: hashedPassword,
      role: OFFICIAL_ADMIN.role,
      isActive: true,
    },
  });

  console.log(
    `Admin officiel OK: ${admin.email} (id=${admin.id}, role=${admin.role}, actif=${admin.isActive})`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
