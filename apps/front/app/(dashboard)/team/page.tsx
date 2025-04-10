import { getSession } from "@/lib/session";

export default async function Page() {
  const session = await getSession();
  return (
    <div className="flex  w-full items-center justify-center">
      <div className="w-full ">
        <h1>Users Management</h1>
        <p>{session?.user.email}</p>
      </div>
    </div>
  );
}
