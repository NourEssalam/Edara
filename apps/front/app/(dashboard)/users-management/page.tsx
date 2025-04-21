import Container from "@/components/custom-ui/common/Container";
import { CreateUserDialog } from "@/components/custom-ui/create-user-dialog";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { columns } from "./users-list/columns";
import { DataTable } from "./users-list/data-table";

export default async function Page() {
  const session = await getSession();
  const getAllUsers = await authFetch(`${BACKEND_URL}/user/users-client-side`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const users = await getAllUsers.json();
  // const data = await getData();
  return (
    <Container className="flex flex-col gap-8 overflow-hidden">
      <div dir="rtl" className="flex justify-between">
        <h1 className="text-2xl">
          مرحبًا {session?.user.full_name.split(" ")[0]}
        </h1>
        <CreateUserDialog />
      </div>

      <div dir="rtl">
        <DataTable columns={columns} data={users} />
      </div>
    </Container>
  );
}
