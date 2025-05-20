import Container from "@/components/custom-ui/common/Container";
import { DataTable } from "./studetnts-list/data-table";
import { CreateStudentDialog } from "@/components/custom-ui/class-attendance-components/create-student-dialog";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { columns } from "./studetnts-list/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassCourseAssignment from "@/components/custom-ui/class-attendance-components/class-course-assignment/class-course-assingment";
type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function ClassPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const { id } = await params;
  const searchParams = await props.searchParams;

  const getClass = await authFetch(
    `${BACKEND_URL}/class-attendance/class/${id}`
  );
  const getStudents = await authFetch(
    `${BACKEND_URL}/class-attendance/class/${id}/students`
  );
  const classData = await getClass.json();
  const studentsData = await getStudents.json();
  return (
    <Container className="flex flex-col gap-4 overflow-hidden py-0 md:-mt-5">
      {/* <h1 className="text-2xl text-center">قسم {classData.name}</h1> */}
      <Tabs
        dir="rtl"
        defaultValue="students"
        className="flex flex-col justify-center gap-8 py-0 m-0 "
      >
        <TabsList className="w-full flex gap-8 m-0">
          <TabsTrigger value="" disabled className="text-foreground text-xl">
            قسم {classData.name}
          </TabsTrigger>
          <div>
            <TabsTrigger value="students">قائمة الطلبة</TabsTrigger>
            <TabsTrigger value="courses">دروس القسم</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="students">
          <div dir="rtl" className="flex justify-end">
            <CreateStudentDialog class_id={id} />
          </div>

          <div dir="rtl">
            <DataTable columns={columns} data={studentsData} />
          </div>
        </TabsContent>
        <TabsContent value="courses">
          {/* <ClassCourseAssignment class_id={id} /> */}
          <ClassCourseAssignment class_id={id} searchParams={searchParams} />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
