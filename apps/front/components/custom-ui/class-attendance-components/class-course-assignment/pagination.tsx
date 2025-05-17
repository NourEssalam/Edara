"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    // Create new URLSearchParams instance from the current URL
    const params = new URLSearchParams(searchParams);

    // Update page parameter
    params.set("page", newPage.toString());

    // Replace current URL with new URL including the updated page
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-6 flex justify-between items-center">
      {hasNextPage ? (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          → التالي
        </button>
      ) : (
        <div />
      )}

      <span className="text-sm text-gray-600 dark:text-gray-400">
        الصفحة {currentPage} من {totalPages}
      </span>

      {hasPrevPage ? (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          السابق ←
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
