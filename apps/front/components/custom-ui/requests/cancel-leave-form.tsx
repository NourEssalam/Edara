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
import { LeaveRequestWithPeriods } from "@/app/(dashboard)/(leave-management)/leave-request-list/columns";
import { CancelRequestFormSchema } from "@/form-schemas/leave-wc";
import { cancelLeave } from "@/app/(dashboard)/(leave-management)/actions/cancelLeave";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CancelLeaveForm({
  data,
  setOpen,
  setDropdownOpen,
}: { data: LeaveRequestWithPeriods } & ChildProps) {
  const [state, formAction] = useActionState(cancelLeave, {
    message: "",
  });
  const user_id = String(data.userId);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof CancelRequestFormSchema>>({
    resolver: zodResolver(CancelRequestFormSchema),
    defaultValues: {
      userId: user_id,
      requestId: data.id,
      full_name: data.name,
      confirm_full_name: "",
    },
  });

  // Add this near your other hooks
  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم إلغاء الطلب بنجاح",
          variant: "success",
        });
        // Redirect after delay
        const timer = setTimeout(() => {
          setOpen(false);
          setDropdownOpen(false);
          redirect("/leave-request-list");
        }, 500);

        return () => clearTimeout(timer); // Cleanup timeout if component unmounts
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
      {isPending && <p>الرجاء الانتظار لحظة ...</p>}
      {state?.message !== "" &&
        !state.issues &&
        (state.message.includes("success") ? (
          <p className="text-green-500 text-xl">تم إلغاء الطلب بنجاح</p>
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
            const formData = new FormData(formRef.current!);
            formData.append("userId", user_id);
            formData.append("requestId", data.id);
            formData.append("full_name", data.name);
            startTransition(() => {
              formAction(formData);
            });
          })}
          className="rounded-lg  flex flex-col gap-4 p-6 "
        >
          <p>{data.name}</p>
          <FormField
            control={form.control}
            name="confirm_full_name"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>الاسم الكامل</FormLabel> */}
                <FormControl>
                  <Input
                    placeholder="كتابة اسم المستخدم"
                    // placeholder={data.full_name}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant={"destructive"} disabled={isPending} type="submit">
            إلغاء
          </Button>
        </form>
      </Form>
    </div>
  );
}
