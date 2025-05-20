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
        <Button variant="outline">Create course session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-8 ">
        <DialogHeader>
          <DialogTitle>Create course session</DialogTitle>
          <DialogDescription>
            After creating a course session, you will be redirected to the
            course session page with students list
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
