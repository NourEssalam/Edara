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
import { UserInfoEssentials } from "@/form-schemas/users-management";
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
import { editProfileInfo } from "@/app/(dashboard)/profile/actions/editProfileInfo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EssentialsInfoUserForm({ data }: any) {
  const [state, formAction] = useActionState(editProfileInfo, {
    message: "",
  });
  const [formDisabled, setFormDisabled] = useState(true);
  const id = String(data.id);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof UserInfoEssentials>>({
    resolver: zodResolver(UserInfoEssentials),
    defaultValues: {
      userId: id,
      full_name: data.full_name,
      email: data.email,
    },
  });

  // Add this near your other hooks
  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم التعديل بنجاح",
          variant: "success",
        });
        setFormDisabled(true);
        const timer = setTimeout(() => {
          state.message = "";
        }, 2000);

        return () => clearTimeout(timer);
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state, state.message, toast]);

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
            const formData = new FormData(formRef.current!);
            // const id = String(data.id);
            // Add the user ID to the form data
            formData.append("userId", id);
            startTransition(() => {
              formAction(formData);
            });
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
                    {...field}
                    disabled={formDisabled}
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
                  <Input
                    placeholder="أدخل بريدك الإلكتروني"
                    {...field}
                    disabled={formDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            className={formDisabled === true ? "hidden" : ""}
          >
            حفظ
          </Button>
          <Button
            // disabled={isPending}
            type="reset"
            className={formDisabled === true || isPending ? "hidden" : ""}
            variant={"destructive"}
            onClick={(e) => {
              e.preventDefault();
              form.reset();
              setFormDisabled(true);
            }}
          >
            إلغاء
          </Button>
          <Button
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              setFormDisabled(false);
            }}
            className={
              formDisabled === false
                ? "hidden"
                : "bg-sky-700 text-white hover:text-black"
            }
          >
            تعديل
          </Button>
        </form>
      </Form>
    </div>
  );
}
