"use client";
import { getOut } from "@/app/(auth)/actions/getOut";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export default function GetOut() {
  const pathname = usePathname();

  useEffect(() => {
    const handleGetOut = async () => {
      if (pathname !== "/setup") {
        await getOut();
      }
    };
    handleGetOut();
  }, [pathname]);

  return null;
}
