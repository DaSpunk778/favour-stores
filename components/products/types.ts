// Shared types for the product listing UI — kept in one place so the listing
// orchestrator, filter controls, sort dropdown, and chips all agree.

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating"
  | "best-sellers";

export type Filters = {
  categories: string[]; // category slugs
  brands: string[]; // brand slugs
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null; // e.g. 4 = "4 stars & up"
  inStockOnly: boolean;
};

export const emptyFilters: Filters = {
  categories: [],
  brands: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  inStockOnly: false,
};

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Best Rated" },
  { value: "best-sellers", label: "Best Sellers" },
];
