import { CreateCareRequestInput } from "../validators/requestValidator";
import { prisma } from "../prisma/client";

export async function createCareRequest(data: CreateCareRequestInput) {
  return prisma.careRequest.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email ?? null,
      address: data.address,
      careType: data.careType,
      description: data.description ?? null,
      requestedDate: new Date(data.requestedDate),
      requestedTime: data.requestedTime,
      isUrgent: data.isUrgent,
      status: "pending",
    },
  });
}

export async function getAllCareRequests() {
  return prisma.careRequest.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      address: true,
      careType: true,
      description: true,
      requestedDate: true,
      requestedTime: true,
      isUrgent: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
