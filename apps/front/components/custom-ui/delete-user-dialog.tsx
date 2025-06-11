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

import { useState } from "react";
import { UserData } from "@/app/(dashboard)/users-management/users-list/columns";
import { DeleteUserForm } from "./delete-user-form";
interface ChildProps {
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function DeleteUserDialog({
  user,
  setDropdownOpen,
}: { user: UserData } & ChildProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">حذف مستخدم</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className=" max-w-[425] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>حذف مستخدم</DialogTitle>
          <DialogDescription>
            يرجى كتابة اسم المستخدم للتأكيد على الحذف
          </DialogDescription>
        </DialogHeader>

        <DeleteUserForm
          user={user}
          setOpen={setOpen}
          setDropdownOpen={setDropdownOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
