"use server";

import { destroySession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function getOut() {
  await destroySession();
  console.log("we deleted the session");
  redirect("/setup");
}
