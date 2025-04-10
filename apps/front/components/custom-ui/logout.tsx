"use client";

import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
  return (
    <a
      href="/api/auth/logout?logout=true"
      className="w-full flex text-right items-center gap-4 hover:underline"
    >
      <LogOutIcon className="w-4 h-4" />
      تسجيل الخروج
    </a>
  );
}
