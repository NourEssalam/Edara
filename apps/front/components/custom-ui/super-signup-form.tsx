"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useTransition, useRef, useEffect } from "react";
import { z } from "zod";
import { signUpSchema } from "@/form-schemas/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { onSubmitAction } from "@/app/(auth)/actions/setup";
import { redirect } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";

export function SuperSignupForm() {
  const [state, formAction] = useActionState(onSubmitAction, {
    message: "",
  });

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      matricule: "",
      cin: "",
    },
  });

  // Add this near your other hooks
  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم إنشاء حساب المدير العام بنجاح. يجب عليك تسجيل الدخول الآن",
          variant: "success",
        });

        // Redirect after delay
        const timer = setTimeout(() => {
          redirect("/login");
        }, 2000);

        return () => clearTimeout(timer); // Cleanup timeout if component unmounts
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state?.message, toast]);

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        {isPending && <p>Please wait a moment ...</p>}
        {state?.message !== "" &&
          !state.issues &&
          (state.message.includes("success") ? (
            <p className="text-green-500 text-xl">
              تم إنشاء حساب المدير العام بنجاح. يجب عليك تسجيل الدخول الآن
            </p>
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
              startTransition(() => {
                formAction(new FormData(formRef.current!));
              });
            })}
            className="bg-amber-200 rounded-lg border border-amber-500 p-4 sm:p-6 flex flex-col gap-4"
          >
            {/* Scrollable area for inputs */}
            <ScrollArea
              dir="rtl"
              className="max-h-[300px] p-4 bg-amber-50 rounded "
            >
              <div className="flex flex-col gap-4 w-[95%]">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسمك الكامل" {...field} />
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
                  name="cin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم بطاقة التعريف</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل رقم بطاقة التعريف"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="matricule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المعرف الوحيد</FormLabel>
                      <FormControl>
                        <Input placeholder="المعرف الوحيد" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="أدخل كلمة المرور"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تأكيد كلمة المرور</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="أعد إدخال كلمة المرور"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <Button disabled={isPending} type="submit" className="w-full">
              إرسال
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
