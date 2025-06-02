"use server";

import { CancelRequestFormSchema } from "@/form-schemas/leave-wc";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function cancelLeave(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Get the form data
  const formData = Object.fromEntries(data);
  // console.log("formData", formData);
  const parsed = CancelRequestFormSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key]?.toString() || "";
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  if (parsed.data.full_name !== parsed.data.confirm_full_name) {
    return {
      message: "الاسم الذي أدخلته لا يطابق الاسم الكامل للمستخدم",
    };
  }

  const { requestId, userId } = parsed.data;
  console.log("requestId", requestId);
  try {
    const response = await authFetch(
      `${BACKEND_URL}/leave-requests/cancel-leave-request/${userId}/${requestId}`,
      {
        method: "PATCH",
      }
    );

    if (response.ok) {
      revalidatePath("/(dashboard)/(leave-management)/ leave-request-list");
      return {
        message: "Form submitted successfully",
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
      };
    }
  } catch (e) {
    console.error("Error when submitting form", e);
    console.log(e instanceof Error ? e.message : "Something went wrong");
    return {
      message: "حدث خطأ ما",
    };
  }
}
