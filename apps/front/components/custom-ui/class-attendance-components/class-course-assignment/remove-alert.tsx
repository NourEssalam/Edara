/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { removeCourse } from "./actions/removeCourse";
import { Trash2 } from "lucide-react";
export default function RemoveAlert({
  class_id,
  course_id,
}: {
  class_id: string;
  course_id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isremoved, setIsremoved] = useState(false);
  const [error, setError] = useState("");

  const handleremove = async () => {
    setIsPending(true);
    setError("");

    try {
      const result = await removeCourse(class_id, course_id);

      if (result.success) {
        setIsremoved(true);
        setIsOpen(false);
      } else {
        setError(result.message || "فشل الحذف");
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isPending) {
          setIsOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-red-600 p-2 text-white dark:bg-white dark:text-red-600"
          disabled={isremoved}
        >
          <Trash2 className="h-2 w-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-10">
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>
            هل أنت متأكد أنك تريد حذف هذا الدرس؟
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <DialogFooter className="flex flex-col gap-2">
          <Button
            variant="destructive"
            onClick={() => !isPending && setIsOpen(false)}
            disabled={isPending}
          >
            إلغاء
          </Button>
          <Button onClick={handleremove} disabled={isPending || isremoved}>
            {isPending ? "جارٍ المعالجة..." : "تأكيد الحذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
