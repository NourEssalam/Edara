import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { destroySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const respone = await authFetch(`${BACKEND_URL}/auth/logout`, {
    method: "POST",
  });

  if (respone.ok) {
    await destroySession();
  }
  // revalidatePath("/");
  // redirect("/login");
  return NextResponse.redirect(new URL("/login", req.nextUrl));
}
