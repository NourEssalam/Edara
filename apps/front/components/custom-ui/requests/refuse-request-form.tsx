"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { rejectRequestSchema } from "@/form-schemas/leave-wc";

import { redirect } from "next/navigation";
import { X } from "lucide-react";
import { RequestIdentifier } from "@/types/request-types";
import { Textarea } from "@/components/ui/textarea";
import { refuseRequest } from "@/app/(dashboard)/(leave-management)/pending-leave-requests/[...id]/actions.ts/refuse";
interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RefuseRequestForm({
  requestIdentifier,
  setOpen,
}: { requestIdentifier: RequestIdentifier } & ChildProps) {
  const [state, formAction] = useActionState(refuseRequest, {
    message: "",
  });

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof rejectRequestSchema>>({
    resolver: zodResolver(rejectRequestSchema),
    defaultValues: {
      requestId: requestIdentifier.requestId,
      userId: requestIdentifier.userId,
      adminId: requestIdentifier.adminId,
      reason: "",
    },
  });

  // In your component
  const router = useRouter();
  useEffect(() => {
    if (state?.message && state.message !== "") {
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (state.message.includes("success")) {
        toast({
          title: "تم رفض الطلب",
          variant: "success",
        });
        const timer = setTimeout(() => {
          setOpen(false);

          router.replace("/pending-leave-requests/");
          router.refresh(); // Force refresh
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state.message, toast, setOpen, router]);

  return (
    <div className="flex flex-col gap-2">
      {isPending && <p>Please wait a moment ...</p>}

      {state?.message !== "" &&
        !state.issues &&
        (state.message.includes("success") ? (
          <p className="text-green-500 text-xl">تم رفض الطلب</p>
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
          className="rounded-lg grid grid-cols-1  gap-4 p-6"
        >
          <input type="hidden" name="userId" value={requestIdentifier.userId} />
          <input
            type="hidden"
            name="requestId"
            value={requestIdentifier.requestId}
          />
          <input
            type="hidden"
            name="adminId"
            value={requestIdentifier.adminId}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السبب</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="السبب" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit" className="md:col-span-2">
            تحديث الطلب
          </Button>
        </form>
      </Form>
    </div>
  );
}
