import Container from "@/components/custom-ui/common/Container";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Page() {
  const session = await getSession();
  console.log(session?.user.id);
  const getAllLeaveRequests = await authFetch(
    `${BACKEND_URL}/leave-requests/get-all-leave-requests/${session?.user.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const leaveRequests = await getAllLeaveRequests.json();
  return (
    <Container className="flex flex-col gap-8 overflow-hidden">
      <div dir="rtl" className="flex justify-between">
        <h1 className="text-2xl">بطاقات العطل الخاصة بك</h1>
      </div>

      <div dir="rtl">
        <DataTable columns={columns} data={leaveRequests} />
      </div>
    </Container>
  );
}
