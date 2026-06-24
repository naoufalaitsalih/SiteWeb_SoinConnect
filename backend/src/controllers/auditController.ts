import { Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { AdminRequest } from "../middleware/adminAuthMiddleware";
import { listAuditLogsQuerySchema } from "../validators/auditValidator";
import { listAuditLogs } from "../services/auditService";

function formatZodErrors(error: ZodError) {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
}

export async function getAdminAuditLogs(
  _req: AdminRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query = listAuditLogsQuerySchema.parse(_req.query);
    const result = await listAuditLogs(query);

    res.status(200).json({
      success: true,
      data: result.data,
      count: result.data.length,
      total: result.total,
      page: result.page,
      limit: result.limit,
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
