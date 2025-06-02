"use client";
import { ColumnDef } from "@tanstack/react-table";
import { RequestStatus, LeaveType } from "@repo/shared-types"; // Import the enums
import { format } from "date-fns";
import { arTN } from "date-fns/locale";
import { translateRequestStatus } from "@/lib/translations/enums";
import { ArrowUpDown, MoreHorizontal, CircleOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { LeaveViewDialog } from "@/components/custom-ui/requests/leave-request-view-dialog";
import { LeaveCancelDialog } from "@/components/custom-ui/requests/cancel-leave-request-dialog";
import { UpdateLeaveDialog } from "@/components/custom-ui/requests/levae-update-dialog";

// This type is used to define the shape of our data.
export type LeaveRequestWithPeriods = {
  id: string;
  userId: number;
  leaveType: LeaveType;
  matricule: string;
  name: string;
  grade: string;
  jobPlan?: string | null; // nullable
  benefitText: string;
  durationFrom: Date;
  durationTo: Date;
  leaveYear: number;
  leaveAddress: string;
  postalCode: string;
  phone: string;
  attachedDocs?: string | null; // optional
  requestStatus: RequestStatus;
  createdAt: Date;
  // calculated fields
  totalPeriod: number;
  periodPassed: number | null;
  periodLeft: number | null;
};

export function Action({ leave }: { leave: LeaveRequestWithPeriods }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div className="">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-4 w-4 p-0">
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
            <LeaveViewDialog data={leave} setDropdownOpen={setDropdownOpen} />
          </DropdownMenuItem>
          {leave.requestStatus === "PENDING" && (
            <>
              <DropdownMenuItem asChild>
                <UpdateLeaveDialog
                  data={leave}
                  setDropdownOpen={setDropdownOpen}
                />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <LeaveCancelDialog
                  data={leave}
                  setDropdownOpen={setDropdownOpen}
                />
              </DropdownMenuItem>
            </>
          )}

          {/* <DropdownMenuItem asChild>
          <UpdateUserDialog user={user} setDropdownOpen={setDropdownOpen} />
        </DropdownMenuItem> */}
          {/* <DropdownMenuItem asChild>
          <DeleteUserDialog user={user} setDropdownOpen={setDropdownOpen} />
        </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<LeaveRequestWithPeriods>[] = [
  {
    id: "إجراءات",
    header: "إجراءات",
    enableResizing: true,
    // size: 40, // Set specific width
    // minSize: 30, // Set minimum width
    // maxSize: 50, // Set maximum width (optional)
    cell: ({ row }) => {
      const leave = row.original;

      return <Action leave={leave} />;
    },
  },
  {
    accessorKey: "status",
    header: "حالة المطلب",
    cell: ({ row }) => (
      <div>
        <div
          className={`rounded-xl py-1 ${row.original.requestStatus === "APPROVED" && "bg-green-400"}
             ${row.original.requestStatus === "REJECTED" && "bg-red-600"} 
             ${row.original.requestStatus === "PENDING" && "bg-yellow-300 dark:bg-yellow-800"}
             ${row.original.requestStatus === "CANCELED" && "bg-gray-400"} font-semibold`}
        >
          {translateRequestStatus(row.original.requestStatus)}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "leaveType",
    header: "نوع العطلة",
  },

  {
    accessorKey: "durationFrom",
    header: "من تاريخ",
    cell: ({ row }) => (
      <div>
        {format(row.original.durationFrom, "dd MMMM yyyy", { locale: arTN })}
      </div>
    ),
  },
  {
    accessorKey: "durationTo",
    header: "إلى تاريخ",
    cell: ({ row }) => (
      <div>
        {format(row.original.durationTo, "dd MMMM yyyy", { locale: arTN })}
      </div>
    ),
  },
  {
    accessorKey: "leaveYear",
    header: "بعنوان سنة",
  },
  {
    accessorKey: "totalPeriod",
    header: "مدة العطلة",
  },
  {
    accessorKey: "periodPassed",
    header: "المدة المقضاة",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {!row.original.periodPassed ? (
          <CircleOff className="w-4 h-4 text-gray-400" />
        ) : (
          row.original.periodPassed + " يوم"
        )}
      </div>
    ),
  },
  {
    accessorKey: "periodLeft",
    header: "المدة الباقية",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {!row.original.periodLeft ? (
          <CircleOff className="w-4 h-4 text-gray-400" />
        ) : (
          row.original.periodLeft + " يوم"
        )}
      </div>
    ),
  },
];
