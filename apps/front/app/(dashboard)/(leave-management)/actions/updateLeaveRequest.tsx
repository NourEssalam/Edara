"use server";

import { updateLeaveRequestSchema } from "@/form-schemas/leave-wc";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  timestamp?: number;
};

export async function updateLeaveRequest(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Get the form data
  const formData = Object.fromEntries(data);
  // console.log("formData", formData);
  const parsed = updateLeaveRequestSchema.safeParse(formData);
  console.log(new Date("2012-03-21T00:00:00"));
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key]?.toString() || "";
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
      timestamp: Date.now(),
    };
  }
  console.log(parsed.data.durationFrom, parsed.data.durationTo);
  try {
    const response = await authFetch(
      `${BACKEND_URL}/leave-requests/update-leave-request`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      }
    );

    if (response.ok) {
      revalidatePath("/(dashboard)/(leave-management)/leave-request-list");
      return {
        message: "Form submitted successfully",
        timestamp: Date.now(),
      };
    } else {
      // Handle non-2xx responses
      const errorData = await response.json().catch(() => null);
      console.log({
        message:
          errorData?.message ||
          `Error: ${response.status} ${response.statusText}`,
      });
      return {
        message:
          errorData?.message ||
          `Error: ${response.status} ${response.statusText}`,
        timestamp: Date.now(),
      };
    }
  } catch (e) {
    console.error("Error when submitting form", e);
    console.log(e instanceof Error ? e.message : "Something went wrong");
    return {
      message: "حدث خطأ ما",
      timestamp: Date.now(),
    };
  }
}
