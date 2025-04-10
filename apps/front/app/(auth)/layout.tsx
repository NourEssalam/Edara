import { headers } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  // read the custom x-url header
  const header_url = headersList.get("x-url") || "";
  let sub_title = "";
  if (header_url.includes("setup")) {
    sub_title = "انشاء حساب المدير العام";
  } else if (header_url.includes("login")) {
    sub_title = "تسجيل الدخول إلى حسابك";
  } else {
    sub_title = "";
  }
  return (
    <main className="w-full flex flex-col md:flex-row justify-center items-around dark:bg-gray-900 dark:text-white">
      <div className="flex flex-row md:flex-col justify-center bg-amber-200 dark:bg-gray-800 p-1 md:p-6 font-bold ">
        <h1 className="text-4xl text-amber-900 dark:text-white" dir="rtl">
          إدارة
        </h1>
        <p className="text-sm p-2 text-amber-700 dark:text-gray-300" dir="rtl">
          {sub_title}
        </p>
      </div>
      {children}
    </main>
  );
}
