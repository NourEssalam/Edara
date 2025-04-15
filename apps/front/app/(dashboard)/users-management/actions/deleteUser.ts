"use server";

import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

export async function deleteUser(id: string) {
  const res = await authFetch(`${BACKEND_URL}/user/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
