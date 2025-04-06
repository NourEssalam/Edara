import { SuperSignupForm } from "@/components/custom-ui/super-signup-form";
import { BACKEND_URL } from "@/lib/constants";
// import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const countUsers = await fetch(`${BACKEND_URL}/user/count`, {
    method: "GET",
  });

  if (countUsers.ok) {
    const count = await countUsers.json();
    if (count > 0) {
      // return (
      //   <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      //     <div className="w-full max-w-sm flex flex-col items-center">
      //       <p className="text-center text-3xl font-bold">
      //         There is already a super-admin account,
      //       </p>
      //       <span className="text-amber-900">setup is already done</span>
      //     </div>
      //   </div>
      // );
      redirect("/login");
    }
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SuperSignupForm />
      </div>
    </div>
  );
}
