import Container from "@/components/custom-ui/common/Container";
import { CreateLeaveRequestForm } from "@/components/custom-ui/requests/leave-request-form";
import { getSession } from "@/lib/session";
import { UserRole } from "@repo/shared-types";

export default async function Page() {
  const session = await getSession();
  console.log(typeof session?.user.id);
  const userId = String(session?.user.id);
  return (
    <Container>
      <h1>leave request</h1>
      <CreateLeaveRequestForm
        userId={userId}
        userRole={session?.user.role as UserRole}
      />
    </Container>
  );
}
