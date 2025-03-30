import { LoginForm } from "@/components/custom-ui/login-form";
import { BACKEND_URL } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function Page() {
  const countUsers = await fetch(`${BACKEND_URL}/user/count`, {
    method: "GET",
  });
  if (countUsers.ok) {
    const count = await countUsers.json();
    if (count === 0) {
      redirect("/setup");
    }
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
