import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

// import { revalidatePath } from "next/cache";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await authFetch(`${BACKEND_URL}/auth/logout`, {
    method: "PATCH",
  });

  // Create a response that will redirect to /login
  const redirectResponse = NextResponse.redirect(
    new URL("/login", req.nextUrl)
  );

  // Delete the session cookie directly in this response
  redirectResponse.cookies.delete("session");

  // Return the redirect response with deleted cookie
  return redirectResponse;
}
