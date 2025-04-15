import { UserRole } from "@repo/shared-types";
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  roles?: UserRole[]; // optional: if not provided, visible to all
  items?: MenuItem[]; // for nested submenus
}
