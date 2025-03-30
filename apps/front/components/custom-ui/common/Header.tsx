import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
export default function Header() {
  return (
    <header className="w-full p-2 flex items-center justify-between bg-black dark:bg-black ">
      <div className="flex items-center justify-between w-1/2  ">
        <Link
          href="/dashboard"
          className="ml-4 text-2xl font-semibold  text-amber-500 dark:text-amber-200"
        >
          Edara
        </Link>
      </div>
      <ModeToggle />
    </header>
  );
}
