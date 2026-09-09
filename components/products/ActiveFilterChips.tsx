"use client";

import { FiX } from "react-icons/fi";
import { categories } from "@/lib/categories";
import { formatNaira } from "@/lib/products";
import { emptyFilters, type Filters } from "./types";

// Removable pills summarizing what's currently narrowing the results. Each
// chip clears just its own filter; "Clear all" resets everything.

type Chip = { key: string; label: string; clear: () => void };

function categoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

function labelForBrand(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export default function ActiveFilterChips({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const chips: Chip[] = [];

  for (const slug of filters.categories) {
    chips.push({
      key: `cat-${slug}`,
      label: categoryName(slug),
      clear: () =>
        onChange({
          ...filters,
          categories: filters.categories.filter((c) => c !== slug),
        }),
    });
  }

  for (const slug of filters.brands) {
    chips.push({
      key: `brand-${slug}`,
      label: labelForBrand(slug),
      clear: () =>
        onChange({ ...filters, brands: filters.brands.filter((b) => b !== slug) }),
    });
  }

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const min = filters.minPrice !== null ? formatNaira(filters.minPrice) : "₦0";
    const max = filters.maxPrice !== null ? formatNaira(filters.maxPrice) : "∞";
    chips.push({
      key: "price",
      label: `${min} – ${max}`,
      clear: () => onChange({ ...filters, minPrice: null, maxPrice: null }),
    });
  }

  if (filters.minRating !== null) {
    chips.push({
      key: "rating",
      label: `${filters.minRating}★ & up`,
      clear: () => onChange({ ...filters, minRating: null }),
    });
  }

  if (filters.inStockOnly) {
    chips.push({
      key: "stock",
      label: "In stock",
      clear: () => onChange({ ...filters, inStockOnly: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.clear}
          className="inline-flex items-center gap-1 rounded-full bg-brand/10 text-brand-dark text-xs font-medium px-3 py-1 hover:bg-brand/20 transition-colors"
        >
          {chip.label}
          <FiX size={13} />
        </button>
      ))}

      {chips.length > 1 && (
        <button
          type="button"
          onClick={() => onChange(emptyFilters)}
          className="text-xs font-medium text-gray-500 hover:text-gray-800 underline underline-offset-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
