import { Response } from "express";
import type { AdminRequest } from "../middleware/adminAuthMiddleware";
import {
  deleteAdminDemande,
  listAdminDemandes,
  updateAdminDemandeNotes,
  updateAdminDemandeStatus,
} from "../services/adminDemandesService";
import {
  updateAdminDemandeNotesSchema,
  updateAdminDemandeStatusSchema,
} from "../validators/adminDemandesValidator";
import { createAuditLog } from "../services/auditService";
import { getClientIp } from "../utils/clientIp";

function parseId(raw: string) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

function auditContext(req: AdminRequest) {
  return {
    userId: req.admin?.id,
    userEmail: req.admin?.email,
    userRole: req.admin?.role,
    ipAddress: getClientIp(req),
    userAgent:
      typeof req.headers["user-agent"] === "string"
        ? req.headers["user-agent"]
        : undefined,
  };
}

function handlePrismaError(error: unknown, res: Response, context: string) {
  const prismaCode =
    error && typeof error === "object" && "code" in error
      ? (error as { code: string }).code
      : null;

  if (prismaCode === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Demande introuvable",
    });
  }

  if (prismaCode === "P2022") {
    console.error(context, error);
    return res.status(503).json({
      success: false,
      message:
        "Erreur de chargement des demandes : colonne admin_notes manquante en base",
    });
  }

  console.error(context, error);
  return res.status(503).json({
    success: false,
    message: "Erreur de chargement des demandes",
  });
}

export async function getAdminDemandes(_req: AdminRequest, res: Response) {
  try {
    const data = await listAdminDemandes();
    return res.json({ success: true, data, count: data.length });
  } catch (error) {
    const prismaCode =
      error && typeof error === "object" && "code" in error
        ? (error as { code: string }).code
        : null;

    if (prismaCode === "P2022") {
      console.error("[admin/demandes GET]", error);
      return res.status(503).json({
        success: false,
        message:
          "Erreur de chargement des demandes : colonne admin_notes manquante en base",
      });
    }

    console.error("[admin/demandes GET]", error);
    return res.status(503).json({
      success: false,
      message: "Erreur de chargement des demandes",
    });
  }
}

export async function patchAdminDemandeStatus(req: AdminRequest, res: Response) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Identifiant de demande invalide",
    });
  }

  const parsed = updateAdminDemandeStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const data = await updateAdminDemandeStatus(id, parsed.data.status);

    await createAuditLog({
      ...auditContext(req),
      action: "data_update",
      resource: "care_request",
      resourceId: String(id),
      metadata: { field: "status", newStatus: parsed.data.status },
    });

    return res.json({ success: true, data });
  } catch (error) {
    return handlePrismaError(error, res, "[admin/demandes/status PATCH]");
  }
}

export async function patchAdminDemandeNotes(req: AdminRequest, res: Response) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Identifiant de demande invalide",
    });
  }

  const parsed = updateAdminDemandeNotesSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const adminNotes = parsed.data.admin_notes.trim() || null;

  try {
    const data = await updateAdminDemandeNotes(id, adminNotes);

    await createAuditLog({
      ...auditContext(req),
      action: "data_update",
      resource: "care_request",
      resourceId: String(id),
      metadata: { field: "admin_notes" },
    });

    return res.json({ success: true, data });
  } catch (error) {
    return handlePrismaError(error, res, "[admin/demandes/notes PATCH]");
  }
}

export async function deleteAdminDemandeHandler(
  req: AdminRequest,
  res: Response
) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Identifiant de demande invalide",
    });
  }

  try {
    await deleteAdminDemande(id);

    await createAuditLog({
      ...auditContext(req),
      action: "data_delete",
      resource: "care_request",
      resourceId: String(id),
    });

    return res.json({ success: true, message: "Demande supprimée" });
  } catch (error) {
    return handlePrismaError(error, res, "[admin/demandes DELETE]");
  }
}
