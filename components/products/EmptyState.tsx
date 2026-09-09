"use client";

import { FiSearch } from "react-icons/fi";

// Shown when the active filters exclude every product.
export default function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-4">
        <FiSearch size={26} />
      </span>
      <h3 className="text-lg font-semibold text-gray-900">No products match your filters</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">
        Try removing a filter or two to see more of what we have in store.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-xl bg-brand text-white text-sm font-semibold px-6 py-2.5 hover:bg-brand-dark transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}
