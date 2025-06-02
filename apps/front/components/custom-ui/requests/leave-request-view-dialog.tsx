"use client";
import { LeaveRequestWithPeriods } from "@/app/(dashboard)/(leave-management)/leave-request-list/columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { arTN } from "date-fns/locale/ar-TN";
import { useState } from "react";
interface ChildProps {
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function LeaveViewDialog({
  data,
  setDropdownOpen,
}: { data: LeaveRequestWithPeriods } & ChildProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setDropdownOpen(false); // Close dropdown when dialog closes
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">عرض تفاصيل العطلة</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className="max-w-[425px] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>تفاصيل العطلة</DialogTitle>
          <DialogDescription>
            يمكنك هنا عرض جميع تفاصيل طلب العطلة.
          </DialogDescription>
        </DialogHeader>

        {/* leave request details will go here */}
        <div className="px-4 py-2 space-y-2">
          <p>
            <strong>نوع العطلة:</strong> {data.leaveType}
          </p>
          <p>
            <strong>الفترة من:</strong>{" "}
            {format(data.durationFrom, "dd MMMM yyyy", { locale: arTN })}
          </p>
          <p>
            <strong>الفترة إلى:</strong>{" "}
            {format(data.durationTo, "dd MMMM yyyy", { locale: arTN })}
          </p>
          <p>
            <strong>السنة:</strong> {data.leaveYear}
          </p>
          <p>
            <strong>الحالة:</strong>{" "}
            {data.requestStatus === "APPROVED"
              ? "موافق عليه"
              : data.requestStatus === "REJECTED"
                ? "مرفوض"
                : data.requestStatus === "PENDING"
                  ? "قيد الانتظار"
                  : data.requestStatus === "CANCELED"
                    ? "ملغي"
                    : "غير معروف"}
          </p>
          <p>
            <strong>الاسم:</strong> {data.name}
          </p>
          <p>
            <strong>الرتبة:</strong> {data.grade}
          </p>
          <p>
            <strong>الوظيفة:</strong> {data.jobPlan || "غير محددة"}
          </p>
          <p>
            <strong>عنوان العطلة:</strong> {data.leaveAddress}
          </p>
          <p>
            <strong>الرمز البريدي:</strong> {data.postalCode}
          </p>
          <p>
            <strong>رقم الهاتف:</strong> {data.phone}
          </p>
          {data.attachedDocs && (
            <p>
              <strong>الوثائق المرفقة:</strong> {data.attachedDocs}
            </p>
          )}
        </div>

        <DialogFooter>{/* Optional action buttons can go here */}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
