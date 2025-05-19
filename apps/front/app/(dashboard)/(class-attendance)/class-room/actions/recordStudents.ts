// app/actions/attendance.ts
"use server";

import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { AttendanceStatus } from "@repo/shared-types";
import { z } from "zod";

const AttendanceSchema = z.object({
  records: z.array(
    z.object({
      studentId: z.number(),
      attendanceStatus: z.nativeEnum(AttendanceStatus),
    })
  ),
});

type AttendanceRecord = {
  studentId: number;
  attendanceStatus: AttendanceStatus;
};

// returned message
type Message = {
  success: boolean;
  message: string;
};

export async function saveAttendance(
  courseSessionId: number,
  attendanceRecords: AttendanceRecord[]
): Promise<Message> {
  const parsed = AttendanceSchema.safeParse({
    records: attendanceRecords,
  });
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
    };
  }

  try {
    const response = await authFetch(
      `${BACKEND_URL}/class-attendance/save-attendance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseSessionId,
          attendanceData: parsed.data.records,
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving attendance:", error);
    return {
      success: false,
      message: "Error saving attendance",
    };
  }
}
