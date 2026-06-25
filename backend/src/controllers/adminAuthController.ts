import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import type { AdminRequest } from "../middleware/adminAuthMiddleware";
import { adminLoginSchema } from "../validators/adminAuthValidator";
import { authenticateAdmin } from "../services/adminAuthService";
import { createAuditLog } from "../services/auditService";
import { getClientIp } from "../utils/clientIp";

function mapLoginError(error: unknown): { status: number; message: string } {
  if (error instanceof Error && error.message.includes("JWT_SECRET")) {
    return { status: 500, message: "JWT_SECRET_MISSING" };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return { status: 500, message: "DATABASE_CONNECTION_ERROR" };
  }

  const prismaCode =
    error && typeof error === "object" && "code" in error
      ? (error as { code: string }).code
      : null;

  switch (prismaCode) {
    case "P1000":
    case "P1001":
    case "P1003":
    case "P1017":
      return { status: 500, message: "DATABASE_CONNECTION_ERROR" };
    case "P2021":
      return {
        status: 500,
        message: "DATABASE_CONNECTION_ERROR",
      };
    case "P2022":
      return {
        status: 500,
        message: "DATABASE_CONNECTION_ERROR",
      };
    default:
      return {
        status: 500,
        message: "DATABASE_CONNECTION_ERROR",
      };
  }
}

export async function postAdminLogin(req: Request, res: Response) {
  const parsed = adminLoginSchema.safeParse(req.body);
  const ipAddress = getClientIp(req);
  const userAgent =
    typeof req.headers["user-agent"] === "string"
      ? req.headers["user-agent"]
      : undefined;

  if (!parsed.success) {
    console.warn("[admin/auth/login] validation échouée", {
      fields: Object.keys(parsed.error.flatten().fieldErrors),
    });
    return res.status(400).json({
      success: false,
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const result = await authenticateAdmin(parsed.data);

    if (!result.success) {
      console.warn("[admin/auth/login] refusé", {
        email: parsed.data.email.trim().toLowerCase(),
        status: result.status,
        message: result.message,
        reason: result.reason,
      });

      await createAuditLog({
        action: "login_failed",
        userEmail: parsed.data.email.toLowerCase(),
        userRole: "admin",
        ipAddress,
        userAgent,
        resource: "admin_auth",
      });

      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    await createAuditLog({
      action: "login_success",
      userId: result.admin.id,
      userEmail: result.admin.email,
      userRole: result.admin.role,
      ipAddress,
      userAgent,
      resource: "admin_auth",
    });

    console.log("[admin/auth/login] succès", {
      id: result.admin.id,
      email: result.admin.email,
      role: result.admin.role,
    });

    return res.json({
      success: true,
      token: result.token,
      admin: result.admin,
    });
  } catch (error) {
    console.error("[admin/auth/login]", error);
    const { status, message } = mapLoginError(error);
    return res.status(status).json({ success: false, message });
  }
}

export async function postAdminLogout(req: AdminRequest, res: Response) {
  const ipAddress = getClientIp(req);
  const userAgent =
    typeof req.headers["user-agent"] === "string"
      ? req.headers["user-agent"]
      : undefined;

  await createAuditLog({
    action: "logout",
    userId: req.admin?.id,
    userEmail: req.admin?.email,
    userRole: req.admin?.role,
    ipAddress,
    userAgent,
    resource: "admin_auth",
  });

  return res.json({ success: true });
}
