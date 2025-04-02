import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("update token route handler ...");

  return new Response("OK", { status: 200 });
}
