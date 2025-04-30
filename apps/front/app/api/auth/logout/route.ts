// import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";

// import { revalidatePath } from "next/cache";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.browserSessionID) {
    console.log("no session");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  await fetch(
    `${BACKEND_URL}/auth/logout/${session.user.id}/${session.browserSessionID}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // Create a response that will redirect to /login
  const redirectResponse = NextResponse.redirect(
    new URL("/login", req.nextUrl)
  );

  // Delete the session cookie directly in this response
  redirectResponse.cookies.delete("session");

  // Return the redirect response with deleted cookie
  return redirectResponse;
}
