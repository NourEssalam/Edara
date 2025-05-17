"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { arTN } from "date-fns/locale";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import { UpdateCourseDialog } from "@/components/custom-ui/class-attendance-components/update-course-dialog";
import { DeleteCourseDialog } from "@/components/custom-ui/class-attendance-components/delete-course-dialog";
// This type is used to define the shape of our data.
export type CoursesData = {
  id: string;
  name: string;
  created_at: Date; // Added from schema
  updated_at: Date; // Added from schema
};

export function Action({ courses }: { courses: CoursesData }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 dropdown-menu-trigger "
          onClick={(e) => {
            // Prevent the row click event from firing
            e.stopPropagation();
          }}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="direction-rtl flex flex-col gap-4 p-4"
        align="end"
        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking dropdown items
      >
        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>

        <DropdownMenuItem onClick={(e) => e.stopPropagation()} asChild>
          <UpdateCourseDialog
            course={courses}
            setDropdownOpen={setDropdownOpen}
          />
        </DropdownMenuItem>

        <DropdownMenuItem onClick={(e) => e.stopPropagation()} asChild>
          <DeleteCourseDialog
            course={courses}
            setDropdownOpen={setDropdownOpen}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<CoursesData>[] = [
  {
    id: "إجراءات",
    cell: ({ row }) => {
      const classe = row.original;

      return <Action courses={classe} />;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم الدرس
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
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
