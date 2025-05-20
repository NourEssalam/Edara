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
import { assignToClass } from "./actions/assingCourse";
import { Button } from "@/components/ui/button";

// Simulated server action (replace with your actual server action)

export default function AssignAlert({
  class_id,
  course_id,
}: {
  class_id: string;
  course_id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [error, setError] = useState("");

  const handleAssignment = async () => {
    setIsPending(true);
    setError("");

    try {
      // Call the assignToClass function that exists elsewhere
      const result = await assignToClass(class_id, course_id);

      if (result.success) {
        // Only close dialog on success
        setIsAssigned(true);
        setIsOpen(false);
      } else {
        // Keep dialog open and show error
        setError(result.message || "Assignment failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Only allow state changes if not in pending state
        if (!isPending) {
          setIsOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-black text-white dark:bg-white dark:text-black"
          disabled={isAssigned}
        >
          {isAssigned ? "مُخصص" : "تخصيص"}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-10">
        <DialogHeader>
          <DialogTitle>تأكيد التخصيص</DialogTitle>
          <DialogDescription>
            هل أنت متأكد أنك تريد تخصيص هذا الدرس؟
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
          <Button onClick={handleAssignment} disabled={isPending || isAssigned}>
            {isPending ? "جارٍ المعالجة..." : "تأكيد التخصيص"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
