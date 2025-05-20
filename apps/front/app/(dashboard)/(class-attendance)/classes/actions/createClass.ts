"use server";

import { classCreationSchema } from "@/form-schemas/class-attendance";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function createClass(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Get the form data
  const formData = Object.fromEntries(data);

  const parsed = classCreationSchema.safeParse(formData);

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

  console.log("parsed data", parsed.data);

  try {
    const formData = new FormData();
    formData.append("class_name", parsed.data.class_name);
    formData.append("file", parsed.data.file);
    const response = await authFetch(
      `${BACKEND_URL}/class-attendance/create-class`,
      {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type manually; browser handles it with boundaries
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      return { message: resData?.message || "Failed to create class" };
    }

    return { message: "Class created and students imported successfully" };
  } catch (error) {
    console.log("catch error", error);
    return { message: "Server error occurred" };
  }
}
