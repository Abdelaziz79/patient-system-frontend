import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalUsers: number;
  itemsPerPage: number;
  isFiltering: boolean;
  filteredCount: number;
}

export function UserPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalUsers,
  itemsPerPage,
  isFiltering,
  filteredCount,
}: UserPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust range to keep a consistent number of pages
      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, 4, ...
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show ..., n-3, n-2, n-1, n
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      }

      // Add ellipsis after page 1 if needed
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    currentPage * itemsPerPage,
    isFiltering ? filteredCount : totalUsers
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium px-4 py-2 rounded-md w-full">
        {isFiltering ? (
          <>
            Showing{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {startItem}-{endItem}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {filteredCount}
            </span>{" "}
            filtered results
          </>
        ) : (
          <>
            Showing{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {startItem}-{endItem}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {totalUsers}
            </span>{" "}
            users
          </>
        )}
      </div>

      <Pagination className="bg-white dark:bg-slate-800 rounded-md shadow-sm border border-gray-100 dark:border-gray-700 p-1">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={`
                ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                }
                transition-colors
              `}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </PaginationPrevious>
          </PaginationItem>

          {pageNumbers.map((page, index) =>
            page === "ellipsis-start" || page === "ellipsis-end" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={page === currentPage}
                  className={`
                    cursor-pointer
                    ${
                      page === currentPage
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "hover:bg-gray-100 dark:hover:bg-slate-700"
                    }
                    transition-colors
                  `}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={`
                ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                }
                transition-colors
              `}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
