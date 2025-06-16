"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Clock, FileText, ShieldAlert } from "lucide-react";
import { AttendanceStatus } from "@repo/shared-types";
import { saveAttendance } from "../actions/recordStudents";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import NavigationGuard from "@/components/custom-ui/common/reload-alert";

export type ExtendedAttendanceStatus = AttendanceStatus | "NOT_MARKED";

export interface Student {
  id: number;
  cin: string;
  first_name: string;
  last_name: string;
  class_id: number;
  created_at: string;
  updated_at: string;
  attendance_status?: ExtendedAttendanceStatus;
}

export function StudentsAttendanceTable({
  initialStudents,
  courseSessionId,
}: {
  initialStudents: Student[];
  courseSessionId: number;
}) {
  const [students, setStudents] = useState(() =>
    initialStudents.map((student) => ({
      ...student,
      attendance_status: "NOT_MARKED" as ExtendedAttendanceStatus,
    }))
  );
  const { toast } = useToast();

  // const [attendanceData, setAttendanceData] = useState(
  //   students.map((student) => ({
  //     studentId: student.id,
  //     attendanceStatus: AttendanceStatus.ABSENT,
  //   }))
  // );

  const allMarked = students.every(
    (student) => student.attendance_status !== "NOT_MARKED"
  );

  const updateStatus = (studentId: number, status: AttendanceStatus) => {
    setSubmitted(false);
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, attendance_status: status }
          : student
      )
    );
  };

  const getStatusBgColor = (status: ExtendedAttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return "bg-green-500";
      case AttendanceStatus.ABSENT:
        return "bg-red-500";
      case AttendanceStatus.LATE:
        return "bg-yellow-500";
      case AttendanceStatus.EXCUSED:
        return "bg-blue-500";
      case AttendanceStatus.EXCLUDED:
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getButtonClass = (
    studentStatus: ExtendedAttendanceStatus,
    buttonStatus: AttendanceStatus
  ) => {
    return studentStatus === buttonStatus
      ? `${getStatusBgColor(buttonStatus)} text-white hover:opacity-90`
      : "bg-gray-200 hover:bg-gray-300 text-gray-700";
  };
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async () => {
    const attendanceData = students.map((student) => ({
      studentId: student.id,
      attendanceStatus: student.attendance_status as AttendanceStatus,
    }));

    const result = await saveAttendance(courseSessionId, attendanceData);
    if (result.success) {
      setSubmitted(true);
      toast({
        title: result.message,
        variant: "success",
      });
    } else {
      toast({
        title: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <NavigationGuard submitted={submitted} />
      <div className="flex justify-end w-full py-8">
        <Link
          href="/class-room"
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          dir="ltr"
        >
          &larr; العودة إلى الوراء
        </Link>
      </div>

      <div className="space-y-4">
        {/* شرح الرموز الخاصة بالحالة */}
        <div className="flex w-full  items-center  justify-end gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span>متأخر</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>بعذر</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 text-purple-500" />
            <span>مفصول</span>
          </div>
        </div>
        <div className="relative h-[63vh] borderborder rounded-md overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-black">
              <TableRow>
                <TableHead className="text-right">الاسم الأول</TableHead>
                <TableHead className="text-right">الاسم الأخير</TableHead>
                <TableHead className="text-center">حالة الحضور</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="text-right">
                    {student.first_name}
                  </TableCell>
                  <TableCell className="text-right">
                    {student.last_name}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        className={`px-2 py-1 rounded-md text-xs flex items-center ${getButtonClass(
                          student.attendance_status,
                          AttendanceStatus.PRESENT
                        )}`}
                        onClick={() =>
                          updateStatus(student.id, AttendanceStatus.PRESENT)
                        }
                      >
                        <Check className="w-4 h-4 mr-1" />
                        حاضر
                      </button>
                      <button
                        className={`px-2 py-1 rounded-md text-xs flex items-center ${getButtonClass(
                          student.attendance_status,
                          AttendanceStatus.ABSENT
                        )}`}
                        onClick={() =>
                          updateStatus(student.id, AttendanceStatus.ABSENT)
                        }
                      >
                        <X className="w-4 h-4 mr-1" />
                        غائب
                      </button>
                      <div className="flex gap-1">
                        <button
                          className={`p-1 rounded-md ${getButtonClass(
                            student.attendance_status,
                            AttendanceStatus.LATE
                          )}`}
                          onClick={() =>
                            updateStatus(student.id, AttendanceStatus.LATE)
                          }
                          title="متأخر"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-1 rounded-md ${getButtonClass(
                            student.attendance_status,
                            AttendanceStatus.EXCUSED
                          )}`}
                          onClick={() =>
                            updateStatus(student.id, AttendanceStatus.EXCUSED)
                          }
                          title="بعذر"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-1 rounded-md ${getButtonClass(
                            student.attendance_status,
                            AttendanceStatus.EXCLUDED
                          )}`}
                          onClick={() =>
                            updateStatus(student.id, AttendanceStatus.EXCLUDED)
                          }
                          title="مفصول"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center">
          {!allMarked && (
            <p className="text-red-500 text-sm">
              الرجاء تسجيل حالة الحضور لجميع الطلاب قبل الإرسال.
            </p>
          )}
          <button
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              allMarked && !submitted
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!allMarked || loading || submitted}
            onClick={async () => {
              setLoading(true);
              await handleSubmit();
              setLoading(false);
            }}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {submitted ? "تم الإرسال" : "إرسال الحضور"}
          </button>
        </div>
      </div>
    </>
  );
}
