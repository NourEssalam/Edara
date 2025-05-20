"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// sizes array
const sizes = [2, 5, 10, 20, 50];

export default function PageSize() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current page size from URL or default to 10
  const currentPageSize = searchParams.get("pageSize") || "10";

  const handlePageSizeChange = (size: string) => {
    // Create new URLSearchParams instance
    const params = new URLSearchParams(searchParams);

    // Update pageSize parameter
    params.set("pageSize", size);

    // Reset to page 1 when changing page size
    params.set("page", "1");

    // Replace current URL with new URL including the selected page size
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2 gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        عدد العناصر في كل صفحة
      </span>
      <Select value={currentPageSize} onValueChange={handlePageSizeChange}>
        <SelectTrigger className="w-16 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <SelectGroup>
            <SelectLabel className="text-gray-600 dark:text-gray-300">
              حجم الصفحة
            </SelectLabel>
            {sizes.map((size) => (
              <SelectItem
                key={size}
                value={size.toString()}
                className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {size}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
