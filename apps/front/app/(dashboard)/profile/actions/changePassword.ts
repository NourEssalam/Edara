"use server";

import { ChangePasswordSchema } from "@/form-schemas/users-management";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function changePassword(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Get the form data
  const formData = Object.fromEntries(data);
  const parsed = ChangePasswordSchema.safeParse(formData);

  if (!parsed.success) {
    console.log("parsed data", parsed.data);
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

  if (parsed.data.newPassword !== parsed.data.confirmNewPassword) {
    return {
      message: "كلمتا المرور غير متطابقتين",
      // fields: {
      //   newPassword: parsed.data.newPassword,
      //   confirmNewPassword: parsed.data.confirmNewPassword,
      // },
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, confirmNewPassword, ...rest } = parsed.data;
    console.log("rest", rest);
    const response = await authFetch(
      `${BACKEND_URL}/user/change-password-by-self/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      }
    );

    if (response.ok) {
      // revalidatePath("/(dashboard)/profile/");
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
