"use server";

import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function assignToClass(classId: string, courseId: string) {
  "use server";

  try {
    // Call your API endpoint here

    const res = await authFetch(
      `${BACKEND_URL}/class-attendance/assignCourseToClass`,
      {
        method: "POST",
        body: JSON.stringify({ classId, courseId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      revalidatePath("/(dashboard)/(class-attendance)/classes");
      return { success: true, message: "Assignment completed successfully" };
    }
    return {
      success: false,
      message: "Failed to assign. Please try again.",
    };
    // Simulate success (replace with actual API logic)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to assign. Please try again.",
    };
  }
}
