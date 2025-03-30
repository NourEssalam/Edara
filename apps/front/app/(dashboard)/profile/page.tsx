import { getSession } from "@/lib/session";
import { getProfile } from "./actions";

export default async function ProfilePage() {
  const session = await getSession();
  const res = await getProfile();

  return (
    <div>
      <h1>Profile Page</h1>
      <p>{JSON.stringify(res)}</p>
      <p>{session?.refreshToken}</p>
    </div>
  );
}
