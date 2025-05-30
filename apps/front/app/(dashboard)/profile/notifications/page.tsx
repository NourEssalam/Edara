import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";

export default async function ProfilePage() {
  const res = await authFetch(`${BACKEND_URL}/auth/profile`);
  const data = await res.json();
  const session = await getSession();

  return (
    <div>
      <h1>notifications</h1>
    </div>
  );
}
