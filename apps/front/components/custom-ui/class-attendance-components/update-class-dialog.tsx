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

import { UpdateClassForm } from "./update-class-form";
import { ClassData } from "@/app/(dashboard)/(class-attendance)/classes/classes-list/columns";
interface ChildProps {
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function UpdateClassDialog({
  classe,
  setDropdownOpen,
}: { classe: ClassData } & ChildProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">تحديث بيانات القسم</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className=" max-w-[425] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>تحديث بيانات القسم</DialogTitle>
          <DialogDescription>
            قم بإدخال بيانات القسم، ثم اضغط على حفظ لإتمام العملية.
          </DialogDescription>
        </DialogHeader>

        <UpdateClassForm
          classe={classe}
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
