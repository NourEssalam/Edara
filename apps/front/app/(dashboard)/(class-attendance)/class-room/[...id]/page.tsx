import Container from "@/components/custom-ui/common/Container";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import Link from "next/link";
import { StudentsAttendanceTable } from "./students-table";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number[] }>;
}) {
  const { id } = await params;
  const classId = id[0];
  const courseSessionId = id[1];
  const getStudents = await authFetch(
    `${BACKEND_URL}/class-attendance/class/${classId}/students`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
      next: { revalidate: 3600 },
    }
  );
  if (!getStudents.ok) {
    return <p>Something went wrong</p>;
  }
  const studentsData = await getStudents.json();
  // console.log("studentsData", studentsData);
  return (
    <Container className="flex flex-col gap-4 overflow-hidden py-0 -mt-5">
      <StudentsAttendanceTable
        initialStudents={studentsData}
        courseSessionId={courseSessionId as number}
      />
    </Container>
  );
}
