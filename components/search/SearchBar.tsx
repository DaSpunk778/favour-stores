"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

/**
 * Storefront search bar. Rendered as its own component directly under the
 * <Header /> (not inside it) so it can own the search/filter state and grow into
 * full product + category filtering.
 *
 * For now it submits the query to the products page via a `q` URL param — the
 * products page can read that param to filter. Extend `handleSubmit` (or add a
 * category <select>, live suggestions, etc.) as the filtering grows.
 */
export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    // TODO: expand into real product/category filtering. Keeping the query in the
    // URL means the results page can be shared/bookmarked and read on the server.
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <div className="lg:hidden border-b border-gray-100 bg-white sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 min-w-0 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2.5">
            <FiSearch size={18} className="text-gray-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products and categories…"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none"
              aria-label="Search products and categories"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 px-4 py-2.5 text-sm font-medium text-white bg-brand rounded-lg hover:opacity-90 transition-opacity "
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
