import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const isAuthenticated =
    request.cookies.get("user_authenticated")?.value === "true";

  // Allow unauthenticated users to access login
  if (!isAuthenticated && pathname === "/login") {
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from login
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware on all routes except:
     * - api
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - static files
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};