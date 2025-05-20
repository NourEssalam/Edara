import {
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  GraduationCap,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  Disc2Icon,
} from "lucide-react";

import { UserRole } from "@repo/shared-types";
import { MenuItem } from "@/types/menu-type";

export const navMainMenu: MenuItem[] = [
  {
    title: "إدارة المستخدمين",
    url: "/users-management",
    icon: UsersIcon,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    title: "التقارير",
    url: "/reports",
    icon: BarChartIcon,
    roles: [UserRole.LEAVE_ADMIN],
  },
  // class attendance
  {
    title: "الأقسام",
    url: "/classes",
    icon: FolderIcon,
    roles: [UserRole.CLASS_ATTENDANCE_ADMIN],
  },
  // courses
  {
    title: "الدروس",
    url: "/courses",
    icon: FileTextIcon,
    roles: [UserRole.CLASS_ATTENDANCE_ADMIN],
  },

  /// Teachers role
  // record students attendance
  {
    title: "تسجيل حضور الطلبة",
    url: "/class-room",
    icon: Disc2Icon,
    roles: [UserRole.TEACHER],
  },

  {
    title: "سجلات الحضور",
    url: "/attendance-records",
    icon: ListIcon,
    roles: [UserRole.CLASS_ATTENDANCE_ADMIN],
  },
];

// Secondary navigation menu
export const navSecondaryMenu: MenuItem[] = [
  {
    title: "Settings",
    url: "#",
    icon: SettingsIcon,
  },
  {
    title: "Get Help",
    url: "#",
    icon: HelpCircleIcon,
  },
  {
    title: "Search",
    url: "#",
    icon: SearchIcon,
  },
];

// Document menu
export const documentMenu: MenuItem[] = [
  {
    title: "Data Library",
    url: "#",
    icon: DatabaseIcon,
  },
  {
    title: "Reports",
    url: "#",
    icon: ClipboardListIcon,
  },
  {
    title: "Word Assistant",
    url: "#",
    icon: FileIcon,
  },
];
