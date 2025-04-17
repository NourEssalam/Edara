"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useTransition, useRef, useEffect } from "react";
import { z } from "zod";
import { updateUserSchemaByAdmin } from "@/form-schemas/users-management";
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
import { UserRole, UserStatus } from "@repo/shared-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { updateUser } from "@/app/(dashboard)/users-management/actions/update-user";
import { UserData } from "@/app/(dashboard)/users-management/users-list/columns";
import { redirect } from "next/navigation";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdateUserForm({
  user,
  setOpen,
  setDropdownOpen,
}: { user: UserData } & ChildProps) {
  const [state, formAction] = useActionState(updateUser, {
    message: "",
  });
  const id = String(user.id);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof updateUserSchemaByAdmin>>({
    resolver: zodResolver(updateUserSchemaByAdmin),
    defaultValues: {
      userId: id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
      // profile_picture_url: "",
    },
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
            startTransition(() => {
              formAction(formData);
            });
            if (state.message.includes("success")) {
              // form.reset();
            }
          })}
          className="rounded-lg  grid grid-cols-1 md:grid-cols-2 gap-4 p-6 "
        >
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الكامل</FormLabel>
                <FormControl>
                  <Input
                    placeholder="أدخل اسمك الكامل"
                    // placeholder={user.full_name}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل بريدك الإلكتروني" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>صلاحيات المستخدم</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  name="role"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="صلاحية المستخدم" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.SUPER_ADMIN}>
                      مشرف عام
                    </SelectItem>
                    <SelectItem value={UserRole.LEAVE_ADMIN}>
                      مسؤول الإجازات
                    </SelectItem>
                    <SelectItem value={UserRole.WORK_CERTIFICATION_ADMIN}>
                      مسؤول شهادات العمل
                    </SelectItem>
                    <SelectItem value={UserRole.CLASS_ATTENDANCE_ADMIN}>
                      مسؤول حضور الطلاب في الفصل
                    </SelectItem>
                    <SelectItem value={UserRole.TEACHER}>أستاذ</SelectItem>
                    <SelectItem value={UserRole.GENERAL_STAFF}>موظف</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة المستخدم</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  name="status"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر حالة المستخدم" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserStatus.ACTIVE}>نشط</SelectItem>
                    <SelectItem value={UserStatus.INACTIVE}>غير نشط</SelectItem>
                    <SelectItem value={UserStatus.SUSPENDED}>معلق</SelectItem>
                  </SelectContent>
                </Select>
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
