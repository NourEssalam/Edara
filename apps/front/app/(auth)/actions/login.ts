"use server";
import { loginSchema } from "@/form-shema/auth";
import { BACKEND_URL } from "@/lib/constants";
import { createSession } from "@/lib/session";
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
  const parsed = loginSchema.safeParse(formData);

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

  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    if (response.ok) {
      const result = await response.json();
      //Create the Session For Authentcated user
      await createSession({
        user: {
          id: result.id,
          email: result.email,
          full_name: result.full_name,
          role: result.role,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      return {
        message: "success",
        fields: {
          email: parsed.data.email,
          password: parsed.data.password,
        },
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
      // return {
      //   message: "يرجى التحقق من اتصالك بالإنترنت وحاول مرة أخرى",
      // };
    }
  } catch (e) {
    console.error("Error when setup super admin", e);
    console.log(e instanceof Error ? e.message : "Something went wrong");
    return {
      message: "حدث خطأ ما",
    };
  }
}
