import { CreateClassDialog } from "@/components/custom-ui/class-attendance-components/create-class-dialog";
import Container from "@/components/custom-ui/common/Container";

export default function ClassesPage() {
  return (
    <Container className="flex flex-col gap-8 overflow-hidden">
      <div dir="rtl" className="flex justify-between">
        <h1 className="text-2xl">الأقسام</h1>
        <CreateClassDialog />
      </div>

      <div dir="rtl">{/* <DataTable columns={columns} data={users} /> */}</div>
    </Container>
  );
}
