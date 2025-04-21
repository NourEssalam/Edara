import ProfileMenu from "@/components/custom-ui/profile/profile-menu";
// import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { name: "Account", href: "/profile" },
  { name: "Notifications", href: "/profile/notifications" },
];

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ProfileMenu navItems={navItems} />
      <main className="max-w-4xl mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
