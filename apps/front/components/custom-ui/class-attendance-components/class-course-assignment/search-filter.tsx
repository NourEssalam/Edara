"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get the initial search term from URL
  const initialSearchTerm = searchParams.get("search") || "";

  // Local state to track the input value
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Debounced version of the search term
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Update URL when debounced search term changes
  useEffect(() => {
    // Create new URLSearchParams instance
    const params = new URLSearchParams(searchParams);

    // Update search parameter
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }

    // Reset to page 1 when search changes
    params.set("page", "1");

    // Replace current URL with new URL including the search term
    router.replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  // Sync input with URL if the URL changes externally
  // useEffect(() => {
  //   const urlSearchTerm = searchParams.get("search") || "";
  //   if (urlSearchTerm !== searchTerm) {
  //     setSearchTerm(urlSearchTerm);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchParams]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        {/* <Search className="h-4 w-4 text-gray-400" /> */}
      </div>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="البحث..."
        // className="block w-full  h-10 p-2 ps-10 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 placeholder-right"
        dir="rtl"
      />
    </div>
  );
}
