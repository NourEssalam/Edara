import { LoginForm } from "@/components/custom-ui/login-form";
// import { redirect } from "next/navigation";

export default function Page() {
  // const user = false;
  // if (user === false) redirect("/sign-up");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
