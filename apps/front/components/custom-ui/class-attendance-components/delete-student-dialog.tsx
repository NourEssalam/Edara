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
import { StudentData } from "@/app/(dashboard)/(class-attendance)/classes/[id]/studetnts-list/columns";
import { DeleteStudentForm } from "./delete-student-form";

interface ChildProps {
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteStudentDialog({
  student,
  setDropdownOpen,
}: { student: StudentData } & ChildProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">حذف طالب</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className="max-w-[425px] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>حذف طالب</DialogTitle>
          <DialogDescription>
            يرجى إدخال رقم بطاقة تعريف الطالب للتأكيد على الحذف
          </DialogDescription>
        </DialogHeader>

        <DeleteStudentForm
          student={student}
          setOpen={setOpen}
          setDropdownOpen={setDropdownOpen}
        />
        <DialogFooter>{/* Optional action buttons */}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
