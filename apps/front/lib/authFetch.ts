import { getSession } from "./session";

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export const authFetch = async (
  url: string | URL,
  options: FetchOptions = {}
) => {
  const session = await getSession();

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`,
  };
  options.credentials = "include";

  let response = await fetch(url, options);

  // If unauthorized, let the middleware handle token refresh
  if (response.status === 401) {
    console.log(
      "%c Token expired, middleware should refresh it",
      "color: orange;"
    );

    // Retry the request, middleware will update session automatically
    response = await fetch(url, options);
  }

  return response;
};
