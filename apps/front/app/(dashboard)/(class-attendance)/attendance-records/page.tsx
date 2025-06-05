import Container from "@/components/custom-ui/common/Container";
// import { CreateUserDialog } from "@/components/custom-ui/create-user-dialog";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
// import { getSession } from "@/lib/session";
import { DataTable } from "./course-list/data-table";
import { columns } from "./course-list/columns";

export default async function Page() {
  // const session = await getSession();
  const getAllUsers = await authFetch(
    `${BACKEND_URL}/class-attendance/attendace-records`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const records = await getAllUsers.json();
  // const data = await getData();
  return (
    <Container className="flex flex-col gap-8 overflow-hidden">
      <div dir="rtl">
        <DataTable columns={columns} data={records} />
      </div>
    </Container>
  );
}
