import Container from "@/components/custom-ui/common/Container";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { columns } from "./requests-list/columns";
import { DataTable } from "./requests-list/data-table";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function ClassPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const { id } = await params;
  const userOfRequest = await authFetch(
    `${BACKEND_URL}/user/user-of-request/${id as string}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const user = await userOfRequest.json();
  // console.log(user);
  const getAllLeaveRequests = await authFetch(
    `${BACKEND_URL}/leave-requests/get-all-leave-requests/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const leaveRequests = await getAllLeaveRequests.json();
  // console.log("leaveRequests", leaveRequests);

  return (
    <Container className="flex flex-col gap-4 overflow-hidden py-2 md:-mt-5">
      <div dir="rtl" className="flex justify-between">
        <h1 className="text-2xl">بطاقة عطل الخاصة ب {user[0].full_name}</h1>
      </div>
      <div dir="rtl">
        <DataTable columns={columns} data={leaveRequests} />
      </div>
    </Container>
  );
}
