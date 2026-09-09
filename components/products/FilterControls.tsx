"use client";

import { FaStar } from "react-icons/fa";
import { categories } from "@/lib/categories";
import { brandSlugs } from "@/lib/products";
import type { Filters } from "./types";

// The actual filter inputs. Shared verbatim between the desktop FilterSidebar
// and the mobile FilterDrawer so there's only one place to change filters.

type FilterControlsProps = {
  filters: Filters;
  onChange: (next: Filters) => void;
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function labelForBrand(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 py-4 first:pt-0">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function FilterControls({ filters, onChange }: FilterControlsProps) {
  // Only offer categories that aren't "coming soon".
  const availableCategories = categories.filter((c) => !c.comingSoon);

  return (
    <div className="flex flex-col">
      <Section title="Category">
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
          {availableCategories.map((c) => (
            <label
              key={c.slug}
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(c.slug)}
                onChange={() =>
                  onChange({ ...filters, categories: toggle(filters.categories, c.slug) })
                }
                className="h-4 w-4 rounded border-gray-300 text-brand accent-brand focus:ring-brand/30"
              />
              {c.name}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Brand">
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
          {brandSlugs.map((slug) => (
            <label
              key={slug}
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(slug)}
                onChange={() =>
                  onChange({ ...filters, brands: toggle(filters.brands, slug) })
                }
                className="h-4 w-4 rounded border-gray-300 text-brand accent-brand focus:ring-brand/30"
              />
              {labelForBrand(slug)}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Price range (₦)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </Section>

      <Section title="Rating">
        <div className="flex flex-col gap-2">
          {[4, 3, 2].map((r) => (
            <label
              key={r}
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
                className="h-4 w-4 border-gray-300 text-brand accent-brand focus:ring-brand/30"
              />
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    size={12}
                    className={i < r ? "text-yellow-400" : "text-gray-200"}
                  />
                ))}
              </span>
              <span>& up</span>
            </label>
          ))}
          {filters.minRating !== null && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, minRating: null })}
              className="text-left text-xs font-medium text-brand hover:text-brand-dark"
            >
              Clear rating
            </button>
          )}
        </div>
      </Section>

      <Section title="Availability">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-brand accent-brand focus:ring-brand/30"
          />
          In stock only
        </label>
      </Section>
    </div>
  );
}
