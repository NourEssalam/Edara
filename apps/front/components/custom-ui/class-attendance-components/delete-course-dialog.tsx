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
import { CoursesData } from "@/app/(dashboard)/(class-attendance)/courses/courses-list/columns";
import { DeleteCourseForm } from "./delete-course-form";

interface ChildProps {
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteCourseDialog({
  course,
  setDropdownOpen,
}: { course: CoursesData } & ChildProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">حذف درس</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className="max-w-[425px] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>حذف درس</DialogTitle>
          <DialogDescription>
            يرجى كتابة اسم الدرس للتأكيد على الحذف
          </DialogDescription>
        </DialogHeader>

        <DeleteCourseForm
          course={course}
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
