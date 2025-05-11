import Container from "@/components/custom-ui/common/Container";
import { DataTable } from "./studetnts-list/data-table";
import { CreateStudentDialog } from "@/components/custom-ui/class-attendance-components/create-student-dialog";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { columns } from "./studetnts-list/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default async function ClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const getClass = await authFetch(
    `${BACKEND_URL}/class-attendance/class/${id}`
  );
  const getStudents = await authFetch(
    `${BACKEND_URL}/class-attendance/class/${id}/students`
  );
  const classData = await getClass.json();
  const studentsData = await getStudents.json();
  return (
    <Container className="flex flex-col gap-8 overflow-hidden">
      <h1 className="text-2xl text-center">قسم {classData.name}</h1>
      <Tabs
        dir="rtl"
        defaultValue="students"
        className="flex flex-col justify-center gap-8"
      >
        <TabsList>
          <TabsTrigger value="students">قائمة الطلبة</TabsTrigger>
          <TabsTrigger value="courses">دروس القسم</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <div dir="rtl" className="flex justify-end">
            <CreateStudentDialog class_id={id} />
          </div>

          <div dir="rtl">
            <DataTable columns={columns} data={studentsData} />
          </div>
        </TabsContent>
        <TabsContent value="courses">Change your password here.</TabsContent>
      </Tabs>
    </Container>
  );
}
