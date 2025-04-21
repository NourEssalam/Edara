import { Session, User } from "./types/auth-types";
import { jwtVerify, SignJWT } from "jose";
import { BACKEND_URL, encodedKey, expiredAt } from "./lib/constants";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicRoutes = [
    "/login",
    "/setup",
    "/reset-password",
    "/forgot-password",
  ];
  const apiRoutes = ["/api/"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isApiRoute = apiRoutes.some((route) => pathname.startsWith(route));

  // Check if the current request is to delete the session (logout)
  const isLogoutRoute = pathname === "/api/auth/logout";

  if (
    req.headers.has("cookie") &&
    req.headers.get("cookie")?.includes("session=;")
  ) {
    // This indicates a logout in progress - allow the redirect to login page
    // without checking session validity
    console.log("Middleware: Session cookie being deleted, allowing redirect");
    return NextResponse.next();
  }

  // If this is a logout request, always allow it
  // if (isLogoutRoute) {
  //   console.log("Middleware: Logout route, allowing redirect");
  //   return NextResponse.next();
  // }

  if (isPublicRoute) {
    const response = NextResponse.next();
    response.headers.set("x-url", pathname);
    return response;
  }

  const sessionValue = req.cookies.get("session")?.value;

  if (!sessionValue && !isPublicRoute && !isApiRoute) {
    console.log("sessionValue", sessionValue);

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

  if (oldPayload && sessionValue && !isPublicRoute) {
    try {
      const countUsers = await fetch(`${BACKEND_URL}/user/count`, {
        method: "GET",
      });

      if (countUsers.ok) {
        const count = await countUsers.json();
        if (count === 0) {
          const cookieStore = await cookies();

          cookieStore.delete("session");
          if (!sessionValue && !oldPayload) {
            return NextResponse.redirect(new URL("/setup", req.url));
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

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

      response.headers.set("x-url", pathname);

      // For page routes, check if we need to refresh token when accessing backend resources
      // So we don't have to refresh token on every request
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
