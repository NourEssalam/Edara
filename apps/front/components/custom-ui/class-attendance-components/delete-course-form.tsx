"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useTransition, useRef, useEffect } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

import { CoursesData } from "@/app/(dashboard)/(class-attendance)/courses/courses-list/columns";
import { courseDeleteSchema } from "@/form-schemas/class-attendance";
import { deleteCourse } from "@/app/(dashboard)/(class-attendance)/courses/actions/deleteCourse";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteCourseForm({
  course,
  setOpen,
  setDropdownOpen,
}: { course: CoursesData } & ChildProps) {
  const [state, formAction] = useActionState(deleteCourse, {
    message: "",
  });
  const id = String(course.id);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof courseDeleteSchema>>({
    resolver: zodResolver(courseDeleteSchema),
    defaultValues: {
      courseId: id,
      course_name: course.name,
      confirm_course_name: "",
    },
  });

  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم حذف الدرس بنجاح",
          variant: "success",
        });
        const timer = setTimeout(() => {
          setOpen(false);
          setDropdownOpen(false);
          redirect("/courses");
        }, 500);
        return () => clearTimeout(timer);
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state?.message, toast, setOpen, setDropdownOpen]);

  return (
    <div className="flex flex-col gap-2">
      {isPending && <p>يرجى الانتظار قليلاً ...</p>}

      {state?.message !== "" && !state.issues && (
        <p
          className={
            state.message.includes("success")
              ? "text-green-500 text-xl"
              : "text-red-500"
          }
        >
          {state.message.includes("success")
            ? "تم حذف الدرس بنجاح"
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
          onSubmit={form.handleSubmit(() => {
            const formData = new FormData(formRef.current!);
            formData.append("courseId", id);
            formData.append("course_name", course.name);

            startTransition(() => {
              formAction(formData);
            });
          })}
          className="rounded-lg flex flex-col gap-4 p-6"
        >
          <p>{course.name}</p>

          <FormField
            control={form.control}
            name="confirm_course_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="اكتب اسم الدرس للتأكيد" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="destructive" disabled={isPending} type="submit">
            حذف
          </Button>
        </form>
      </Form>
    </div>
  );
}
