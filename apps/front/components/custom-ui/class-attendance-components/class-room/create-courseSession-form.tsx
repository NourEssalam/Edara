"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { arTN } from "date-fns/locale";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, X } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CourseSessionSchema } from "@/form-schemas/class-attendance";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { createCourseSession } from "@/app/(dashboard)/(class-attendance)/class-room/actions/createCourseSession";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateCourseSessionForm({
  setOpen,
  classId,
  courseId,
}: ChildProps & { classId: string; courseId: string }) {
  const [state, formAction] = useActionState(createCourseSession, {
    message: "",
  });

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof CourseSessionSchema>>({
    resolver: zodResolver(CourseSessionSchema),
    defaultValues: {
      class_id: classId,
      course_id: courseId,
      date: new Date(),
      topic: "",
    },
  });

  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        const timer = setTimeout(() => {
          setOpen(false);
          if (state?.res) {
            router.push(`/class-room/${state.res.class_id}/${state.res.id}`);
          }
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state?.message, toast, setOpen, form, router, state?.res]);

  const handleSubmit = () => {
    const formData = new FormData(formRef.current!);

    formData.append("class_id", classId);
    formData.append("course_id", courseId);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <p>{JSON.stringify(state.res)}</p>

      {isPending && <p>يرجى الانتظار ...</p>}

      {state?.message !== "" && (
        <p
          className={
            state.message.includes("success")
              ? "text-green-500 text-xl"
              : "text-red-500"
          }
        >
          {state.message.includes("success")
            ? "تم إنشاء حصة الدرس بنجاح"
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
          className="rounded-lg flex flex-col  gap-4 p-6"
        >
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الموضوع</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Course session date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  name={field.name}
                  value={field.value ? field.value.toISOString() : ""}
                />
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
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
