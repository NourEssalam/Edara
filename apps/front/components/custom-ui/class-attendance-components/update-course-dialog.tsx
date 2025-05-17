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

import { UpdateCourseForm } from "./update-course-form";
import { CoursesData } from "@/app/(dashboard)/(class-attendance)/courses/courses-list/columns";
interface ChildProps {
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function UpdateCourseDialog({
  course,
  setDropdownOpen,
}: { course: CoursesData } & ChildProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">تحديث بيانات الدرس</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className="max-w-[425] md:max-w-[1000px] overflow-y-auto max-h-[90vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>تحديث بيانات الدرس</DialogTitle>
          <DialogDescription>
            قم بإدخال بيانات الدرس، ثم اضغط على حفظ لإتمام العملية.
          </DialogDescription>
        </DialogHeader>

        <UpdateCourseForm
          setOpen={setOpen}
          course={course}
          setDropdownOpen={setDropdownOpen}
        />

        <DialogFooter>
          {/* <Button type="submit">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
