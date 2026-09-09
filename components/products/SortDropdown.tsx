"use client";

import { sortOptions, type SortKey } from "./types";

// Native <select> styled to match the store. Native is the right call here:
// accessible by default, works on mobile, no extra JS for a simple picker.
export default function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (next: SortKey) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      <span className="hidden sm:inline shrink-0">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
