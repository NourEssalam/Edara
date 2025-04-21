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
import { ChangePasswordSchema } from "@/form-schemas/users-management";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, Eye, EyeOff } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { changePassword } from "@/app/(dashboard)/profile/actions/changePassword";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChangePasswordUserForm({ data }: any) {
  const [state, formAction] = useActionState(changePassword, {
    message: "",
  });
  const id = String(data.id);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  // Add states for password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State to track if any input has been modified
  const [isFormModified, setIsFormModified] = useState(false);

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      userId: id,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Check if form has been modified
  const handleInputChange = () => {
    setIsFormModified(true);
  };

  // Reset form modification state after successful submission
  const resetForm = () => {
    form.reset();
    setIsFormModified(false);
  };

  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم التعديل بنجاح",
          variant: "success",
        });
        resetForm(); // Reset form after successful submission
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, state.message, toast]);

  return (
    <div className="flex flex-col gap-2">
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
      )}
      <Form {...form}>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={form.handleSubmit(() => {
            const formData = new FormData(formRef.current!);
            formData.append("userId", id);
            startTransition(() => {
              formAction(formData);
            });
          })}
          className="md:w-1/2 rounded-lg grid gap-4 p-6"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور القديمة</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="كلمة المرور القديمة"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
                    />
                    <button
                      type="button"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور الجديدة</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="كلمة المرور الجديدة"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
                    />
                    <button
                      type="button"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاكيد كلمة المرور</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="تاكيد كلمة المرور"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
                    />
                    <button
                      type="button"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit">
            حفظ
          </Button>

          {isFormModified && (
            <Button
              type="button"
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                resetForm();
                state.message = "";
              }}
              disabled={isPending}
            >
              إلغاء
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
