import CourseSession from "@/components/custom-ui/class-attendance-components/class-room/course-session";
import Container from "@/components/custom-ui/common/Container";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { Course } from "@/types/class-atendace-types";

export default async function ClassRoomPage() {
  const session = await getSession();
  const getTeacherClasses = await authFetch(
    `${BACKEND_URL}/class-attendance/teachers-courses-classes/${session?.user.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
      next: { revalidate: 3600 },
    }
  );
  if (!getTeacherClasses.ok) {
    return <p>Something went wrong</p>;
  }
  const data = await getTeacherClasses.json();
  return (
    <Container className="flex flex-col gap-8 overflow-hidden  items-center">
      {/* <h1 className="text-2xl bg-amber-900 py-2 px-6 text-white rounded-3xl ">
        تسجيل حضور الطلبة
      </h1> */}

      <CourseSession courses={data as Course[]} />
    </Container>
  );
}
