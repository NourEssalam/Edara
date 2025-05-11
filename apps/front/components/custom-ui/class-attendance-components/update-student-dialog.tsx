"use client";

import { StudentData } from "@/app/(dashboard)/(class-attendance)/classes/[id]/studetnts-list/columns";
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
import { UpdateStudentForm } from "./update-student-form";

interface ChildProps {
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdateStudentDialog({
  student,
  setDropdownOpen,
}: { student: StudentData } & ChildProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">تحديث بيانات الطالب</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className="max-w-[425] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>تحديث بيانات الطالب</DialogTitle>
          <DialogDescription>
            قم بإدخال بيانات الطالب، ثم اضغط على حفظ لإتمام العملية.
          </DialogDescription>
        </DialogHeader>

        <UpdateStudentForm
          student={student}
          setOpen={setOpen}
          setDropdownOpen={setDropdownOpen}
        />
        <DialogFooter>{/* Optional footer actions */}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
