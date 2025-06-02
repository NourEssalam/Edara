"use client";
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

import { LeaveRequestWithPeriods } from "@/app/(dashboard)/(leave-management)/leave-request-list/columns";
import { UpdateLeaveRequestForm } from "./leave-update-form";
import { UserRole } from "@repo/shared-types";
interface ChildProps {
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function UpdateLeaveDialog({
  data,
  setDropdownOpen,
}: { data: LeaveRequestWithPeriods } & ChildProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">تحديث طلب عطلة</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className=" max-w-[425] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>تحديث طلب عطلة</DialogTitle>
          <DialogDescription>
            قم بتحديث بيانات طلب العطلة، ثم اضغط على حفظ لإتمام العملية.
          </DialogDescription>
        </DialogHeader>

        <UpdateLeaveRequestForm
          data={data}
          setOpen={setOpen}
          setDropdownOpen={setDropdownOpen}
        />
        <DialogFooter>
          {/* <Button type="submit">حفظ التغييرات</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
