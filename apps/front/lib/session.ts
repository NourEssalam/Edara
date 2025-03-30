"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encodedKey } from "./constants";
import { Session, User } from "@/types/auth-types";

export async function createSession(payload: Session, update?: boolean) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  console.log("new refrsh token", payload.refreshToken);
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const cookieStore = await cookies();

  if (update) {
    await cookieStore.delete("session");
    // Add a small delay to ensure deletion is processed
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;

  if (!sessionValue) return null;
  try {
    const { payload } = await jwtVerify(sessionValue, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (error) {
    console.error("Failed to verify session:", error);
    redirect("/login");
  }
}

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

export async function updateTokens({
  accessToken,
  refreshToken,
  user,
}: {
  accessToken: string;
  refreshToken: string;
  user: User;
}) {
  const newPayload: Session = {
    user: {
      ...user,
    },
    accessToken, // new access token
    refreshToken, // new refresh token
  };
  await createSession(newPayload, true);
}
