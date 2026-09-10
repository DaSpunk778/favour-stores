"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import FilterControls from "./FilterControls";
import { emptyFilters, type Filters } from "./types";

// Mobile filter sheet: slides up from the bottom. Same FilterControls as the
// desktop sidebar so the two never drift apart.
export default function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (next: Filters) => void;
  resultCount: number;
}) {
  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Filters</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChange(emptyFilters)}
              className="text-xs font-medium text-brand hover:text-brand-dark"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-2">
          <FilterControls filters={filters} onChange={onChange} />
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-brand text-white text-sm font-semibold py-3 hover:bg-brand-dark transition-colors"
          >
            Show {resultCount} {resultCount === 1 ? "result" : "results"}
          </button>
        </div>
      </div>
    </div>
  );
}
