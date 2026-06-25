import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import {
  OFFICIAL_ADMIN,
  normalizeAdminEmail,
} from "../config/officialAdmin";

function isDebugAuthorized(req: Request): boolean {
  const secret = process.env.DEBUG_SECRET?.trim();
  if (!secret) return false;
  const provided = typeof req.query.secret === "string" ? req.query.secret : "";
  return provided === secret;
}

async function getPasswordColumnName(): Promise<string | null> {
  const rows = await prisma.$queryRaw<Array<{ column_name: string }>>`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admins'
      AND column_name = 'password'
    LIMIT 1
  `;
  return rows[0]?.column_name ?? null;
}

/**
 * Route temporaire de diagnostic admin.
 * GET /api/admin/debug/check-admin?secret=DEBUG_SECRET
 */
export async function getCheckAdmin(req: Request, res: Response) {
  if (!isDebugAuthorized(req)) {
    return res.status(404).json({
      success: false,
      message: "Route non trouvée",
    });
  }

  const email = normalizeAdminEmail(OFFICIAL_ADMIN.email);

  try {
    const passwordColumnInDb = await getPasswordColumnName();

    let admin = await prisma.admin.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    const adminExistsBefore = Boolean(admin);
    let created = false;
    let passwordReset = false;

    if (!admin) {
      const hashedPassword = await bcrypt.hash(OFFICIAL_ADMIN.password, 12);
      admin = await prisma.admin.create({
        data: {
          email,
          firstName: OFFICIAL_ADMIN.firstName,
          lastName: OFFICIAL_ADMIN.lastName,
          password: hashedPassword,
          role: "super_admin",
          isActive: true,
        },
      });
      created = true;
    }

    let bcryptTestWithAdmin2026 = await bcrypt.compare(
      OFFICIAL_ADMIN.password,
      admin.password
    );

    if (!bcryptTestWithAdmin2026) {
      const hashedPassword = await bcrypt.hash(OFFICIAL_ADMIN.password, 12);
      admin = await prisma.admin.update({
        where: { id: admin.id },
        data: {
          password: hashedPassword,
          role: "super_admin",
          isActive: true,
        },
      });
      passwordReset = true;
      bcryptTestWithAdmin2026 = await bcrypt.compare(
        OFFICIAL_ADMIN.password,
        admin.password
      );
    }

    console.log("[debug/check-admin]", {
      adminExistsBefore,
      created,
      passwordReset,
      bcryptTestWithAdmin2026,
      email: admin.email,
      isActive: admin.isActive,
      role: admin.role,
      prismaTableMap: "admins",
      passwordColumnInDb,
    });

    return res.json({
      success: true,
      adminExists: Boolean(admin),
      email: admin.email,
      isActive: admin.isActive,
      role: admin.role,
      passwordHashPrefix: admin.password.slice(0, 4),
      bcryptTestWithAdmin2026,
      diagnostics: {
        adminExistsBefore,
        created,
        passwordReset,
        prismaModelMapsToTable: "admins",
        passwordColumnInDb,
      },
    });
  } catch (error) {
    console.error("[debug/check-admin]", error);
    return res.status(503).json({
      success: false,
      message: "Diagnostic admin impossible",
    });
  }
}
