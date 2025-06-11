"use server";

import { studentCreationSchema } from "@/form-schemas/class-attendance";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function createStudent(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Get the form data
  const formData = Object.fromEntries(data);

  const parsed = studentCreationSchema.safeParse(formData);

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
    const { class_id, ...studentData } = parsed.data;
    console.log("studentData", studentData);
    console.log("class_id", class_id);
    const response = await authFetch(
      `${BACKEND_URL}/class-attendance/class/${class_id}/students`,
      {
        method: "POST",
        body: JSON.stringify(studentData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      return { message: resData?.message || "Failed to create class" };
    }

    return { message: "success" };
  } catch (error) {
    console.log("catch error", error);
    return { message: "Server error occurred" };
  }
}
