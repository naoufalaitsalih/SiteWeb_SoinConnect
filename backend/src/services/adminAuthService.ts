import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
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

export type AdminAuthErrorCode =
  | "ADMIN_NOT_FOUND"
  | "ADMIN_DISABLED"
  | "INVALID_PASSWORD"
  | "JWT_SECRET_MISSING"
  | "DATABASE_CONNECTION_ERROR";

export type AdminAuthFailureReason =
  | "admin_not_found"
  | "admin_inactive"
  | "password_mismatch"
  | "jwt_error"
  | "database_error";

const JWT_ALGORITHM = "HS256" as const;
/** Incrémenter à chaque changement auth pour vérifier le déploiement Render */
export const AUTH_DEBUG_VERSION = "admin-auth-debug-v3";

function isDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ["P1000", "P1001", "P1003", "P1017"].includes(error.code);
  }
  return false;
}

function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN?.trim() || "8h";
}

function failureResponse(
  reason: AdminAuthFailureReason
): { success: false; status: number; message: AdminAuthErrorCode; reason: AdminAuthFailureReason } {
  switch (reason) {
    case "admin_not_found":
      return {
        success: false,
        status: 404,
        message: "ADMIN_NOT_FOUND",
        reason,
      };
    case "admin_inactive":
      return {
        success: false,
        status: 403,
        message: "ADMIN_DISABLED",
        reason,
      };
    case "password_mismatch":
      return {
        success: false,
        status: 401,
        message: "INVALID_PASSWORD",
        reason,
      };
    case "jwt_error":
      return {
        success: false,
        status: 500,
        message: "JWT_SECRET_MISSING",
        reason,
      };
    case "database_error":
      return {
        success: false,
        status: 500,
        message: "DATABASE_CONNECTION_ERROR",
        reason,
      };
    default:
      return {
        success: false,
        status: 500,
        message: "DATABASE_CONNECTION_ERROR",
        reason: "database_error",
      };
  }
}

async function findAdminByEmail(email: string) {
  return prisma.admin.findUnique({ where: { email } });
}

function logAuthDiagnostics(
  email: string,
  admin: Awaited<ReturnType<typeof findAdminByEmail>>,
  passwordMatch?: boolean
) {
  console.log("AUTH DEBUG EMAIL:", email);
  console.log("AUTH DEBUG ADMIN FOUND:", !!admin);
  console.log("AUTH DEBUG ADMIN ACTIVE:", admin?.isActive);
  console.log("AUTH DEBUG ROLE:", admin?.role);
  if (passwordMatch !== undefined) {
    console.log("AUTH DEBUG PASSWORD MATCH:", passwordMatch);
  }
}

async function attemptLogin(
  input: AdminLoginInput,
  email: string
): Promise<
  | {
      success: true;
      admin: NonNullable<Awaited<ReturnType<typeof findAdminByEmail>>>;
      token: string;
    }
  | {
      success: false;
      reason: AdminAuthFailureReason;
    }
> {
  let admin: Awaited<ReturnType<typeof findAdminByEmail>>;

  try {
    admin = await findAdminByEmail(email);
  } catch (error) {
    console.error("[auth/login] Erreur base de données:", error);
    console.log("AUTH DEBUG EMAIL:", email);
    console.log("AUTH DEBUG ADMIN FOUND:", false);
    console.log("AUTH DEBUG ADMIN ACTIVE:", undefined);
    console.log("AUTH DEBUG ROLE:", undefined);
    console.log("AUTH DEBUG PASSWORD MATCH:", false);
    return { success: false, reason: "database_error" };
  }

  if (!admin) {
    logAuthDiagnostics(email, null);
    return { success: false, reason: "admin_not_found" };
  }

  const passwordMatch = await bcrypt.compare(input.password, admin.password);
  logAuthDiagnostics(email, admin, passwordMatch);

  if (!admin.isActive) {
    return { success: false, reason: "admin_inactive" };
  }

  if (!passwordMatch) {
    return { success: false, reason: "password_mismatch" };
  }

  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    return { success: false, reason: "jwt_error" };
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
    const token = jwt.sign(payload, secret, signOptions);
    return { success: true, admin, token };
  } catch (error) {
    console.error("[auth/login] Erreur JWT:", error);
    return { success: false, reason: "jwt_error" };
  }
}

export async function authenticateAdmin(input: AdminLoginInput) {
  const email = normalizeAdminEmail(input.email);
  const dbInfo = parseDatabaseInfo(process.env.DATABASE_URL);

  console.log("[auth/login] DATABASE =", {
    host: dbInfo.host,
    database: dbInfo.database,
    schema: dbInfo.schema,
    url: maskDatabaseUrl(process.env.DATABASE_URL),
  });

  if (!process.env.JWT_SECRET?.trim()) {
    console.log("AUTH DEBUG EMAIL:", email);
    console.log("AUTH DEBUG ADMIN FOUND:", false);
    console.log("AUTH DEBUG ADMIN ACTIVE:", undefined);
    console.log("AUTH DEBUG ROLE:", undefined);
    console.log("AUTH DEBUG PASSWORD MATCH:", false);
    console.log("AUTH DEBUG JWT_SECRET:", "MISSING");
    return failureResponse("jwt_error");
  }

  let result = await attemptLogin(input, email);

  const isOfficialEmail = email === normalizeAdminEmail(OFFICIAL_ADMIN.email);
  if (
    !result.success &&
    isOfficialEmail &&
    result.reason !== "database_error" &&
    result.reason !== "jwt_error"
  ) {
    console.log("[auth/login] Réparation auto admin officiel:", result.reason);
    try {
      await repairOfficialAdmin();
      result = await attemptLogin(input, email);
    } catch (error) {
      if (isDatabaseConnectionError(error)) {
        return failureResponse("database_error");
      }
      throw error;
    }
  }

  if (!result.success) {
    const failure = failureResponse(result.reason);
    console.log("AUTH DEBUG RESULT:", {
      version: AUTH_DEBUG_VERSION,
      status: failure.status,
      message: failure.message,
      reason: failure.reason,
    });
    return failure;
  }

  try {
    await prisma.admin.update({
      where: { id: result.admin.id },
      data: { lastLogin: new Date() },
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return failureResponse("database_error");
    }
    throw error;
  }

  console.log("[auth/login] Authentification réussie", {
    id: result.admin.id,
    email: result.admin.email,
    role: result.admin.role,
  });

  return {
    success: true as const,
    token: result.token,
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
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) return null;

  try {
    return jwt.verify(token, secret, {
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
