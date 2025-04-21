"use server";

import { createUserSchema } from "@/form-schemas/users-management";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function createUser(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Get the form data
  const formData = Object.fromEntries(data);

  const parsed = createUserSchema.safeParse(formData);

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

  if (parsed.data.password !== parsed.data.confirmPassword) {
    return {
      message: "كلمتا المرور غير متطابقتين",
      fields: {
        password: parsed.data.password,
        confirmPassword: parsed.data.confirmPassword,
      },
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dataToSend } = parsed.data;
    console.log("Data to send:", dataToSend);
    const response = await authFetch(`${BACKEND_URL}/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
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
