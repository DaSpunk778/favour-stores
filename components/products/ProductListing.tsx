"use client";

import { useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";
import type { Product } from "@/lib/products";
import FilterSidebar from "./FilterSidebar";
import FilterDrawer from "./FilterDrawer";
import SortDropdown from "./SortDropdown";
import ActiveFilterChips from "./ActiveFilterChips";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import { emptyFilters, type Filters, type SortKey } from "./types";

const PAGE_SIZE = 12;

// Client-side orchestrator: holds filter/sort/page state locally, derives the
// visible slice with useMemo. The catalog + brand list arrive as props from the
// async server layer (lib/product-store) so this stays purely presentational.
export default function ProductListing({
  initialCategory,
  products,
  brandSlugs,
}: {
  initialCategory?: string;
  products: Product[];
  brandSlugs: string[];
}) {
  const [filters, setFilters] = useState<Filters>(() =>
    initialCategory
      ? { ...emptyFilters, categories: [initialCategory] }
      : emptyFilters
  );
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filtered + sorted list (before pagination).
  const filtered = useMemo(() => {
    const result = products.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category))
        return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.minPrice !== null && p.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && p.price > filters.maxPrice) return false;
      if (filters.minRating !== null && p.rating < filters.minRating) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "best-sellers":
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "featured":
      default:
        sorted.sort(
          (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
        );
        break;
    }
    return sorted;
  }, [filters, sort, products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // Guard against a stale page after filters shrink the result set.
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // Any state change that alters the result set resets to page 1.
  function updateFilters(next: Filters) {
    setFilters(next);
    setPage(1);
  }

  function updateSort(next: SortKey) {
    setSort(next);
    setPage(1);
  }

  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);

  return (
    <div className="flex gap-8">
      <FilterSidebar filters={filters} onChange={updateFilters} brandSlugs={brandSlugs} />

      <div className="flex-1 min-w-0">
        {/* Toolbar: result count + mobile filter button + sort */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-sm text-gray-600">
            {filtered.length > 0 ? (
              <>
                Showing <span className="font-semibold text-gray-900">{rangeStart}–{rangeEnd}</span>{" "}
                of <span className="font-semibold text-gray-900">{filtered.length}</span>
              </>
            ) : (
              "No results"
            )}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-brand hover:text-brand transition-colors"
            >
              <FiFilter size={16} />
              Filters
            </button>
            <SortDropdown value={sort} onChange={updateSort} />
          </div>
        </div>

        <div className="mb-5">
          <ActiveFilterChips filters={filters} onChange={updateFilters} />
        </div>

        {pageItems.length > 0 ? (
          <>
            <ProductGrid products={pageItems} keySeed={`${sort}-${safePage}-${filtered.length}`} />
            <div className="mt-10">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        ) : (
          <EmptyState onClear={() => updateFilters(emptyFilters)} />
        )}
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={updateFilters}
        brandSlugs={brandSlugs}
        resultCount={filtered.length}
      />
    </div>
  );
}
