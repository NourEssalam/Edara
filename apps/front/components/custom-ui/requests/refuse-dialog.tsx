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
import { RefuseRequestForm } from "./refuse-request-form";
import { RequestIdentifier } from "@/types/request-types";

export function RefuseRequestDialog({
  requestIdentifier,
}: {
  requestIdentifier: RequestIdentifier;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">رفض الطلب</Button>
      </DialogTrigger>
      <DialogContent
        dir="rtl"
        className="max-w-[425] md:max-w-[850px] overflow-scroll max-h-[80vh] direction-rtl"
      >
        <DialogHeader className="pt-4 px-4">
          <DialogTitle>رفض الطلب</DialogTitle>
          <DialogDescription>يرجى تأكيد سبب رفض هذا الطلب</DialogDescription>
        </DialogHeader>

        <RefuseRequestForm
          setOpen={setOpen}
          requestIdentifier={requestIdentifier}
        />
      </DialogContent>
    </Dialog>
  );
}
