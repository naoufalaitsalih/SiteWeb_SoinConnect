import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../prisma/client";
import type { AdminLoginInput } from "../validators/adminAuthValidator";
import { normalizeAdminEmail } from "../config/officialAdmin";

export type AdminTokenPayload = {
  id: number;
  email: string;
  role: string;
};

export type AdminAuthFailureReason =
  | "admin_not_found"
  | "admin_inactive"
  | "password_mismatch"
  | "invalid_bcrypt_hash";

const JWT_ALGORITHM = "HS256" as const;

/** Logs temporaires diagnostic auth (ne jamais logger le mot de passe) */
function authLog(message: string, details?: Record<string, unknown>) {
  console.log("[auth/login]", message, details ?? "");
}

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

function isValidBcryptHash(hash: string): boolean {
  return /^\$2[aby]?\$\d{2}\$/.test(hash);
}

async function findAdminByEmail(email: string) {
  return prisma.admin.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });
}

export async function authenticateAdmin(input: AdminLoginInput) {
  const email = normalizeAdminEmail(input.email);
  authLog("email reçu", { email });

  const admin = await findAdminByEmail(email);

  if (!admin) {
    authLog("admin trouvé", { found: false });
    return {
      success: false as const,
      status: 401,
      message: "Identifiants invalides",
      reason: "admin_not_found" as const,
    };
  }

  authLog("admin trouvé", {
    found: true,
    id: admin.id,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
  });

  if (!admin.isActive) {
    authLog("échec", { reason: "admin_inactive", id: admin.id, isActive: false });
    return {
      success: false as const,
      status: 401,
      message: "Identifiants invalides",
      reason: "admin_inactive" as const,
    };
  }

  if (!isValidBcryptHash(admin.password)) {
    authLog("échec", {
      reason: "invalid_bcrypt_hash",
      id: admin.id,
      hashPrefix: admin.password.slice(0, 7),
    });
    return {
      success: false as const,
      status: 401,
      message: "Identifiants invalides",
      reason: "invalid_bcrypt_hash" as const,
    };
  }

  const passwordMatch = await bcrypt.compare(input.password, admin.password);
  authLog("bcrypt match", { result: passwordMatch, id: admin.id });

  if (!passwordMatch) {
    authLog("échec", { reason: "password_mismatch", id: admin.id });
    return {
      success: false as const,
      status: 401,
      message: "Identifiants invalides",
      reason: "password_mismatch" as const,
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
  authLog("JWT généré", {
    id: admin.id,
    role: admin.role,
    tokenLength: token.length,
  });

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
