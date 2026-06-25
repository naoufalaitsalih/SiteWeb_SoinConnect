import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_ADMIN_PATTERN = /^\/(fr|ar)\/admin(\/.*)?$/;

function resolveAdminPath(pathname: string): string | null {
  const match = pathname.match(LOCALE_ADMIN_PATTERN);
  if (!match) return null;
  return match[2] || "/dashboard";
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localeAdminPath = resolveAdminPath(pathname);
  if (localeAdminPath) {
    return NextResponse.redirect(
      new URL(`/admin${localeAdminPath}`, request.url)
    );
  }

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const legacyRedirects: Record<string, string> = {
    "/admin/requests": "/admin/demandes",
    "/admin/users": "/admin/demandes",
    "/admin/settings": "/admin/demandes",
  };

  if (legacyRedirects[pathname]) {
    return NextResponse.redirect(
      new URL(legacyRedirects[pathname], request.url)
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
