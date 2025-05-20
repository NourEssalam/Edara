import { authFetch } from "@/lib/authFetch";
import { NEXT_PUBLIC_BACKEND_URL } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Use environment variable from .env
    const response = await authFetch(
      `${NEXT_PUBLIC_BACKEND_URL}/class-attendance/teachers/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Return the data to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
