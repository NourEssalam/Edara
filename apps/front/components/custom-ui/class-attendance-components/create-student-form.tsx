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
import { createStudent } from "@/app/(dashboard)/(class-attendance)/classes/[id]/studetnts-list/actions/createStudent";
import { studentCreationSchema } from "@/form-schemas/class-attendance";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateStudentForm({
  class_id,
  setOpen,
}: { class_id: string } & ChildProps) {
  const [state, formAction] = useActionState(createStudent, {
    message: "",
  });

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof studentCreationSchema>>({
    resolver: zodResolver(studentCreationSchema),
    defaultValues: {
      cin: "",
      first_name: "",
      last_name: "",
      class_id: class_id,
    },
  });

  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم إضافة الطلبة بنجاح",
          variant: "success",
        });
        const timer = setTimeout(() => {
          setOpen(false);
          redirect(`/classes/${class_id}`);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state?.message, toast, setOpen, form, class_id]);

  return (
    <div className="flex flex-col gap-2">
      {isPending && <p>الرجاء الانتظار قليلاً...</p>}

      {state?.message !== "" && !state.issues && (
        <p
          className={
            state.message.includes("success")
              ? "text-green-500 text-xl"
              : "text-red-500"
          }
        >
          {state.message.includes("success")
            ? "تم إضافة الطلبة بنجاح"
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
            const newFormData = new FormData(formRef.current!);
            newFormData.append("class_id", class_id);
            startTransition(() => {
              formAction(newFormData);
            });
          })}
          className="rounded-lg  grid grid-cols-1 md:grid-cols-2 gap-4 p-6 "
        >
          <FormField
            control={form.control}
            name="cin"
            render={() => (
              <FormItem>
                <FormLabel>رقم الهوية</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="رقم الهوية"
                    {...form.register("cin")}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="first_name"
            render={() => (
              <FormItem>
                <FormLabel>الاسم الشخصي</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="الاسم الاول"
                    {...form.register("first_name")}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={() => (
              <FormItem>
                <FormLabel>الاسم العائلي</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="الاسم الاخير"
                    {...form.register("last_name")}
                    disabled={isPending}
                  />
                </FormControl>
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
