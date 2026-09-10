"use client";

import FilterControls from "./FilterControls";
import { emptyFilters, type Filters } from "./types";

// Desktop filter rail. Sticky so it stays in view while the grid scrolls.
export default function FilterSidebar({
  filters,
  onChange,
  brandSlugs,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  brandSlugs: string[];
}) {
  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={() => onChange(emptyFilters)}
            className="text-xs font-medium text-brand hover:text-brand-dark"
          >
            Clear all
          </button>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <FilterControls filters={filters} onChange={onChange} brandSlugs={brandSlugs} />
        </div>
      </div>
    </aside>
  );
}
