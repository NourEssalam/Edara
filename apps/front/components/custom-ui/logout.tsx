"use client";
export function LogoutButton() {
  return (
    <a href="/api/auth/logout" className="w-full text-left hover:underline ">
      Logout
    </a>
  );
}
