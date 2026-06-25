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
    `Seed admins OK: ${admin.email} (id=${admin.id}, role=${admin.role}, isActive=${admin.isActive}, bcrypt=${passwordOk})`
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
