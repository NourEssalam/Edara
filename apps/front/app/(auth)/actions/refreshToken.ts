// "use server";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: oldRefreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token" + response.statusText);
    }

    // new refresh and access tokens
    const { accessToken, refreshToken } = await response.json();

    const session = await getSession();
    if (!session) {
      throw new Error("in refresh token Session not found");
    }
    const updateRes = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/update`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: session?.user,
          accessToken,
          refreshToken,
        }),
      }
    );

    if (!updateRes.ok) {
      throw new Error("Failed to update tokens");
    }
    return accessToken; // Return the new accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
