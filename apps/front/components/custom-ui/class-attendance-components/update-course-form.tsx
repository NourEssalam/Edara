"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useActionState,
  useTransition,
  useRef,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { authFetch } from "@/lib/authFetch";
import { courseUpdateSchema } from "@/form-schemas/class-attendance";
import { updateCourse } from "@/app/(dashboard)/(class-attendance)/courses/actions/updateCourse";
import { CoursesData } from "@/app/(dashboard)/(class-attendance)/courses/courses-list/columns";

interface UpdateCourseFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  course: CoursesData;
}

const TeacherSelector = ({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTeachers = async () => {
      try {
        setIsLoading(true);
        const response = await authFetch(`/courses/api/allTeachers`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-cache",
        });
        const data = await response.json();

        const formattedTeachers = data.map(
          (t: { id: number; name: string }) => ({
            id: String(t.id),
            name: t.name,
          })
        );

        setTeachers(formattedTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTeachers();
  }, []);

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTeacher = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((tId) => tId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="border rounded-md p-2 mt-1">
      <Input
        placeholder="ابحث عن معلم..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedIds.map((id) => {
            const teacher = teachers.find((t) => t.id === id);
            return teacher ? (
              <Badge key={`selected-${id}`} variant="secondary">
                {teacher.name}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => toggleTeacher(id)}
                />
              </Badge>
            ) : null;
          })}
        </div>
      )}

      <div className="h-[200px] overflow-y-auto border rounded-md grid md:grid-cols-3 gap-2 ">
        {isLoading ? (
          <div className="px-4 py-2 text-amber-900">جاري التحميل...</div>
        ) : filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <div
              key={`option-${teacher.id}`}
              className={cn(
                "px-4 py-2 cursor-pointer dark:hover:bg-slate-800 hover:bg-slate-100 flex gap-2 items-center",
                selectedIds.includes(teacher.id)
                  ? "bg-slate-100 dark:bg-slate-800"
                  : ""
              )}
              onClick={() => toggleTeacher(teacher.id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(teacher.id)}
                readOnly
                className="mr-2"
              />
              <span>{teacher.name}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-2 text-gray-500">
            لم يتم العثور على معلمين
          </div>
        )}
      </div>
    </div>
  );
};

export function UpdateCourseForm({
  setDropdownOpen,
  setOpen,
  course,
}: UpdateCourseFormProps) {
  const [state, formAction] = useActionState(updateCourse, { message: "" });
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof courseUpdateSchema>>({
    resolver: zodResolver(courseUpdateSchema),
    defaultValues: {
      course_id: String(course.id),
      course_name: course.name,
      teacher_ids: [],
    },
  });

  useEffect(() => {
    const teachersByCourse = async () => {
      try {
        const response = await authFetch(
          `/courses/api/teachersByCourse/${course.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-cache",
          }
        );
        const data = await response.json();

        form.setValue("teacher_ids", data);
      } catch (error) {
        console.error("Error fetching teachers for course:", error);
      }
    };
    if (course) {
      teachersByCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({ title: "تم تحديث الدرس بنجاح", variant: "success" });
        const timer = setTimeout(() => {
          setOpen(false);
          setDropdownOpen(false);
          redirect("/courses");
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        toast({ title: state.message, variant: "destructive" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.message]);

  const handleSubmit = () => {
    const formData = new FormData(formRef.current!);
    formData.append("course_id", course.id);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {isPending && <p>الرجاء الانتظار لحظة ...</p>}

      {state?.issues && (
        <div className="text-red-500">
          <ul>
            {state.issues.map((issue) => (
              <li key={issue} className="flex gap-1">
                <X fill="red" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Form {...form}>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="rounded-lg grid grid-cols-[30%_70%]  gap-4 p-6 "
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="course_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>إسم الدرس</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل إسم الدرس" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit">
              {isPending ? "جاري المعالجة..." : "تحديث"}
            </Button>
          </div>

          <FormField
            control={form.control}
            name="teacher_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المعلمون</FormLabel>
                <FormControl>
                  <TeacherSelector
                    selectedIds={field.value || []} // ensure it's always an array
                    onChange={(ids) =>
                      form.setValue("teacher_ids", ids, {
                        shouldValidate: true,
                      })
                    }
                  />
                </FormControl>
                {form.getValues("teacher_ids") &&
                  field.value.map((id) => (
                    <input
                      key={`hidden-${id}`}
                      type="hidden"
                      name="teacher_ids"
                      value={id}
                    />
                  ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
