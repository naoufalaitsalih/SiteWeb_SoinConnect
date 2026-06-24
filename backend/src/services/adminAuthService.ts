import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../prisma/client";
import type { AdminLoginInput } from "../validators/adminAuthValidator";

export type AdminTokenPayload = {
  id: number;
  email: string;
  role: string;
};

const JWT_ALGORITHM = "HS256" as const;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET manquant dans backend/.env");
  }
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error("JWT_SECRET doit contenir au moins 32 caractères en production");
  }
  return secret;
}

function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN?.trim() || "8h";
}

export async function authenticateAdmin(input: AdminLoginInput) {
  const admin = await prisma.admin.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!admin || !admin.isActive) {
    return {
      success: false as const,
      status: 401,
      message: "Identifiants invalides",
    };
  }

  const passwordMatch = await bcrypt.compare(input.password, admin.password);

  if (!passwordMatch) {
    return {
      success: false as const,
      status: 401,
      message: "Identifiants invalides",
    };
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  });

  const payload: AdminTokenPayload = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };

  const signOptions: SignOptions = {
    expiresIn: getJwtExpiresIn() as SignOptions["expiresIn"],
    algorithm: JWT_ALGORITHM,
  };

  const token = jwt.sign(payload, getJwtSecret(), signOptions);

  return {
    success: true as const,
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      firstName: admin.firstName,
      lastName: admin.lastName,
    },
  };
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret(), {
      algorithms: [JWT_ALGORITHM],
    }) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export async function isAdminActive(adminId: number): Promise<boolean> {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { isActive: true },
  });
  return Boolean(admin?.isActive);
}
