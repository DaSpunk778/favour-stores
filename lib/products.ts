// Pure, client-safe product contract: the `Product` type plus formatters and
// display helpers. This file has NO data and NO `fs` — it's importable from
// anywhere (server or client components).
//
// The catalog data + all reads/writes live in `lib/product-store.ts` (server
// only), which reads `data/products.json` today and will read Sequelize once
// the DB is live. Keeping the type and formatters here means client components
// can render products without pulling the server-only store into the browser
// bundle.

export type Product = {
  id: string;
  name: string;
  slug: string;
  image: string;
  images?: string[]; // extra gallery images beyond `image` (shown as thumbnails
  // on the detail page). The admin dashboard populates this; `image` stays
  // the single card/listing thumbnail.
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  category: string; // category slug — see lib/categories.ts
  brand: string; // brand slug — see BrandsCarousel
  inStock: boolean;
  featured?: boolean; // shown in the homepage "Best Sellers" grid
  createdAt: string; // ISO date — used for "Newest" sort
  badge?: "Best Seller" | "New" | "Sale";
  description?: string; // long-form copy shown on the detail page; the admin
  // dashboard populates this per product. Optional — use
  // getProductDescription() to render a sensible fallback when it's empty.
};

// The product-shaped badge values, exposed as an array for the admin form's
// badge <select>. Keep in sync with the `badge` field above.
export const productBadges = ["Best Seller", "New", "Sale"] as const;

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

// Display names for brand slugs. Keep in sync with BrandsCarousel; falls back to
// a capitalized slug for anything not listed here.
const brandNames: Record<string, string> = {
  hisense: "Hisense",
  lg: "LG",
  skyrun: "Skyrun",
  aeon: "Aeon",
  royal: "Royal",
  century: "Century",
  mewe: "Mewe",
  tcl: "TCL",
  snowsea: "Snowsea",
  sony: "Sony",
  senwei: "Senwei",
  philips: "Philips",
  panasonic: "Panasonic",
};

export function getBrandName(slug: string): string {
  return brandNames[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

// Detail-page description. Until every product has per-product copy from the
// admin dashboard, synthesize a readable placeholder from the fields we already
// have so the section never renders empty.
export function getProductDescription(product: Product): string {
  if (product.description?.trim()) return product.description;
  const brand = getBrandName(product.brand);
  return `The ${product.name} from ${brand} blends dependable performance with everyday value. Backed by genuine warranty and fast nationwide delivery, it's a solid pick for your home. Full product details are coming soon.`;
}

// Turn a product name into a URL-safe slug. Shared by the admin store so the
// slug it derives matches what the storefront links to.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics → single dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}
