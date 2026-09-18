import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const btnBase =
    "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`${btnBase} border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <ChevronLeft size={16} />
        </button>

        {/* First page + dots */}
        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`${btnBase} border border-gray-200 text-gray-600 hover:bg-gray-50`}
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-sm text-gray-400">…</span>}
          </>
        )}

        {/* Page buttons */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${
              page === currentPage
                ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Dots + last page */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="px-1 text-sm text-gray-400">…</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`${btnBase} border border-gray-200 text-gray-600 hover:bg-gray-50`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`${btnBase} border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}

export default Pagination;
