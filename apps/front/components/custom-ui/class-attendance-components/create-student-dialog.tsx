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
import { CreateStudentForm } from "./create-student-form";

export function CreateStudentDialog({ class_id }: { class_id: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">إضافة طالب</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className="max-w-[425px] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>إنشاء طالب جديد</DialogTitle>
          <DialogDescription>
            قم بإدخال بيانات الطالب الجديد، ثم اضغط على حفظ لإتمام العملية.
          </DialogDescription>
        </DialogHeader>

        <CreateStudentForm setOpen={setOpen} class_id={class_id} />
      </DialogContent>
    </Dialog>
  );
}
