"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UserRole, UserStatus } from "@repo/shared-types"; // Import the enums
import { format } from "date-fns";
import { arTN } from "date-fns/locale";
import { translateRole, translateStatus } from "@/lib/translations/users";
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
// This type is used to define the shape of our data.
export type UserData = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status?: UserStatus;
  last_login: Date; // Added from schema
  // profile_picture_url: string; // Added from schema
  created_at: Date; // Added from schema
  updated_at: Date; // Added from schema
};

export const columns: ColumnDef<UserData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mr-2"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mr-2"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "إجراءات",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="direction-rtl" align="end">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)} // we will change it later
            >
              نسخ رقم الموظف
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {" "}
              <Button
                className="bg-amber-500 hover:bg-amber-600"
                variant="outline"
              >
                تعديل بيانات المستخدم
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button variant="destructive">حذف المستخدم</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
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
  },
  {
    accessorKey: "role",
    enableGlobalFilter: false,
    header: "صلاحيات المستخدم",
    cell: ({ row }) => {
      const role = row.getValue("role") as UserRole;
      return translateRole(role);
    },
  },
  {
    accessorKey: "status",
    enableGlobalFilter: false,
    header: "الحالة",
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
