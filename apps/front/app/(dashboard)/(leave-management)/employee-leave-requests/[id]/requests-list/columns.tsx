"use client";
import { ColumnDef } from "@tanstack/react-table";
import { RequestStatus, LeaveType } from "@repo/shared-types"; // Import the enums
import { format } from "date-fns";
import { arTN } from "date-fns/locale";
import { translateRequestStatus } from "@/lib/translations/enums";
import { CircleOff } from "lucide-react";
import { Action } from "./actions-component";

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

export const columns: ColumnDef<LeaveRequestWithPeriods>[] = [
  {
    id: "إجراءات",
    header: "إجراءات",
    enableResizing: true,

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
