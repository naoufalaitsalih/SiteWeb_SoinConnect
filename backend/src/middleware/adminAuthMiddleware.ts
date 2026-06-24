import { Response, NextFunction } from "express";
import {
  verifyAdminToken,
  isAdminActive,
  type AdminTokenPayload,
} from "../services/adminAuthService";
import type { Request } from "express";

export type AdminRequest = Request & { admin?: AdminTokenPayload };

export async function requireAdminAuth(
  req: AdminRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentification administrateur requise",
    });
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      message: "Session administrateur invalide ou expirée",
    });
  }

  const active = await isAdminActive(payload.id);
  if (!active) {
    return res.status(403).json({
      success: false,
      message: "Compte administrateur désactivé",
    });
  }

  req.admin = payload;
  return next();
}
