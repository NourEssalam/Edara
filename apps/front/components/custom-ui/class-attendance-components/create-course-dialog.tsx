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
import { CreateCourseForm } from "./create-course-form";

export function CreateCourseDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">إضافة درس</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className=" max-w-[425] md:max-w-[850px] overflow-scroll max-h-[90vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>إنشاء درس جديد</DialogTitle>
          <DialogDescription>
            قم بإدخال بيانات الدرس الجديد، ثم اضغط على حفظ لإتمام العملية.
          </DialogDescription>
        </DialogHeader>

        <CreateCourseForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
