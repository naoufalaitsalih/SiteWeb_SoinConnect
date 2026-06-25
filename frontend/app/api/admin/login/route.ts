import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminCookieOptions } from "@/lib/admin-auth";
import { API_UNREACHABLE_MESSAGE } from "@/lib/env";

export const dynamic = "force-dynamic";

function getRenderApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.trim() || "https://soinsconnect-api.onrender.com"
  ).replace(/\/+$/, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = `${getRenderApiBase()}/api/admin/auth/login`;

    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    if (data?.success !== true) {
      return NextResponse.json(
        { success: false, message: data?.message ?? "LOGIN_FAILED" },
        { status: 401 }
      );
    }

    if (typeof data?.token !== "string" || data.token.length === 0) {
      return NextResponse.json(
        { success: false, message: "TOKEN_MISSING_FROM_BACKEND" },
        { status: 502 }
      );
    }

    const admin = data.admin ?? data.user;
    if (!admin || typeof admin !== "object") {
      return NextResponse.json(
        { success: false, message: "ADMIN_MISSING_FROM_BACKEND" },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      success: true,
      admin,
    });

    response.cookies.set(ADMIN_COOKIE, data.token, getAdminCookieOptions());

    console.log("LOGIN PROXY SET COOKIE OK");

    return response;
  } catch (error) {
    console.error("[api/admin/login]", error);
    return NextResponse.json(
      { success: false, message: API_UNREACHABLE_MESSAGE },
      { status: 503 }
    );
  }
}
