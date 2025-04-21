import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  navMainMenu,
  navSecondaryMenu,
  documentMenu,
} from "@/lib/menus/dashboard-menus";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { LayoutDashboardIcon } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { filterMenuByRole } from "@/lib/menus/functions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const mainNav = filterMenuByRole(navMainMenu, role);

  return (
    <Sidebar side="right" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5">
              <LayoutDashboardIcon />

              <Link href="/" className={buttonVariants({ variant: "link" })}>
                إدارة
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent dir="rtl">
        <NavMain items={mainNav} />
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
