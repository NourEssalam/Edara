import AssignAlert from "./assign-alert";
import { CourseListProps } from "./class-course-assingment";

export default function CourseList({
  coursesList,
  class_id,
}: CourseListProps & { class_id: string }) {
  if (coursesList.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-md p-4 my-4">
        <p className="text-yellow-700 dark:text-yellow-400">
          No courses available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto mt-2">
      {/* <h2 className="text-xl font-semibold mb-4">Available Courses</h2> */}
      <ul className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 divide-y divide-gray-100 dark:divide-gray-700">
        {coursesList.map((course) => (
          <li
            key={course.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium dark:text-gray-200">
                {course.name}
              </span>
              <AssignAlert class_id={class_id} course_id={String(course.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
