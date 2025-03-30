"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useTransition, useRef, useEffect } from "react";
import { z } from "zod";
import { loginSchema } from "@/form-shema/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { onSubmitAction } from "@/app/(auth)/actions/login";
import { redirect } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export function LoginForm() {
  const [state, formAction] = useActionState(onSubmitAction, {
    message: "",
  });

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // Add this near your other hooks
  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: state.message,
          variant: "success",
        });

        // Redirect after delay
        const timer = setTimeout(() => {
          redirect("/");
        }, 1000);

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
    <div className="flex flex-col gap-2 dark:bg-gray-900 dark:text-white">
      {isPending && <p>Please wait a moment ...</p>}
      {state?.message !== "" &&
        !state.issues &&
        (state.message.includes("success") ? (
          <p className="text-green-500 text-xl">{state.message}</p>
        ) : (
          <p className="text-red-500">{state.message}</p>
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
            // Use startTransition when manually dispatching the action
            startTransition(() => {
              formAction(new FormData(formRef.current!));
            });
            if (state.message.includes("success")) {
              // form.reset();
            }
          })}
          className="space-y-4 border p-6 rounded-lg flex flex-col gap-1 bg-amber-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Link
            className="text-right text-sm underline"
            href={"forgot-password"}
          >
            Forgot password?
          </Link>
          <Button className="w-full" disabled={isPending} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
