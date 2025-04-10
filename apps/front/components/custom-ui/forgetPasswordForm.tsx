"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useActionState,
  useTransition,
  useRef,
  useState,
  useEffect,
} from "react";
import { z } from "zod";
import { forgotPasswordSchema } from "@/form-shema/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { onSubmitAction } from "@/app/(auth)/actions/forgot-password";
import { X } from "lucide-react";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(onSubmitAction, {
    message: "",
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (state?.message && state.message.includes("ok")) {
      setSent(true);
      console.log(state.message);
    }
  }, [state]);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  return !sent ? (
    <div className="flex flex-col gap-2 dark:bg-gray-900 dark:text-white">
      {isPending && <p>Please wait a moment ...</p>}
      {state?.message !== "" &&
        !state.issues &&
        !sent &&
        (state.message.includes("not found") ? (
          <p className="text-red-500">هذا البريد الإلكتروني غير مسجل</p>
        ) : (
          <p className="text-red-500">
            يرجى التحقق من اتصالك بالإنترنت وحاول مرة أخرى
          </p>
        ))}
      {state?.issues && (
        <div className="text-red-500">
          <ul>
            {state.issues.map((issue, i) => (
              <li key={i} className="flex gap-1">
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
            startTransition(() => {
              formAction(new FormData(formRef.current!));
            });
          })}
          className="space-y-4 border p-6 rounded-lg flex flex-col gap-1 bg-amber-200 dark:bg-gray-800 dark:border-gray-700"
          dir="rtl"
        >
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

          <Button className="w-full" disabled={isPending} type="submit">
            إرسال
          </Button>
          <Button
            className="w-full bg-white text-black hover:bg-white/80"
            disabled={isPending}
            asChild
          >
            <Link href="/login">العودة إلى صفحة تسجيل الدخول</Link>
          </Button>
        </form>
      </Form>
    </div>
  ) : (
    <div className="flex flex-col gap-4 dark:bg-gray-900 dark:text-white leading-7">
      <h3 className="text-2xl">تم إرسال البريد الإلكتروني</h3>
      <p>
        إذا كان عنوان البريد الإلكتروني{" "}
        <em className="font-bold text-amber-900">{state?.email}</em> مرتبطًا
        بحساب، فستتلقى قريبًا تعليمات لإعادة تعيين كلمة المرور. يرجى التحقق من
        مجلد الرسائل غير المرغوب فيها أو البريد العشوائي إذا لم تجد الرسالة في
        صندوق الوارد.
      </p>
      <Link className="text-sky-700 underline" href="/login">
        العودة إلى صفحة تسجيل الدخول
      </Link>
    </div>
  );
}
