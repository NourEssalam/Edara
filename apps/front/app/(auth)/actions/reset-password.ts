"use server";
import { resetPasswordSchema } from "@/form-schemas/auth";
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
  console.log("formData", formData);
  const parsed = resetPasswordSchema.safeParse(formData);

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

  console.log("parsed.data", parsed.data);
  // return {
  //   message: "ok",
  // };

  try {
    const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: parsed.data.password,
        token: formData.token,
      }),
    });
    const result = await response.json();
    if (response.ok) {
      return {
        message: result.message,
      };
    } else {
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
    console.error("Error when setup super admin", e);
    console.log(e instanceof Error ? e.message : "Something went wrong");
    return {
      message: "حدث خطأ ما",
    };
  }
}
