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

import { StudentData } from "@/app/(dashboard)/(class-attendance)/classes/[id]/studetnts-list/columns";
import { studentDeleteSchema } from "@/form-schemas/class-attendance";
import { deleteStudent } from "@/app/(dashboard)/(class-attendance)/classes/[id]/studetnts-list/actions/deleteStudent";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteStudentForm({
  student,
  setOpen,
  setDropdownOpen,
}: { student: StudentData } & ChildProps) {
  const [state, formAction] = useActionState(deleteStudent, {
    message: "",
  });
  const id = String(student.id);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof studentDeleteSchema>>({
    resolver: zodResolver(studentDeleteSchema),
    defaultValues: {
      studentId: id,
      cin: student.cin,
      confirm_cin: "",
    },
  });

  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم حذف الطالب بنجاح",
          variant: "success",
        });
        const timer = setTimeout(() => {
          setOpen(false);
          setDropdownOpen(false);
          redirect(`/classes/${student.class_id}`); // Update this path if needed
        }, 500);

        return () => clearTimeout(timer);
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state?.message, toast, setOpen, setDropdownOpen, student.class_id]);

  return (
    <div className="flex flex-col gap-2">
      {isPending && <p>يرجى الانتظار قليلاً ...</p>}

      {state?.message !== "" &&
        !state.issues &&
        (state.message.includes("success") ? (
          <p className="text-green-500 text-xl">تم حذف الطالب بنجاح</p>
        ) : (
          <p className="text-red-500">{state.message}</p>
        ))}

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
            formData.append("studentId", id);
            formData.append("cin", student.cin);

            startTransition(() => {
              formAction(formData);
            });
          })}
          className="rounded-lg flex flex-col gap-4 p-6"
        >
          <p>رقم بطاقة التعريف: {student.cin}</p>

          <FormField
            control={form.control}
            name="confirm_cin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="أدخل رقم بطاقة التعريف للتأكيد"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="destructive" disabled={isPending} type="submit">
            حذف الطالب
          </Button>
        </form>
      </Form>
    </div>
  );
}
