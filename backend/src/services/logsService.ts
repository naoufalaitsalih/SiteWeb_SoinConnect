import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";
import type { CreatePublicEventLogInput } from "../validators/logsValidator";

type CreateEventOptions = CreatePublicEventLogInput & {
  ipAddress?: string;
  country?: string;
  city?: string;
};

type DateFilter = {
  startDate?: string;
  endDate?: string;
};

function buildDateWhere({ startDate, endDate }: DateFilter): Prisma.EventLogWhereInput {
  if (!startDate && !endDate) return {};

  const createdAt: Prisma.DateTimeFilter = {};

  if (startDate) {
    createdAt.gte = new Date(`${startDate}T00:00:00.000Z`);
  }

  if (endDate) {
    createdAt.lte = new Date(`${endDate}T23:59:59.999Z`);
  }

  return { createdAt };
}

export async function createEventLog(input: CreateEventOptions) {
  return prisma.eventLog.create({
    data: {
      eventType: input.eventType,
      pageUrl: input.pageUrl,
      elementName: input.elementName,
      userRole: input.userRole,
      sessionId: input.sessionId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      browser: input.browser,
      os: input.os,
      deviceType: input.deviceType,
      referrer: input.referrer,
      locale: input.locale,
      country: input.country,
      city: input.city,
      timezone: input.timezone,
      metadata:
        input.metadata === undefined
          ? undefined
          : (input.metadata as Prisma.InputJsonValue),
    },
  });
}

export async function listEventLogs(options: DateFilter & { page?: number; limit?: number }) {
  const page = options.page ?? 1;
  const limit = options.limit ?? 50;
  const skip = (page - 1) * limit;
  const where = buildDateWhere(options);

  const [data, total] = await Promise.all([
    prisma.eventLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.eventLog.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function deleteEventLogsByIds(ids: number[]) {
  const result = await prisma.eventLog.deleteMany({
    where: { id: { in: ids } },
  });

  return result.count;
}

export async function clearEventLogs(filters: DateFilter) {
  const where = buildDateWhere(filters);
  const result = await prisma.eventLog.deleteMany({ where });
  return result.count;
}
