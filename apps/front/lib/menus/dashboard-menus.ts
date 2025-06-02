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
  CoffeeIcon,
  User,
  Lock,
  CalendarClock,
  HourglassIcon,
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
  // {
  //   title: "التقارير",
  //   url: "/reports",
  //   icon: BarChartIcon,
  //   roles: [UserRole.LEAVE_ADMIN],
  // },
  {
    title: "التقارير",
    icon: Lock,
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
  // leave requests
  {
    title: "سجلات بطاقات العطل", // "Leave Requests Management"
    url: "/employees-leave-requests",
    icon: CalendarClock,
    roles: [UserRole.LEAVE_ADMIN],
  },
  {
    title: "الطلبات قيد الانتظار", // More descriptive than just "قيد الانتظار"
    icon: HourglassIcon,
    roles: [UserRole.LEAVE_ADMIN], // أو WC_ADMIN حسب الحاجة
  },
];

// Secondary navigation menu
export const navSecondaryMenu: MenuItem[] = [
  // leave requets list
  {
    title: "بطاقة العطل الخاصة",
    url: "/leave-request-list",
    icon: CoffeeIcon,
    roles: Object.values(UserRole),
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
