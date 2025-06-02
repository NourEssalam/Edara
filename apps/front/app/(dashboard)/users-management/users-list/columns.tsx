"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UserRole, UserStatus } from "@repo/shared-types"; // Import the enums
import { format } from "date-fns";
import { arTN } from "date-fns/locale";
import { translateRole, translateStatus } from "@/lib/translations/enums";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { UpdateUserDialog } from "@/components/custom-ui/update-user-dialog";
import { useState } from "react";
import { DeleteUserDialog } from "@/components/custom-ui/delete-user-dialog";
// This type is used to define the shape of our data.
export type UserData = {
  id: string;
  email: string;
  full_name: string;
  cin: string;
  matricule: string;
  role: UserRole;
  status?: UserStatus;
  last_login: Date; // Added from schema
  // profile_picture_url: string; // Added from schema
  created_at: Date; // Added from schema
  updated_at: Date; // Added from schema
};

export function Action({ user }: { user: UserData }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="direction-rtl flex flex-col gap-4 p-4"
        align="end"
      >
        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <UpdateUserDialog user={user} setDropdownOpen={setDropdownOpen} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteUserDialog user={user} setDropdownOpen={setDropdownOpen} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<UserData>[] = [
  {
    id: "إجراءات",
    header: "إجراءات",
    cell: ({ row }) => {
      const user = row.original;

      return <Action user={user} />;
    },
  },
  {
    accessorKey: "full_name",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الاسم الكامل
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          البريد الإلكتروني
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Button
          variant="link"
          onClick={() => navigator.clipboard.writeText(row.original.email)}
        >
          {row.original.email}
        </Button>
      );
    },
  },
  // cin
  {
    accessorKey: "cin",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          رقم بطاقة التعريف
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Button
          variant="link"
          onClick={() => navigator.clipboard.writeText(row.original.cin)}
        >
          {row.original.cin}
        </Button>
      );
    },
  },
  // matricule
  {
    accessorKey: "matricule",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          المعرف الوحيد
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Button
          variant="link"
          onClick={() => navigator.clipboard.writeText(row.original.matricule)}
        >
          {row.original.matricule}
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    enableGlobalFilter: false,
    header: "صلاحيات المستخدم",
    filterFn: "equals",
    cell: ({ row }) => {
      const role = row.getValue("role") as UserRole;
      return translateRole(role);
    },
  },
  {
    accessorKey: "status",
    enableGlobalFilter: false,
    header: "الحالة",
    filterFn: "equals",
    cell: ({ row }) => {
      const status = row.getValue("status") as UserStatus;
      return translateStatus(status);
    },
  },
  {
    accessorKey: "last_login",
    enableGlobalFilter: false,
    header: "آخر تسجيل دخول",
    cell: ({ row }) => {
      const date = row.getValue("last_login") as Date;

      return date ? format(date, "dd MMMM yyyy", { locale: arTN }) : " ";
    },
  },
  {
    accessorKey: "created_at",
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاريخ الإنشاء
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;

      return date ? format(date, "dd MMMM yyyy", { locale: arTN }) : "";
    },
  },
  {
    accessorKey: "updated_at",
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
            console.log(column.getIsSorted());
          }}
        >
          اخر تعديل
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("updated_at") as Date;

      return date ? format(date, "dd MMMM yyyy", { locale: arTN }) : "";
    },
  },
];
