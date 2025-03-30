"use server";

import { signUpSchema } from "@/form-shema/auth";
import { BACKEND_URL } from "@/lib/constants";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function onSubmitAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Get the form data
  const formData = Object.fromEntries(data);
  const parsed = signUpSchema.safeParse(formData);

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
      message: "Passwords do not match",
      fields: {
        password: parsed.data.password,
        confirmPassword: parsed.data.confirmPassword,
      },
    };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    if (response.ok) {
      return {
        message: "Form submitted successfully",
      };
    } else {
      // Handle non-2xx responses
      const errorData = await response.json().catch(() => null);
      return {
        message:
          errorData?.message ||
          `Error: ${response.status} ${response.statusText}`,
      };
    }
  } catch (e) {
    console.error("Error when setup super admin", e);
    return {
      message: e instanceof Error ? e.message : "Something went wrong",
    };
  }
}
