"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function NavigationGuard({ submitted }: { submitted: boolean }) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    null | (() => void)
  >(null);

  // Block browser reload / close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitted) {
        e.preventDefault();
        e.returnValue = ""; // Needed for Chrome/Safari
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitted]);

  // Optional: block internal navigation
  useEffect(() => {
    // const handleRouteChange = () => {
    //   if (!submitted) {
    //     setShowDialog(true);
    //     return false;
    //   }
    //   return true;
    // };

    const originalPush = router.push;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router as any).push = (url: string) => {
      if (!submitted) {
        setShowDialog(true);
        setPendingNavigation(() => () => originalPush(url));
      } else {
        originalPush(url);
      }
    };

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (router as any).push = originalPush;
    };
  }, [submitted, router]);

  const handleLeave = () => {
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد أنك تريد المغادرة؟</AlertDialogTitle>
          <AlertDialogDescription>
            لديك تغييرات غير محفوظة. سيتم فقدانها إذا غادرت هذه الصفحة.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowDialog(false)}>
            البقاء
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleLeave}>المغادرة</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
