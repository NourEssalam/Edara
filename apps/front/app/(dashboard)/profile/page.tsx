import { ChangePasswordUserForm } from "@/components/custom-ui/profile/info-settings/change-password-form";
import { EssentialsInfoUserForm } from "@/components/custom-ui/profile/info-settings/essentials-form";
import { Separator } from "@/components/ui/separator";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const userProfileInfo = await authFetch(
    `${BACKEND_URL}/user/get-user-profile-info/${session.user.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!userProfileInfo.ok) {
    return <p>Something went wrong</p>;
  }
  const data = await userProfileInfo.json();

  return (
    <div className="flex flex-col gap-4">
      <section className="grid  md:grid-cols-[30%_70%] gap-4 w-full">
        <div className="flex flex-col">
          <h1>المعلومات الأساسية</h1>
          <p>قم بتغيير معلوماتك الأساسية</p>
        </div>
        <EssentialsInfoUserForm data={data} />
      </section>
      <Separator />
      <section className="grid  md:grid-cols-[30%_70%] gap-4 w-full">
        <div className="flex flex-col">
          <h1>كلمة المرور</h1>
          <p>قم بتغيير كلمة المرور الخاصة بك</p>
        </div>
        <ChangePasswordUserForm data={data} />
      </section>
    </div>
  );
}
