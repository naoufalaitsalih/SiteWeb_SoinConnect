import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { isAdminPublicPath } from "./lib/admin-auth";

const intlMiddleware = createMiddleware(routing);

const LOCALE_ADMIN_PATTERN = /^\/(fr|ar)\/admin(\/.*)?$/;

function resolveAdminPath(pathname: string): string | null {
  const match = pathname.match(LOCALE_ADMIN_PATTERN);
  if (!match) return null;
  return match[2] || "/dashboard";
}

function hasAdminCookie(request: NextRequest): boolean {
  return Boolean(request.cookies.get("admin_token")?.value);
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localeAdminPath = resolveAdminPath(pathname);
  if (localeAdminPath) {
    return NextResponse.redirect(
      new URL(`/admin${localeAdminPath}`, request.url)
    );
  }

  if (pathname.startsWith("/admin")) {
    const cookieFound = hasAdminCookie(request);

    console.log("[middleware/admin] path:", pathname);
    console.log("MIDDLEWARE COOKIE FOUND", cookieFound);

    const isPublic = isAdminPublicPath(pathname);

    if (pathname === "/admin") {
      return NextResponse.redirect(
        new URL(
          cookieFound ? "/admin/dashboard" : "/admin/login",
          request.url
        )
      );
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

    if (!isPublic && !cookieFound) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isPublic && cookieFound) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
