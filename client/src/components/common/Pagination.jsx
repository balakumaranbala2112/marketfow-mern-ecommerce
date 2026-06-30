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

  // Common button style
  const btnBase =
    "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all";

  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`${btnBase} border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* First page + left dots */}
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${btnBase} border border-slate-200 text-slate-600 hover:bg-slate-100`}
          >
            1
          </button>

          {start > 2 && (
            <span className="px-1 text-slate-400">…</span>
          )}
        </>
      )}

      {/* Middle page buttons */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${btnBase} ${page === currentPage
            ? "bg-slate-950 text-white shadow-md"
            : "border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Right dots + last page */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-slate-400">…</span>
          )}

          <button
            onClick={() => onPageChange(totalPages)}
            className={`${btnBase} border border-slate-200 text-slate-600 hover:bg-slate-100`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${btnBase} border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;