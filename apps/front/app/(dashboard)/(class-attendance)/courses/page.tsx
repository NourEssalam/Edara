import Container from "@/components/custom-ui/common/Container";
import { columns } from "./courses-list/columns";
import { DataTable } from "./courses-list/data-table";
import { BACKEND_URL } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";
import { CreateCourseDialog } from "@/components/custom-ui/class-attendance-components/create-course-dialog";

export default async function ClassesPage() {
  const getAllCourses = await authFetch(
    `${BACKEND_URL}/class-attendance/courses`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const courses = await getAllCourses.json();

  return (
    <Container className="flex flex-col gap-8 overflow-hidden">
      <div dir="rtl" className="flex justify-between">
        <h1 className="text-2xl">الدروس</h1>
        <CreateCourseDialog />
      </div>

      <div dir="rtl">
        <DataTable columns={columns} data={courses} />
      </div>
    </Container>
  );
}
