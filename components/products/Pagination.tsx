"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Numbered pagination with prev/next. Collapses long ranges with ellipses so
// the control stays compact even for large catalogs.
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");

  pages.push(total);
  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = pageList(currentPage, totalPages);

  const baseBtn =
    "inline-flex items-center justify-center h-9 min-w-9 px-3 rounded-lg text-sm font-medium transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 flex-wrap"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${baseBtn} border border-gray-200 text-gray-600 hover:border-brand hover:text-brand disabled:opacity-40 disabled:pointer-events-none`}
      >
        <FiChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`${baseBtn} ${
              p === currentPage
                ? "bg-brand text-white"
                : "border border-gray-200 text-gray-700 hover:border-brand hover:text-brand"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${baseBtn} border border-gray-200 text-gray-600 hover:border-brand hover:text-brand disabled:opacity-40 disabled:pointer-events-none`}
      >
        <FiChevronRight size={16} />
      </button>
    </nav>
  );
}
