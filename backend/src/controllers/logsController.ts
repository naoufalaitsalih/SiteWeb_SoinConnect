import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { AdminRequest } from "../middleware/adminAuthMiddleware";
import { createPublicEventLogSchema, listEventLogsQuerySchema, deleteEventLogsSchema, clearEventLogsSchema } from "../validators/logsValidator";
import { createEventLog, listEventLogs, deleteEventLogsByIds, clearEventLogs } from "../services/logsService";
import { createAuditLog } from "../services/auditService";
import { getClientIp } from "../utils/clientIp";
import { getGeoFromIp } from "../utils/geoFromIp";

function formatZodErrors(error: ZodError) {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
}

export async function postEventLog(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = createPublicEventLogSchema.parse(req.body);
    const ipAddress = getClientIp(req);
    const geo = getGeoFromIp(ipAddress);

    await createEventLog({
      ...parsed,
      ipAddress,
      country: geo.country,
      city: geo.city,
    });

    res.status(201).json({
      success: true,
      message: "Événement enregistré",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: formatZodErrors(error),
      });
      return;
    }
    next(error);
  }
}

export async function getAdminEventLogs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = listEventLogsQuerySchema.parse(req.query);
    const result = await listEventLogs(query);

    res.status(200).json({
      success: true,
      message: "Journaux récupérés",
      data: {
        items: result.data,
        count: result.data.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Paramètres invalides",
        errors: formatZodErrors(error),
      });
      return;
    }
    next(error);
  }
}

export async function deleteAdminEventLogs(
  req: AdminRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { ids } = deleteEventLogsSchema.parse(req.body);
    const count = await deleteEventLogsByIds(ids);

    await createAuditLog({
      action: "data_delete",
      userId: req.admin?.id,
      userEmail: req.admin?.email,
      userRole: req.admin?.role,
      ipAddress: getClientIp(req),
      userAgent:
        typeof req.headers["user-agent"] === "string"
          ? req.headers["user-agent"]
          : undefined,
      resource: "event_logs",
      metadata: { count, ids: ids.slice(0, 10) },
    });

    res.status(200).json({
      success: true,
      message: `${count} journal(aux) supprimé(s)`,
      data: { count },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: formatZodErrors(error),
      });
      return;
    }
    next(error);
  }
}

export async function clearAdminEventLogs(
  req: AdminRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = clearEventLogsSchema.parse(req.body ?? {});
    const count = await clearEventLogs(filters);

    await createAuditLog({
      action: "logs_clear",
      userId: req.admin?.id,
      userEmail: req.admin?.email,
      userRole: req.admin?.role,
      ipAddress: getClientIp(req),
      userAgent:
        typeof req.headers["user-agent"] === "string"
          ? req.headers["user-agent"]
          : undefined,
      resource: "event_logs",
      metadata: { count, ...filters },
    });

    res.status(200).json({
      success: true,
      message: `${count} journal(aux) supprimé(s)`,
      data: { count },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: formatZodErrors(error),
      });
      return;
    }
    next(error);
  }
}
