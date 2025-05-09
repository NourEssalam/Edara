import { CreateClassDialog } from "@/components/custom-ui/class-attendance-components/create-class-dialog";
import Container from "@/components/custom-ui/common/Container";
import { columns } from "./classes-list/columns";
import { DataTable } from "./classes-list/data-table";
import { BACKEND_URL } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";

export default async function ClassesPage() {
  const getAllClasses = await authFetch(
    `${BACKEND_URL}/class-attendance/classes`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const classes = await getAllClasses.json();

  return (
    <Container className="flex flex-col gap-8 overflow-hidden">
      <div dir="rtl" className="flex justify-between">
        <h1 className="text-2xl">الأقسام</h1>
        <CreateClassDialog />
      </div>

      <div dir="rtl">
        <DataTable columns={columns} data={classes} />
      </div>
    </Container>
  );
}
