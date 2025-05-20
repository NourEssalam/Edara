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

import Link from "next/link";
type StudentAttendanceReport = {
  studentId: number;
  studentName: string;
  className: string;
  courseId: number;
  courseName: string;
  totalSessions: string; // Note: if these should be numbers, change to `number`
  presentCount: string;
  absentCount: string;
  lateCount: string;
  eliminated: boolean;
};

export const columns: ColumnDef<StudentAttendanceReport>[] = [
  {
    accessorKey: "studentName",

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
    cell: ({ row }) => {
      return (
        <Button
          variant="link"
          onClick={() =>
            navigator.clipboard.writeText(row.original.studentName)
          }
        >
          {row.original.studentName}
        </Button>
      );
    },
  },
  {
    accessorKey: "className",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم القسم
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Button
          variant="link"
          onClick={() => navigator.clipboard.writeText(row.original.className)}
        >
          {row.original.className}
        </Button>
      );
    },
  },
  {
    accessorKey: "courseName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم المادة
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      return (
        <Button
          variant="link"
          onClick={() => navigator.clipboard.writeText(row.original.courseName)}
        >
          {row.original.courseName}
        </Button>
      );
    },
  },
  {
    accessorKey: "totalSessions",
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عددالحصص
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "presentCount",
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عدد الحضور
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "absentCount",
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عدد الغياب
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lateCount",
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عدد التأخير
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "eliminated",
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          محذوف
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isEliminated = row.getValue("eliminated");
      return <div>{isEliminated ? "نعم" : "لا"}</div>;
    },
  },
];
