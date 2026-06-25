import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../prisma/client";
import type { AdminLoginInput } from "../validators/adminAuthValidator";
import { OFFICIAL_ADMIN, normalizeAdminEmail } from "../config/officialAdmin";
import { maskDatabaseUrl, parseDatabaseInfo } from "../utils/maskDatabaseUrl";
import { repairOfficialAdmin } from "./officialAdminRepair";

export type AdminTokenPayload = {
  id: number;
  email: string;
  role: string;
};

export type AdminAuthFailureReason =
  | "admin_not_found"
  | "admin_inactive"
  | "password_mismatch"
  | "invalid_bcrypt_hash"
  | "jwt_error";

const JWT_ALGORITHM = "HS256" as const;
const LOG_PREFIX = "[auth/login]";

function authLog(message: string, details?: Record<string, unknown>) {
  if (details) {
    console.log(LOG_PREFIX, message, details);
  } else {
    console.log(LOG_PREFIX, message);
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET manquant dans backend/.env");
  }
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    console.warn(
      "[auth/login] JWT_SECRET < 32 caractères en production — recommandé d'utiliser une clé plus longue"
    );
  }
  return secret;
}

function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN?.trim() || "8h";
}

async function findAdminByEmail(email: string) {
  const exact = await prisma.admin.findUnique({ where: { email } });
  if (exact) return exact;

  return prisma.admin.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });
}

async function attemptLogin(
  input: AdminLoginInput,
  email: string
): Promise<
  | {
      success: true;
      admin: NonNullable<Awaited<ReturnType<typeof findAdminByEmail>>>;
      passwordMatch: boolean;
      jwtGenerated: boolean;
      token?: string;
    }
  | {
      success: false;
      reason: AdminAuthFailureReason;
      admin: Awaited<ReturnType<typeof findAdminByEmail>>;
      passwordMatch: boolean;
      jwtGenerated: boolean;
    }
> {
  const admin = await findAdminByEmail(email);

  authLog("ADMIN TROUVÉ", { value: admin ? "oui" : "non" });

  if (!admin) {
    authLog("Aucun admin trouvé pour cet email", { email });
    return {
      success: false,
      reason: "admin_not_found",
      admin: null,
      passwordMatch: false,
      jwtGenerated: false,
    };
  }

  authLog("ID", { id: admin.id });
  authLog("ROLE", { role: admin.role });
  authLog("IS ACTIVE", { isActive: admin.isActive });

  if (!admin.isActive) {
    authLog("Compte désactivé", { id: admin.id });
    return {
      success: false,
      reason: "admin_inactive",
      admin,
      passwordMatch: false,
      jwtGenerated: false,
    };
  }

  const passwordMatch = await bcrypt.compare(input.password, admin.password);
  authLog("bcrypt.compare", { result: passwordMatch });

  if (!passwordMatch) {
    authLog("Hash du mot de passe invalide", { id: admin.id });
    return {
      success: false,
      reason: "password_mismatch",
      admin,
      passwordMatch: false,
      jwtGenerated: false,
    };
  }

  try {
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
    authLog("JWT généré", { value: "oui", tokenLength: token.length });
    return { success: true, admin, passwordMatch: true, jwtGenerated: true, token };
  } catch (error) {
    authLog("JWT généré", { value: "non", error: String(error) });
    return {
      success: false,
      reason: "jwt_error",
      admin,
      passwordMatch: true,
      jwtGenerated: false,
    };
  }
}

export async function authenticateAdmin(input: AdminLoginInput) {
  const email = normalizeAdminEmail(input.email);
  const dbInfo = parseDatabaseInfo(process.env.DATABASE_URL);

  authLog("EMAIL REÇU", { email });
  authLog("DATABASE", {
    host: dbInfo.host,
    database: dbInfo.database,
    schema: dbInfo.schema,
    url: maskDatabaseUrl(process.env.DATABASE_URL),
  });

  let result = await attemptLogin(input, email);

  const isOfficialEmail = email === normalizeAdminEmail(OFFICIAL_ADMIN.email);
  if (!result.success && isOfficialEmail) {
    authLog("Réparation auto admin officiel", { reason: result.reason });
    await repairOfficialAdmin();
    result = await attemptLogin(input, email);
  }

  if (!result.success) {
    return {
      success: false as const,
      status: result.reason === "jwt_error" ? 503 : 401,
      message:
        result.reason === "jwt_error"
          ? "Erreur configuration JWT"
          : "Identifiants invalides",
      reason: result.reason,
    };
  }

  await prisma.admin.update({
    where: { id: result.admin.id },
    data: { lastLogin: new Date() },
  });

  authLog("Authentification réussie", {
    id: result.admin.id,
    email: result.admin.email,
    role: result.admin.role,
  });

  return {
    success: true as const,
    token: result.token!,
    admin: {
      id: result.admin.id,
      email: result.admin.email,
      role: result.admin.role,
      firstName: result.admin.firstName,
      lastName: result.admin.lastName,
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
