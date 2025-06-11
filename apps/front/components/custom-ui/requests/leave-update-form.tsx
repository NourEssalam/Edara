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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { updateLeaveRequestSchema } from "@/form-schemas/leave-wc";
import { arTN } from "date-fns/locale";

import { CalendarIcon, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaveType } from "@repo/shared-types";
import { LeaveRequestWithPeriods } from "@/app/(dashboard)/(leave-management)/leave-request-list/columns";
import { updateLeaveRequest } from "@/app/(dashboard)/(leave-management)/actions/updateLeaveRequest";
import { redirect } from "next/navigation";
import { PopoverClose } from "@radix-ui/react-popover";
interface ChildProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdateLeaveRequestForm({
  data,
  setOpen,
  setDropdownOpen,
}: { data: LeaveRequestWithPeriods } & ChildProps) {
  const [state, formAction] = useActionState(updateLeaveRequest, {
    message: "",
  });

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const user_id = String(data.userId);

  const form = useForm<z.infer<typeof updateLeaveRequestSchema>>({
    resolver: zodResolver(updateLeaveRequestSchema),
    defaultValues: {
      requestId: data.id,
      userId: user_id,
      leaveType: data.leaveType, // or a valid enum value from LeaveType
      matricule: data.matricule,
      name: data.name,
      grade: data.grade,
      jobPlan: data.jobPlan || "", // only used when userRole === SUPER_ADMIN
      benefitText: data.benefitText,
      durationFrom: new Date(data.durationFrom),
      durationTo: new Date(data.durationTo),
      leaveYear: data.leaveYear, // or 0 if you want empty number
      leaveAddress: data.leaveAddress,
      postalCode: data.postalCode,
      phone: data.phone,
      attachedDocs: data.attachedDocs || "",
    },
  });

  useEffect(() => {
    if (state?.message && state.message !== "") {
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (state.message.includes("success")) {
        toast({
          title: "تم تحديث طلب الإجازة بنجاح",
          variant: "success",
        });
        const timer = setTimeout(() => {
          setOpen(false);
          setDropdownOpen(false);
          redirect("/leave-request-list");
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        toast({
          title: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state.message, state.timestamp, toast, setOpen, setDropdownOpen]);

  return (
    <div className="flex flex-col gap-2">
      {isPending && <p>Please wait a moment ...</p>}

      {state?.message !== "" &&
        !state.issues &&
        (state.message.includes("success") ? (
          <p className="text-green-500 text-xl">تم تحديث طلب العطلة بنجاح</p>
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
          className="rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
        >
          <input type="hidden" name="userId" value={user_id} />
          <input type="hidden" name="requestId" value={data.id} />
          <input type="hidden" name="jobPlan" value={data.jobPlan || ""} />

          <FormField
            control={form.control}
            name="leaveType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع العطلة</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  name="leaveType"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع العطلة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(LeaveType).map((leaveType) => (
                      <SelectItem key={leaveType} value={leaveType}>
                        {leaveType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          {/* name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم و اللقب</FormLabel>
                <FormControl>
                  <Input placeholder="الاسم و اللقب" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* grade */}
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الرتبة</FormLabel>
                <FormControl>
                  <Input placeholder="الرتبة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Job Plan */}

          {/* <FormField
              control={form.control}
              name="jobPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الخطة الوظيفية</FormLabel>
                  <FormControl>
                    <Input placeholder="الخطة الوظيفية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            // Register jobPlan as empty string for others so it's present in form data
            <input type="hidden" {...form.register("jobPlan")} value="" />
          )} */}

          {/* benefitText */}
          <FormField
            control={form.control}
            name="benefitText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المصلحة</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="durationFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>من تاريخ</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd MMMM yyyy", { locale: arTN })
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      // disabled={(date) =>
                      //   date > new Date() || date < new Date("1900-01-01")
                      // }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  name={field.name}
                  value={field.value ? new Date(field.value).toISOString() : ""}
                />

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="durationTo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>إلى تاريخ</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd MMMM yyyy", { locale: arTN })
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      // disabled={(date) =>
                      //   date > new Date() || date < new Date("1900-01-01")
                      // }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  name={field.name}
                  value={field.value ? new Date(field.value).toISOString() : ""}
                />

                <FormMessage />
              </FormItem>
            )}
          />
          {/* leave year  */}
          <FormField
            control={form.control}
            name="leaveYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>بعنوان سنة</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* leaveAdress */}
          <FormField
            control={form.control}
            name="leaveAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عنوان المقر السكني طيلة العطل</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*  postalCode*/}
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الرقم البريدي</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input {...field} dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* attachedDocs text area */}
          <FormField
            control={form.control}
            name="attachedDocs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوثائق المصاحبة</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
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
