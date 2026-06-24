import { prisma } from "../prisma/client";

export async function getCareRequestAdminNotes(id: number) {
  return prisma.careRequest.findUnique({
    where: { id },
    select: {
      id: true,
      adminNotes: true,
      updatedAt: true,
    },
  });
}

export async function updateCareRequestAdminNotes(
  id: number,
  adminNotes: string | null
) {
  return prisma.careRequest.update({
    where: { id },
    data: { adminNotes },
    select: {
      id: true,
      adminNotes: true,
      updatedAt: true,
    },
  });
}
