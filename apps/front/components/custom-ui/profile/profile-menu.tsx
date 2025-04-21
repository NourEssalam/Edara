"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function ProfileMenu({
  navItems,
}: {
  navItems: { name: string; href: string }[];
}) {
  const pathname = usePathname();
  return (
    <div className="border-b border-border">
      <div className="max-w-4xl mx-auto  px-4 py-4 flex gap-4  text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
                transition-colors hover:text-foreground 
                ${
                  pathname === item.href
                    ? "text-foreground "
                    : "text-muted-foreground"
                }
              `}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
