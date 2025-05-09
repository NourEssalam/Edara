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
import { ClassData } from "@/app/(dashboard)/(class-attendance)/classes/classes-list/columns";
import { DeleteClassForm } from "./delete-class-form";
interface ChildProps {
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function DeleteClassDialog({
  classe,
  setDropdownOpen,
}: { classe: ClassData } & ChildProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">حذف قسم</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className=" max-w-[425] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>حذف قسم</DialogTitle>
          <DialogDescription>
            يرجى كتابة اسم القسم للتأكيد على الحذف
          </DialogDescription>
        </DialogHeader>

        <DeleteClassForm
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
