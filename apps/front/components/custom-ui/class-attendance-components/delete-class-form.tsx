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
import { ClassData } from "@/app/(dashboard)/(class-attendance)/classes/classes-list/columns";
import { classDeleteSchema } from "@/form-schemas/class-attendance";
import { deleteClass } from "@/app/(dashboard)/(class-attendance)/classes/actions/deleteClass";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteClassForm({
  classe,
  setOpen,
  setDropdownOpen,
}: { classe: ClassData } & ChildProps) {
  const [state, formAction] = useActionState(deleteClass, {
    message: "",
  });
  const id = String(classe.id);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof classDeleteSchema>>({
    resolver: zodResolver(classDeleteSchema),
    defaultValues: {
      classId: id,
      class_name: classe.name,
      confirm_class_name: "",
    },
  });

  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم حذف القسم بنجاح",
          variant: "success",
        });
        const timer = setTimeout(() => {
          setOpen(false);
          setDropdownOpen(false);
          redirect("/classes");
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
    <div className="flex flex-col gap-2 ">
      {isPending && <p>يرجى الانتظار قليلاً ...</p>}
      {state?.message !== "" &&
        !state.issues &&
        (state.message.includes("success") ? (
          <p className="text-green-500 text-xl">تم حذف القسم بنجاح</p>
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
            formData.append("classId", id);
            formData.append("class_name", classe.name);

            startTransition(() => {
              formAction(formData);
            });
          })}
          className="rounded-lg flex flex-col gap-4 p-6"
        >
          <p>{classe.name}</p>
          <FormField
            control={form.control}
            name="confirm_class_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="اكتب اسم القسم للتأكيد" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant={"destructive"} disabled={isPending} type="submit">
            حذف
          </Button>
        </form>
      </Form>
    </div>
  );
}
