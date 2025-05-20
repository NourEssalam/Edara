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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { classCreationSchema } from "@/form-schemas/class-attendance";
import { createClass } from "@/app/(dashboard)/(class-attendance)/classes/actions/createClass";

interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateClassForm({ setOpen }: ChildProps) {
  const [state, formAction] = useActionState(createClass, {
    message: "",
  });
  const [fileKey, setFileKey] = useState(Date.now());
  const [file, setFile] = useState<File | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof classCreationSchema>>({
    resolver: zodResolver(classCreationSchema),
    defaultValues: {
      class_name: "",
    },
  });

  const resetForm = () => {
    setFileKey(Date.now());
    setFormSubmitted(false);
  };

  useEffect(() => {
    if (state?.message && state.message !== "") {
      if (state.message.includes("success")) {
        toast({
          title: "تم إنشاء القسم بنجاح",
          variant: "success",
        });
        const timer = setTimeout(() => {
          setOpen(false);
          redirect("/classes");
        }, 1000);
        return () => clearTimeout(timer);
      } else if (state.message.includes("القسم موجود بالفعل")) {
        toast({
          title: state.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
        resetForm();
      }
      setFormSubmitted(false);
    }
  }, [state?.message, toast, setOpen, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    form.setValue("file", selectedFile as any, { shouldValidate: true });
  };

  const handleSubmit = () => {
    if (!file) {
      toast({
        title: "الرجاء تحديد ملف",
        variant: "destructive",
      });
      return;
    }

    setFormSubmitted(true);

    startTransition(() => {
      const formData = new FormData(formRef.current!);
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {isPending && <p>Please wait a moment ...</p>}

      {state?.message !== "" && !state.issues && (
        <p
          className={
            state.message.includes("success")
              ? "text-green-500 text-xl"
              : "text-red-500"
          }
        >
          {state.message.includes("success")
            ? "تم إنشاء القسم بنجاح"
            : state.message}
        </p>
      )}

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
          onSubmit={form.handleSubmit(handleSubmit)}
          className="rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
        >
          <FormField
            control={form.control}
            name="class_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>إسم القسم</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل إسم القسم" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>استيراد قائمة الطلبة (بصيغة CSV/EXCEL)</FormLabel>
                <FormControl>
                  <Input
                    key={fileKey}
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    name="file"
                    onChange={handleFileChange}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit" className="md:col-span-2">
            {isPending ? "جاري المعالجة..." : "حفظ"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
