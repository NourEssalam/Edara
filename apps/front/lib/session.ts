"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encodedKey } from "./constants";
import { Session } from "@/types/auth-types";

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  console.log("########## Create Session ##########");
  const cookieStore = await cookies();
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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

// export async function updateTokens({
//   accessToken,
//   refreshToken,
//   user,
// }: {
//   accessToken: string;
//   refreshToken: string;
//   user: User;
// }) {
//   const newPayload: Session = {
//     user: {
//       ...user,
//     },
//     accessToken, // new access token
//     refreshToken, // new refresh token
//   };
//   await createSession(newPayload);
// }
