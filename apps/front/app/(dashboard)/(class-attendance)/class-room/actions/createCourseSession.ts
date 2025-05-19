"use server";
import { CourseSessionSchema } from "@/form-schemas/class-attendance";

import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  res?: { id: number; class_id: number };
};

export async function createCourseSession(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Get the form data
  const formData = Object.fromEntries(data);
  console.log("formData", formData);
  const parsed = CourseSessionSchema.safeParse(formData);

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

  console.log(JSON.stringify(parsed.data));
  // return { message: "success" };

  try {
    const response = await authFetch(
      `${BACKEND_URL}/class-attendance/create-course-session`,
      {
        method: "POST",
        body: JSON.stringify(parsed.data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resData = await response.json();
    console.log("resData", resData);
    if (!response.ok) {
      return {
        message: resData?.message || "Failed to create class",
      };
    }

    return {
      message: "Class created and students imported successfully",
      res: resData,
    };
  } catch (error) {
    console.log("catch error", error);
    return { message: "Server error occurred" };
  }
}
