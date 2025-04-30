"use server";

import { DeleteUserFormSchema } from "@/form-schemas/users-management";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function deleteUser(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Get the form data
  const formData = Object.fromEntries(data);
  // console.log("formData", formData);
  const parsed = DeleteUserFormSchema.safeParse(formData);

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

  // if user in the only super admin we can't delete him
  try {
    const response = await authFetch(
      `${BACKEND_URL}/user/count-super-admins/`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
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
      message: "حدث خطاء ما",
    };
  }

  const { userId } = parsed.data;
  try {
    const response = await authFetch(
      `${BACKEND_URL}/user/delete-user-by-super-admin/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      revalidatePath("/(dashboard)/users-management/");
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
