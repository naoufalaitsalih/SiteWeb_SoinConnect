import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import {
  OFFICIAL_ADMIN,
  normalizeAdminEmail,
} from "../config/officialAdmin";
import {
  repairOfficialAdmin,
  runAdminAuthDiagnostic,
} from "../services/officialAdminRepair";

function isDebugAuthorized(req: Request): boolean {
  const secret = process.env.DEBUG_SECRET?.trim();
  if (!secret) return false;
  const provided = typeof req.query.secret === "string" ? req.query.secret : "";
  return provided === secret;
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

  try {
    const report = await runAdminAuthDiagnostic(true);
    const email = normalizeAdminEmail(OFFICIAL_ADMIN.email);
    const admin = await prisma.admin.findUnique({ where: { email } });
    const bcryptTestWithAdmin2026 = admin
      ? await bcrypt.compare(OFFICIAL_ADMIN.password, admin.password)
      : false;

    return res.json({
      success: true,
      adminExists: Boolean(admin),
      email: admin?.email ?? email,
      isActive: admin?.isActive ?? false,
      role: admin?.role ?? null,
      passwordHashPrefix: admin?.password.slice(0, 4) ?? null,
      bcryptTestWithAdmin2026,
      report: {
        databaseHost: report.databaseHost,
        databaseName: report.databaseName,
        databaseSchema: report.databaseSchema,
        adminCount: report.adminCount,
        loginSimulationOk: report.loginSimulationOk,
        issues: report.issues,
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

export async function postRepairAdmin(req: Request, res: Response) {
  if (!isDebugAuthorized(req)) {
    return res.status(404).json({
      success: false,
      message: "Route non trouvée",
    });
  }

  try {
    const repair = await repairOfficialAdmin();
    return res.json({ success: true, repair });
  } catch (error) {
    console.error("[debug/repair-admin]", error);
    return res.status(503).json({ success: false, message: "Réparation échouée" });
  }
}
