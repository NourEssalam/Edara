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
import { classCreationSchema } from "@/form-schemas/class-attendance";
import { createClass } from "@/app/(dashboard)/(class-attendance)/classes/actions/createClass";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateClassForm({ setOpen }: ChildProps) {
  const [state, formAction] = useActionState(createClass, {
    message: "",
  });
  const [fileKey, setFileKey] = useState(Date.now());

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof classCreationSchema>>({
    resolver: zodResolver(classCreationSchema),
  });

  // Add this near your other hooks
  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم إنشاء المستخدم بنجاح",
          variant: "success",
        });
        // Redirect after delay
        // const timer = setTimeout(() => {
        //   setOpen(false);
        //   redirect("/classes");
        // }, 1000);

        // return () => clearTimeout(timer); // Cleanup timeout if component unmounts
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state?.message, toast, setOpen]);

  return (
    <div className="flex flex-col gap-2 ">
      {isPending && <p>Please wait a moment ...</p>}
      {state?.message !== "" &&
        !state.issues &&
        (state.message.includes("success") ? (
          <p className="text-green-500 text-xl">تم إنشاء المستخدم بنجاح </p>
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
      )}{" "}
      <Form {...form}>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={form.handleSubmit(() => {
            console.log(form.getValues());
            startTransition(() => {
              formAction(new FormData(formRef.current!));
            });
            if (state.message.includes("success")) {
              // form.reset();
            }
          })}
          className="rounded-lg  grid grid-cols-1 md:grid-cols-2 gap-4 p-6 "
        >
          <FormField
            control={form.control}
            name="class_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel> إسم القسم </FormLabel>
                <FormControl>
                  <Input placeholder="أدخل إسم القسم" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, name } }) => (
              <FormItem>
                <FormLabel>استيراد قائمة الطلبة (بصيغة CSV/EXCEL)</FormLabel>
                <FormControl>
                  <Input
                    key={fileKey} // Force new input when needed
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    name="file"
                    onChange={(e) => {
                      onChange(e.target.files?.[0]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit">
            حفظ
          </Button>
        </form>
      </Form>
    </div>
  );
}
