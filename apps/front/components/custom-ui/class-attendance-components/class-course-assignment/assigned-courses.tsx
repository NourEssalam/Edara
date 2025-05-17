import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Course } from "./class-course-assingment";
import RemoveAlert from "./remove-alert";

export default async function AssignedCourses({
  class_id,
}: {
  class_id: string;
}) {
  let courses = [];
  let error = null;

  try {
    const res = await authFetch(
      `${BACKEND_URL}/class-attendance/assigned-courses/${class_id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch assigned courses: ${res.status}`);
    }

    courses = await res.json();
    // console.log("Assigned courses data:", courses);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error fetching courses:", err);
    error = err.message;
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm font-medium">
          خطأ في تحميل الدورات: {error}
        </p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <h3 className="text-sm font-medium text-gray-900">
          لا توجد دروس مُخصصة
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          لم يتم تخصيص أي دروس لهذا القسم بعد.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        الدروس المخصصة
      </h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {courses.map((course: Course) => (
          <div
            key={course.id}
            className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {course.name || `الدرس ${course.id}`}
              </span>
            </div>
            <RemoveAlert class_id={class_id} course_id={String(course.id)} />
            {/* سيتم إضافة وظيفة الحذف لاحقًا */}
          </div>
        ))}
      </div>
    </div>
  );
}

// For parent component to use with Suspense
export function CourseListLoading() {
  return (
    <div className="w-full">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Assigned Courses
      </h2>
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-3 bg-white border border-gray-200 rounded-lg animate-pulse flex items-center"
          >
            <div className="h-5 w-5 bg-gray-200 rounded mr-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
