import { LoginForm } from "@/components/custom-ui/login-form";
import { BACKEND_URL } from "@/lib/constants";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const res = await fetch(`${BACKEND_URL}/user/count`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user count");
    }

    const count: number = await res.json();

    if (count === 0) {
      redirect("/setup");
    }
  } catch (error) {
    console.error("Login page error:", error);

    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm text-center">
          <p className="text-2xl font-bold text-red-600">Error</p>
          <p className="text-sm text-gray-500 mt-2">
            Something went wrong. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
