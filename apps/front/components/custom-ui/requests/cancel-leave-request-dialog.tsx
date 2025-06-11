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

import { useState } from "react";
import { CancelLeaveForm } from "./cancel-leave-form";
interface ChildProps {
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function LeaveCancelDialog({
  data,
  setDropdownOpen,
}: { data: LeaveRequestWithPeriods } & ChildProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">إلغاء الطلب</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className=" max-w-[425] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>إلغاء الطلب</DialogTitle>
          <DialogDescription>
            يرجى كتابة اسم المستخدم للتأكيد على الإلغاء
          </DialogDescription>
        </DialogHeader>

        <CancelLeaveForm
          data={data}
          setOpen={setOpen}
          setDropdownOpen={setDropdownOpen}
        />
        <DialogFooter>
          {/* <Button type="submit">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
