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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { UpdateStudentDialog } from "@/components/custom-ui/class-attendance-components/update-student-dialog";
import { DeleteStudentDialog } from "@/components/custom-ui/class-attendance-components/delete-student-dialog";

// This type is used to define the shape of our data.
export type StudentData = {
  id: string;
  cin: string;
  first_name: string;
  last_name: string;
  class_id: string;
  created_at: Date;
  updated_at: Date;
};

export function Action({ student }: { student: StudentData }) {
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
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(student.cin);
          }}
        >
          نسخ رقم الموظف
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => e.stopPropagation()} asChild>
          <UpdateStudentDialog
            student={student}
            setDropdownOpen={setDropdownOpen}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => e.stopPropagation()} asChild>
          <DeleteStudentDialog
            student={student}
            setDropdownOpen={setDropdownOpen}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<StudentData>[] = [
  {
    id: "إجراءات",
    cell: ({ row }) => {
      const student = row.original;

      return <Action student={student} />;
    },
  },

  {
    accessorKey: "cin",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          رقم بطاقات التعريف
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم الطالب
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم العائلة
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
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
