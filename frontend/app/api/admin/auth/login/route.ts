import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_OPTIONS } from "@/lib/admin-auth";
import { serverApiUrl } from "@/lib/api-base";
import { API_UNREACHABLE_MESSAGE } from "@/lib/env";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}

function maskToken(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) return "[missing]";
  return `[present:${value.length} chars]`;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        success: false,
        message: "Trop de tentatives. Réessayez dans 15 minutes.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const hasPassword = typeof body?.password === "string" && body.password.length > 0;

    console.log("[admin/login proxy] requête", {
      email,
      hasPassword,
      contentType: "application/json",
    });

    const backendUrl = serverApiUrl("/api/admin/auth/login");
    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    console.log("LOGIN RESPONSE", {
      status: backendRes.status,
      ok: backendRes.ok,
      url: backendUrl,
    });
    console.log("LOGIN DATA", {
      success: data?.success,
      message: data?.message,
      token: maskToken(data?.token),
      admin: data?.admin ?? data?.user ?? null,
    });

    if (!backendRes.ok) {
      console.warn("[admin/login proxy] échec backend", {
        url: backendUrl,
        status: backendRes.status,
        message: data?.message,
      });
      return NextResponse.json(data, { status: backendRes.status });
    }

    if (data?.success !== true) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message ?? "LOGIN_BACKEND_SUCCESS_FALSE",
        },
        { status: 502 }
      );
    }

    if (typeof data?.token !== "string" || data.token.length === 0) {
      console.error("[admin/login proxy] TOKEN manquant dans la réponse backend");
      return NextResponse.json(
        {
          success: false,
          message: "TOKEN_MISSING_FROM_BACKEND",
        },
        { status: 502 }
      );
    }

    const admin = data.admin ?? data.user;
    if (!admin || typeof admin !== "object") {
      console.error("[admin/login proxy] admin/user manquant dans la réponse backend");
      return NextResponse.json(
        {
          success: false,
          message: "ADMIN_PROFILE_MISSING_FROM_BACKEND",
        },
        { status: 502 }
      );
    }

    console.log("TOKEN", maskToken(data.token));
    console.log("[admin/login proxy] cookie httpOnly", ADMIN_COOKIE, "sera défini");

    const response = NextResponse.json({
      success: true,
      token: data.token,
      admin,
    });

    response.cookies.set(ADMIN_COOKIE, data.token, ADMIN_COOKIE_OPTIONS);

    const setCookieHeader = response.headers.get("set-cookie");
    console.log(
      "[admin/login proxy] SET-COOKIE dans réponse HTTP:",
      setCookieHeader ? "present" : "missing"
    );
    console.log(
      "[admin/login proxy] COOKIE FOUND (response.cookies):",
      response.cookies.has(ADMIN_COOKIE)
    );

    return response;
  } catch (error) {
    console.error("[admin/login proxy] Backend unreachable:", error);

    return NextResponse.json(
      {
        success: false,
        message: API_UNREACHABLE_MESSAGE,
      },
      { status: 503 }
    );
  }
}
