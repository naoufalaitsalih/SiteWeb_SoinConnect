import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import {
  OFFICIAL_ADMIN,
  normalizeAdminEmail,
} from "../src/config/officialAdmin";

const prisma = new PrismaClient();

async function main() {
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
    `[seed] Admin upsert: ${admin.email} (id=${admin.id}, role=${admin.role}, isActive=${admin.isActive}, bcryptOk=${passwordOk})`
  );
}

main()
  .catch((error) => {
    console.error("[seed] Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
