import Container from "@/components/custom-ui/common/Container";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { columns } from "./leave-users-list/columns";
import { DataTable } from "./leave-users-list/data-table";

export default async function Page() {
  // const session = await getSession();
  const getAllUsers = await authFetch(`${BACKEND_URL}/user/get-all-users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const users = await getAllUsers.json();
  // console.log("users", users);
  return (
    <Container className="flex flex-col gap-8 overflow-hidden">
      <div dir="rtl">
        <DataTable columns={columns} data={users} />
      </div>
    </Container>
  );
}
