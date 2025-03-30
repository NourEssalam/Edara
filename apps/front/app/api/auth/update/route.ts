import { updateTokens } from "@/lib/session";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("update token route handler ...");
  const body = await req.json();
  const { user, accessToken, refreshToken } = body;
  if (!accessToken || !refreshToken || !user) {
    return new Response("Provide Tokens", { status: 401 });
  }

  await updateTokens({ accessToken, refreshToken, user });

  return new Response("OK", { status: 200 });
}
