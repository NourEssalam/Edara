"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCourseSessionForm } from "./create-courseSession-form";
import { useState } from "react";

export function CreateCourseSessionDialog({
  classId,
  courseId,
}: {
  classId: string;
  courseId: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">إنشاء الحصة الأن</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-8 ">
        <DialogHeader>
          <DialogTitle>إنشاء حصة درس</DialogTitle>
          <DialogDescription>
            بعد إنشاء حصة الدرس، سيتم تحويلك إلى صفحة الحصة مع قائمة الطلبة
          </DialogDescription>
        </DialogHeader>

        <CreateCourseSessionForm
          setOpen={setOpen}
          classId={classId}
          courseId={courseId}
        />
        {/* form consopnent here  */}
      </DialogContent>
    </Dialog>
  );
}
