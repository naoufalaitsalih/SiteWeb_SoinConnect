import { Response } from "express";
import type { AdminRequest } from "../middleware/adminAuthMiddleware";
import { updateAdminNotesSchema } from "../validators/adminRequestsValidator";
import {
  getCareRequestAdminNotes,
  updateCareRequestAdminNotes,
} from "../services/adminRequestsService";

export async function getAdminRequestNotes(req: AdminRequest, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Identifiant de demande invalide",
    });
  }

  try {
    const request = await getCareRequestAdminNotes(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Demande introuvable",
      });
    }

    return res.json({
      success: true,
      data: {
        id: request.id,
        adminNotes: request.adminNotes,
        updatedAt: request.updatedAt,
      },
    });
  } catch (error) {
    console.error("[admin/requests/notes GET]", error);
    return res.status(503).json({
      success: false,
      message: "Impossible de charger les notes administrateur",
    });
  }
}

export async function patchAdminRequestNotes(req: AdminRequest, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Identifiant de demande invalide",
    });
  }

  const parsed = updateAdminNotesSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const request = await updateCareRequestAdminNotes(
      id,
      parsed.data.adminNotes
    );

    return res.json({
      success: true,
      data: {
        id: request.id,
        adminNotes: request.adminNotes,
        updatedAt: request.updatedAt,
      },
    });
  } catch (error) {
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

    console.error("[admin/requests/notes PATCH]", error);
    return res.status(503).json({
      success: false,
      message: "Impossible d'enregistrer les notes administrateur",
    });
  }
}
