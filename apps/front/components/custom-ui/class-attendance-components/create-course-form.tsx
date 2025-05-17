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
import { courseCreationSchema } from "@/form-schemas/class-attendance";
import { createCourse } from "@/app/(dashboard)/(class-attendance)/courses/actions/createCourse";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { authFetch } from "@/lib/authFetch";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Our simplified teacher selector component
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
          headers: {
            "Content-Type": "application/json",
          },
          cache: "force-cache",
          next: { revalidate: 3600 },
        });
        const data = await response.json();

        // Convert numeric IDs to strings if needed
        const formattedTeachers = data.map(
          (teacher: { id: number; name: string }) => ({
            id: String(teacher.id), // Ensure ID is a string
            name: teacher.name,
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
  }, []); // Empty dependency array means this runs once on mount

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTeacher = (teacherId: string) => {
    if (selectedIds.includes(teacherId)) {
      onChange(selectedIds.filter((id) => id !== teacherId));
    } else {
      onChange([...selectedIds, teacherId]);
    }
  };

  return (
    <div className="border rounded-md p-2 mt-1">
      {/* Search input */}
      <Input
        placeholder="ابحث عن معلم..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />

      {/* Selected teachers */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedIds.map((id) => {
            const teacher = teachers.find((t) => t.id === id);
            return teacher ? (
              <Badge key={id} variant="secondary">
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

      {/* Teacher list */}
      <div className="h-[200px] overflow-y-auto border rounded-md">
        {isLoading ? (
          <div className="px-4 py-2 text-amber-900">جاري التحميل...</div>
        ) : filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
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
                onChange={() => {}} // Controlled by the parent onClick
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

export function CreateCourseForm({ setOpen }: ChildProps) {
  const [state, formAction] = useActionState(createCourse, {
    message: "",
  });

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof courseCreationSchema>>({
    resolver: zodResolver(courseCreationSchema),
    defaultValues: {
      course_name: "",
      teacher_ids: [],
    },
  });

  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم إنشاء الدرس بنجاح",
          variant: "success",
        });
        const timer = setTimeout(() => {
          setOpen(false);
          redirect("/courses");
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state?.message, toast, setOpen, form]);

  const handleSubmit = () => {
    const formData = new FormData(formRef.current!);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {isPending && <p>Please wait a moment ...</p>}

      {state?.message !== "" && !state.issues && (
        <p
          className={
            state.message.includes("success")
              ? "text-green-500 text-xl"
              : "text-red-500"
          }
        >
          {state.message.includes("success")
            ? "تم إنشاء الدرس بنجاح"
            : state.message}
        </p>
      )}

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
          className="rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
        >
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

          <FormField
            control={form.control}
            name="teacher_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المعلمون</FormLabel>
                <FormControl>
                  <TeacherSelector
                    selectedIds={field.value}
                    onChange={(ids) =>
                      form.setValue("teacher_ids", ids, {
                        shouldValidate: true,
                      })
                    }
                  />
                </FormControl>

                {/* Hidden inputs for form submission */}
                {field.value.map((id) => (
                  <input key={id} type="hidden" name="teacher_ids" value={id} />
                ))}

                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit" className="md:col-span-2">
            {isPending ? "جاري المعالجة..." : "حفظ"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
