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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { studentUpdateSchema } from "@/form-schemas/class-attendance";
import { StudentData } from "@/app/(dashboard)/(class-attendance)/classes/[id]/studetnts-list/columns";
import { updateStudent } from "@/app/(dashboard)/(class-attendance)/classes/[id]/studetnts-list/actions/updateStudent";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdateStudentForm({
  student,
  setOpen,
  setDropdownOpen,
}: { student: StudentData } & ChildProps) {
  const [state, formAction] = useActionState(updateStudent, {
    message: "",
  });
  const id = String(student.id);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof studentUpdateSchema>>({
    resolver: zodResolver(studentUpdateSchema),
    defaultValues: {
      studentId: id,
      cin: student.cin,
      first_name: student.first_name,
      last_name: student.last_name,
    },
  });

  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم تحديث القسم بنجاح",
          variant: "success",
        });
        const timer = setTimeout(() => {
          setOpen(false);
          setDropdownOpen(false);
          redirect(`/classes/${student.class_id}`);
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
    <div className="flex flex-col gap-2 ">
      {isPending && <p>يرجى الانتظار قليلاً ...</p>}
      {state?.message !== "" &&
        !state.issues &&
        (state.message.includes("success") ? (
          <p className="text-green-500 text-xl">تم تحديث القسم بنجاح</p>
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
            formData.append("studentId", id); // Still using "userId" in backend
            startTransition(() => {
              formAction(formData);
            });
          })}
          className="rounded-lg grid grid-cols-1 gap-4 p-6"
        >
          <FormField
            control={form.control}
            name="cin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهوية</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الاول</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الاخير</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            onClick={() => console.log(form.getValues())}
          >
            حفظ
          </Button>
        </form>
      </Form>
    </div>
  );
}
