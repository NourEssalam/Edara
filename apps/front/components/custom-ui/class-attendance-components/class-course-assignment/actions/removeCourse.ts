"use server";

import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function removeCourse(classId: string, courseId: string) {
  try {
    // Call your API endpoint for deletion here
    const res = await authFetch(
      `${BACKEND_URL}/class-attendance/removeCourseFromClass`,
      {
        method: "DELETE", // or DELETE depending on your API design
        body: JSON.stringify({ classId, courseId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      revalidatePath("/(dashboard)/(class-attendance)/classes");
      return { success: true, message: "تم الحذف بنجاح" };
    }
    return {
      success: false,
      message: "فشل الحذف. يرجى المحاولة مرة أخرى.",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "فشل الحذف. يرجى المحاولة مرة أخرى.",
    };
  }
}
