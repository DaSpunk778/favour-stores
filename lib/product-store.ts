// Server-only data layer for the product catalog. This is the ONE file that
// changes when the real database lands: today it reads/writes the JSON file at
// `data/products.json`; later it swaps `fs` for Sequelize (see lib/db.ts) while
// every exported signature below stays identical, so neither the storefront nor
// the admin dashboard has to change.
//
// `server-only` makes Next fail the build if any Client Component imports this
// (the node:fs/node:path imports would break the browser bundle anyway — this
// just turns that into a clear, early error). Reads go through fs.readFile, not
// a JSON `import`, so writes made at runtime are visible on the next read.

import "server-only";

import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";

import { slugify, type Product } from "@/lib/products";
// Bundled fallback used only to seed the file on first run if it's missing.
import seed from "@/data/products.json";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

// Fields the admin form supplies. `id` and `slug` are derived by the store, so
// callers never set them (slug can be optionally overridden on the form).
export type ProductInput = {
  name: string;
  slug?: string;
  image: string;
  images?: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  featured?: boolean;
  createdAt: string;
  badge?: Product["badge"];
  description?: string;
};

function isENOENT(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as NodeJS.ErrnoException).code === "ENOENT"
  );
}

// Uncached read used by mutations so they always act on the current file, never
// a value cached earlier in the same request.
async function readStoreRaw(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch (err) {
    if (isENOENT(err)) {
      // First run / file deleted: seed from the bundled snapshot and try to
      // persist it. On a read-only FS (serverless) the write fails silently and
      // we serve the in-memory seed — durable writes arrive with the DB swap.
      const list = seed as unknown as Product[];
      try {
        await writeStore(list);
      } catch {
        /* read-only FS — fall back to the in-memory seed */
      }
      return list;
    }
    throw err;
  }
}

async function writeStore(list: Product[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2) + "\n", "utf8");
}

// Per-render dedupe: multiple reads within one server render hit disk once.
// A new request (after revalidatePath) gets a fresh cache and re-reads the file.
const readStore = cache(readStoreRaw);

function nextId(list: Product[]): string {
  const max = list.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);
  return String(max + 1);
}

// Ensure the slug is unique, appending -2, -3, … if needed (skipping `exceptId`
// so a product keeps its own slug on update).
function uniqueSlug(base: string, list: Product[], exceptId?: string): string {
  const taken = new Set(
    list.filter((p) => p.id !== exceptId).map((p) => p.slug)
  );
  const root = base || "product";
  let slug = root;
  let n = 2;
  while (taken.has(slug)) slug = `${root}-${n++}`;
  return slug;
}

// Normalize form input into a clean Product. Empty optionals are left undefined
// so JSON.stringify drops them and the file stays tidy.
function buildProduct(input: ProductInput, id: string, slug: string): Product {
  return {
    id,
    slug,
    name: input.name,
    image: input.image,
    images: input.images?.length ? input.images : undefined,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    rating: input.rating,
    reviewCount: input.reviewCount,
    category: input.category,
    brand: input.brand,
    inStock: input.inStock,
    featured: input.featured || undefined,
    createdAt: input.createdAt,
    badge: input.badge,
    description: input.description?.trim() ? input.description : undefined,
  };
}

/* ---------- Reads (async; mirror the old lib/products.ts helpers) ---------- */

export async function getAllProducts(): Promise<Product[]> {
  return readStore();
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await readStore()).filter((p) => p.featured);
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  return (await readStore()).filter((p) => p.category === categorySlug);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  return (await readStore()).find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return (await readStore()).find((p) => p.id === id);
}

// Related products: same category first (excluding the current product), then
// same-brand items if the category is thin, capped at `limit`.
export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await readStore();
  const sameCategory = all.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const sameBrand = all.filter(
    (p) =>
      p.id !== product.id &&
      p.brand === product.brand &&
      p.category !== product.category
  );
  return [...sameCategory, ...sameBrand].slice(0, limit);
}

// Distinct brand slugs present in the catalog — used to build the brand filter
// so it only ever offers brands that actually have products. Replaces the old
// `brandSlugs` const.
export async function getBrandSlugs(): Promise<string[]> {
  const all = await readStore();
  return Array.from(new Set(all.map((p) => p.brand))).sort();
}

/* ---------------------------- Mutations ---------------------------------- */

export async function createProduct(input: ProductInput): Promise<Product> {
  const list = await readStoreRaw();
  const id = nextId(list);
  const slug = uniqueSlug(slugify(input.slug?.trim() || input.name), list);
  const product = buildProduct(input, id, slug);
  list.push(product);
  await writeStore(list);
  return product;
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product | undefined> {
  const list = await readStoreRaw();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;

  // Keep the existing slug (stable URLs) unless the admin explicitly types a
  // different one in the form.
  let slug = list[idx].slug;
  const explicit = input.slug?.trim();
  if (explicit) {
    const base = slugify(explicit);
    if (base && base !== slug) slug = uniqueSlug(base, list, id);
  }

  const updated = buildProduct(input, id, slug);
  list[idx] = updated;
  await writeStore(list);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const list = await readStoreRaw();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) return false; // nothing removed
  await writeStore(next);
  return true;
}
