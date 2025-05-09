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

// import { CreateUserForm } from "./create-user-form";
import { useState } from "react";
import { CreateClassForm } from "./create-class-form";

export function CreateClassDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">إضافة قسم</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className=" max-w-[425] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>إنشاء قسم جديد</DialogTitle>
          <DialogDescription>
            قم بإدخال بيانات القسم الجديد، ثم اضغط على حفظ لإتمام العملية.
          </DialogDescription>
        </DialogHeader>

        <CreateClassForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
