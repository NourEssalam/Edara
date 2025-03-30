"use server";

import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

export const getProfile = async () => {
  const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  const result = await response.json();
  return result;
};
