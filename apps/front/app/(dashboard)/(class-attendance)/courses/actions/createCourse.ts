"use server";

import { courseCreationSchema } from "@/form-schemas/class-attendance";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function createCourse(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Manually construct the object from FormData
  const formData: Record<string, any> = {};

  // Loop through FormData entries
  for (const [key, value] of data.entries()) {
    if (key === "teacher_ids") {
      // Initialize or append to array
      if (!formData[key]) {
        formData[key] = [];
      }
      formData[key].push(value.toString());
    } else {
      formData[key] = value.toString();
    }
  }

  console.log("formData", formData);

  const parsed = courseCreationSchema.safeParse(formData);

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
  // return {
  //   message: "Class created and students imported successfully",
  // };
  try {
    const response = await authFetch(
      `${BACKEND_URL}/class-attendance/create-course`,
      {
        method: "POST",
        body: JSON.stringify(parsed.data),
        headers: {
          "Content-Type": "application/json",
        },
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
