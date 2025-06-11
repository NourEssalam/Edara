"use client";
import { useState } from "react";
import { LeaveRequestWithPeriods } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaveViewDialog } from "@/components/custom-ui/requests/leave-request-view-dialog";
import { LeaveCancelDialog } from "@/components/custom-ui/requests/cancel-leave-request-dialog";
import { UpdateLeaveDialog } from "@/components/custom-ui/requests/levae-update-dialog";

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
