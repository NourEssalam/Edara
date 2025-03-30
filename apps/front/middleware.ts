import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for session cookie
  const sessionCookie = request.cookies.get("session");

  // Store current request url in a custom header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/setup", "/api/auth"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // !!!!!!!!!!!!!!!!!!!! middleware can look up to route handlers also !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // If no session and trying to access a protected route, redirect to login
  // if (!sessionCookie && !isPublicRoute) {
  //   console.log("middleware - not authenticated 1");
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // If there is a session and trying to access login, redirect to dashboard
  if (sessionCookie && isPublicRoute) {
    console.log("middleware - not authenticated 2");

    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue with the request and set the custom headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files (like robots.txt, manifest.json, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
