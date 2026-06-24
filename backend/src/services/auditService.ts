import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";

export const AUDIT_ACTIONS = [
  "login_success",
  "login_failed",
  "logout",
  "password_change",
  "account_create",
  "data_create",
  "data_update",
  "data_delete",
  "logs_clear",
  "access_denied",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export type AuditLogInput = {
  action: AuditAction;
  userId?: number | null;
  userEmail?: string | null;
  userRole?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  resource?: string | null;
  resourceId?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function createAuditLog(input: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        userId: input.userId ?? null,
        userEmail: input.userEmail ?? null,
        userRole: input.userRole ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        resource: input.resource ?? null,
        resourceId: input.resourceId ?? null,
        metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error("[audit] Échec enregistrement:", error);
  }
}

export async function listAuditLogs(query: {
  startDate?: string;
  endDate?: string;
  action?: string;
  page: number;
  limit: number;
}) {
  const where: {
    createdAt?: { gte?: Date; lte?: Date };
    action?: string;
  } = {};

  if (query.startDate) {
    where.createdAt = { ...where.createdAt, gte: new Date(`${query.startDate}T00:00:00.000Z`) };
  }
  if (query.endDate) {
    where.createdAt = {
      ...where.createdAt,
      lte: new Date(`${query.endDate}T23:59:59.999Z`),
    };
  }
  if (query.action) {
    where.action = query.action;
  }

  const skip = (query.page - 1) * query.limit;

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { data, total, page: query.page, limit: query.limit };
}
