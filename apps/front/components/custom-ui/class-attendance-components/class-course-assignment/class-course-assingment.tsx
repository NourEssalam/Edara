import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { Suspense } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import CourseList from "./all-courses-list";
import Link from "next/link";
import PageSize from "./pageSize";
import Pagination from "./pagination";
import SearchFilter from "./search-filter";
import AssignedCourses from "./assigned-courses";

export interface Course {
  id: number;
  name: string;
}

export interface CourseListProps {
  coursesList: Course[];
}

interface PaginatedCoursesResponse {
  getCourses: Course[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Function to fetch all courses
const getAllCourses = async (
  class_id: string,
  filters: {
    page?: number;
    pageSize?: number;
    search?: string;
  } = {} // default value
): Promise<PaginatedCoursesResponse> => {
  if (!class_id) {
    throw new Error("class_id is required");
  }

  const { page = 1, pageSize = 20, search = "" } = filters;

  try {
    const res = await authFetch(
      `${BACKEND_URL}/class-attendance/paginated-courses?class_id=${class_id}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch courses: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export default async function ClassCourseAssignment({
  class_id,
  searchParams,
}: {
  class_id: string;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const pageSize = searchParams.pageSize ? Number(searchParams.pageSize) : 20;
  const search = searchParams.search ? String(searchParams.search) : "";

  const coursesRes = await getAllCourses(class_id, {
    page,
    pageSize,
    search,
  });

  // const baseUrl = `/classes/${class_id}/?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`;

  return (
    <section className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {/* <h1 className="text-2xl font-bold mb-6">تعيين الدورات للقسم</h1>
  <p className="text-gray-600 dark:text-gray-400 mb-4">
    إدارة تعيينات الدورات للقسم ذو المعرف: {class_id}
  </p> */}
      <div className="w-full grid grid-cols-[30%_68%] items-start gap-4">
        {/* assigned courses  */}
        <div className="flex md:flex-row md:justify-between md:items-end gap-4 mb-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <Suspense fallback={<CourseListLoading />}>
            <AssignedCourses class_id={class_id} />
          </Suspense>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="w-3/4 mx-auto flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-4">
            <SearchFilter />
            <PageSize />
          </div>
          <Suspense fallback={<CourseListLoading />}>
            <CourseList
              coursesList={coursesRes.getCourses}
              class_id={class_id}
            />
          </Suspense>

          {/* Pagination using the new component */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={page}
              totalPages={coursesRes.totalPages}
              hasNextPage={coursesRes.hasNextPage}
              hasPrevPage={coursesRes.hasPrevPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Error component
function CourseListError({ error }: { error: Error }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
      <div className="flex">
        <XCircle className="h-5 w-5 text-red-500" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Error loading courses
          </h3>
          <p className="text-sm text-red-700 mt-1">{error.message}</p>
          {/* <button
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          >
            Try again
          </button> */}
        </div>
      </div>
    </div>
  );
}

// Loading component
function CourseListLoading() {
  return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      <span className="ml-2 text-gray-600">Loading courses...</span>
    </div>
  );
}
