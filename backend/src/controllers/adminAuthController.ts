import { Request, Response } from "express";
import type { AdminRequest } from "../middleware/adminAuthMiddleware";
import { adminLoginSchema } from "../validators/adminAuthValidator";
import { authenticateAdmin } from "../services/adminAuthService";
import { createAuditLog } from "../services/auditService";
import { getClientIp } from "../utils/clientIp";

function mapLoginError(error: unknown): { status: number; message: string } {
  if (error instanceof Error) {
    if (error.message.includes("JWT_SECRET")) {
      return { status: 503, message: error.message };
    }
    if (error.message.includes("Table admins absente")) {
      return { status: 503, message: error.message };
    }
  }

  const prismaCode =
    error && typeof error === "object" && "code" in error
      ? (error as { code: string }).code
      : null;

  switch (prismaCode) {
    case "P1000":
    case "P1001":
    case "P1003":
      return {
        status: 503,
        message:
          "Base de données inaccessible. Vérifiez DATABASE_URL dans backend/.env",
      };
    case "P2021":
      return {
        status: 503,
        message:
          "Table admins absente. Exécutez: npx prisma migrate deploy && npx prisma db seed",
      };
    case "P2022":
      return {
        status: 503,
        message: "Schéma base de données incomplet. Exécutez: npx prisma migrate deploy",
      };
    default:
      return {
        status: 503,
        message:
          process.env.NODE_ENV === "production"
            ? "Service temporairement indisponible"
            : "Erreur serveur lors de la connexion admin",
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
    console.log("[admin/auth/login] tentative", {
      email: parsed.data.email.trim().toLowerCase(),
    });

    const result = await authenticateAdmin(parsed.data);

    if (!result.success) {
      console.warn("[admin/auth/login] refusé", {
        email: parsed.data.email.trim().toLowerCase(),
        reason: "reason" in result ? result.reason : "unknown",
        status: result.status,
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
