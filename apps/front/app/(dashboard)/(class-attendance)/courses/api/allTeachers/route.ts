import { authFetch } from "@/lib/authFetch";
import { NEXT_PUBLIC_BACKEND_URL } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Use environment variable from .env
    const response = await authFetch(
      `${NEXT_PUBLIC_BACKEND_URL}/class-attendance/teachers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: { revalidate: 3600 },
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
