"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useTransition, useRef, useEffect } from "react";
import { z } from "zod";
import { DeleteUserFormSchema } from "@/form-schemas/users-management";
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

import { deleteUser } from "@/app/(dashboard)/users-management/actions/deleteUser";
import { UserData } from "@/app/(dashboard)/users-management/users-list/columns";
import { redirect } from "next/navigation";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteUserForm({
  user,
  setOpen,
  setDropdownOpen,
}: { user: UserData } & ChildProps) {
  const [state, formAction] = useActionState(deleteUser, {
    message: "",
  });
  const id = String(user.id);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof DeleteUserFormSchema>>({
    resolver: zodResolver(DeleteUserFormSchema),
    defaultValues: {
      userId: id,
      full_name: user.full_name,
      confirm_full_name: "",
    },
  });

  // Add this near your other hooks
  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم حذف المستخدم بنجاح",
          variant: "success",
        });
        // Redirect after delay
        const timer = setTimeout(() => {
          setOpen(false);
          setDropdownOpen(false);
          redirect("/users-management");
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
            const formData = new FormData(formRef.current!);
            // Add the user ID to the form data
            formData.append("userId", id);
            formData.append("full_name", user.full_name);

            startTransition(() => {
              formAction(formData);
            });
          })}
          className="rounded-lg  flex flex-col gap-4 p-6 "
        >
          <p>{user.full_name}</p>
          <FormField
            control={form.control}
            name="confirm_full_name"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>الاسم الكامل</FormLabel> */}
                <FormControl>
                  <Input
                    placeholder="كتابة اسم المستخدم"
                    // placeholder={user.full_name}
                    {...field}
                  />
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
