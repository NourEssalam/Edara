import { Session, User } from "./types/auth-types";
import { jwtVerify, SignJWT } from "jose";
import { BACKEND_URL, encodedKey, expiredAt } from "./lib/constants";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicRoutes = ["/login", "/setup"];
  const apiRoutes = ["/api/"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isApiRoute = apiRoutes.some((route) => pathname.startsWith(route));

  if (
    req.headers.has("cookie") &&
    req.headers.get("cookie")?.includes("session=;")
  ) {
    // This indicates a logout in progress - allow the redirect to login page
    // without checking session validity
    console.log("Middleware: Session cookie being deleted, allowing redirect");
    return NextResponse.next();
  }

  const sessionValue = req.cookies.get("session")?.value;

  // Check if the current request is to delete the session (logout)
  const isLogoutRoute = pathname === "/api/auth/logout";

  // If this is a logout request, always allow it
  if (isLogoutRoute) {
    return NextResponse.next();
  }

  if (!sessionValue && !isPublicRoute && !isApiRoute) {
    console.log("Middleware: Not authenticated, redirecting to login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const oldPayload = await getSession(); // we use this because the sessionValue always true
  // Redirect to dashboard if authenticated but on a public route
  if (
    oldPayload &&
    isPublicRoute &&
    !isApiRoute &&
    !req.nextUrl.searchParams.has("logout")
  ) {
    console.log(
      "Middleware: Already authenticated, redirecting to dashboard..."
    );
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (sessionValue) {
    try {
      // Verify the session JWT
      const { payload } = await jwtVerify(sessionValue, encodedKey, {
        algorithms: ["HS256"],
      });

      const { accessToken, refreshToken } = payload as Session;

      // Create response and set auth header
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("Authorization", `Bearer ${accessToken}`);

      // Forward the request with the auth header
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // For API routes, let them handle their own auth
      // if (isApiRoute) {
      //   return response;
      // }

      // For page routes, check if we need to refresh token when accessing backend resources
      if (!pathname.includes("/auth/refresh")) {
        // Make the original request to check if token is valid
        const fetchRequest = new Request(`${BACKEND_URL}/auth/check-access`, {
          method: "GET",
          headers: requestHeaders,
        });

        const validateResponse = await fetch(fetchRequest);

        // Only refresh if we get a 401 Unauthorized
        if (validateResponse.status === 401 && refreshToken) {
          console.log("Middleware: Token expired, refreshing...");

          const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshResponse.ok) {
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = await refreshResponse.json();

            console.log("Middleware: Token refreshed successfully");

            // Update session with new tokens
            const newPayload: Session = {
              user: { ...(payload.user as User) },
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            };

            const session = await new SignJWT(newPayload)
              .setProtectedHeader({ alg: "HS256" })
              .setIssuedAt()
              .setExpirationTime("7d")
              .sign(encodedKey);

            response.cookies.set("session", session, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              expires: expiredAt,
              sameSite: "lax",
              path: "/",
            });
          } else {
            // If refresh fails, redirect to login
            console.log("Middleware: Failed to refresh token");
            return NextResponse.redirect(new URL("/login", req.url));
          }
        }
      }

      return response;
    } catch (error) {
      console.log("Middleware: Invalid session, redirecting to login...");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
  /*
   * Match all request paths except:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public folder
   * - public files (like robots.txt, manifest.json, etc.)
   */
  matcher: "/((?!_next/static|_next/image|favicon.ico|public/).*)",
};
