"use server";

// Admin product mutations. Same shape and validation style as the auth actions
// (app/actions/auth.ts): parse FormData, validate server-side, return a typed
// state for `useActionState`. On success we revalidate the whole app and
// redirect back to the product list. When the DB lands, only the store calls
// below change — this file's contract stays the same.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { slugify, productBadges, type Product } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductInput,
} from "@/lib/product-store";

export type ProductFormState = {
  ok: boolean;
  message?: string;
  // Field-level errors keyed by input name.
  errors?: Record<string, string>;
  // Echo back submitted values so the form repopulates after a failed submit.
  values?: Record<string, string>;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

// Parse + validate the shared product form. Returns a ready-to-store `input`
// when valid, otherwise `input: null` plus errors and the raw values to echo.
function parseProductForm(formData: FormData): {
  input: ProductInput | null;
  errors: Record<string, string>;
  values: Record<string, string>;
} {
  const name = getString(formData, "name");
  const slug = getString(formData, "slug");
  const category = getString(formData, "category");
  const brandRaw = getString(formData, "brand");
  const brand = slugify(brandRaw);
  const image = getString(formData, "image");
  const imagesRaw = getString(formData, "images");
  const description = getString(formData, "description");
  const priceRaw = getString(formData, "price");
  const compareRaw = getString(formData, "compareAtPrice");
  const ratingRaw = getString(formData, "rating");
  const reviewCountRaw = getString(formData, "reviewCount");
  const createdAt = getString(formData, "createdAt");
  const badgeRaw = getString(formData, "badge");
  const inStock = formData.get("inStock") === "on";
  const featured = formData.get("featured") === "on";

  // Echo raw text back so nothing the admin typed is lost on a validation error.
  const values: Record<string, string> = {
    name,
    slug,
    category,
    brand: brandRaw,
    image,
    images: imagesRaw,
    description,
    price: priceRaw,
    compareAtPrice: compareRaw,
    rating: ratingRaw,
    reviewCount: reviewCountRaw,
    createdAt,
    badge: badgeRaw,
    inStock: inStock ? "on" : "",
    featured: featured ? "on" : "",
  };

  const errors: Record<string, string> = {};

  if (!name) errors.name = "Product name is required.";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters.";

  if (!category) errors.category = "Please choose a category.";
  else if (!getCategoryBySlug(category))
    errors.category = "That category doesn't exist.";

  if (!brand) errors.brand = "Brand is required.";

  if (!image) errors.image = "A main image (URL or path) is required.";

  const price = Number(priceRaw);
  if (!priceRaw) errors.price = "Price is required.";
  else if (!Number.isFinite(price) || price < 0)
    errors.price = "Enter a valid price.";

  let compareAtPrice: number | undefined;
  if (compareRaw) {
    const c = Number(compareRaw);
    if (!Number.isFinite(c) || c < 0)
      errors.compareAtPrice = "Enter a valid compare-at price.";
    else if (Number.isFinite(price) && c <= price)
      errors.compareAtPrice = "Compare-at price should be higher than the price.";
    else compareAtPrice = c;
  }

  let rating = 0;
  if (ratingRaw) {
    rating = Number(ratingRaw);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5)
      errors.rating = "Rating must be between 0 and 5.";
  }

  let reviewCount = 0;
  if (reviewCountRaw) {
    reviewCount = Number(reviewCountRaw);
    if (!Number.isInteger(reviewCount) || reviewCount < 0)
      errors.reviewCount = "Reviews must be a whole number (0 or more).";
  }

  const badge = (productBadges as readonly string[]).includes(badgeRaw)
    ? (badgeRaw as Product["badge"])
    : undefined;

  // Gallery images: one URL/path per line.
  const images = imagesRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Default the date to today if the admin left it blank.
  const finalCreatedAt = createdAt || new Date().toISOString().slice(0, 10);

  if (Object.keys(errors).length > 0) {
    return { input: null, errors, values };
  }

  const input: ProductInput = {
    name,
    slug: slug || undefined,
    image,
    images,
    price,
    compareAtPrice,
    rating,
    reviewCount,
    category,
    brand,
    inStock,
    featured,
    createdAt: finalCreatedAt,
    badge,
    description: description || undefined,
  };

  return { input, errors, values };
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const { input, errors, values } = parseProductForm(formData);
  if (!input) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors,
      values,
    };
  }

  await createProduct(input);
  // A product edit can touch home / listing / detail / category at once, so
  // invalidate everything — the simple, correct refresh (see revalidatePath).
  revalidatePath("/", "layout");
  redirect("/admin/products?created=1");
}

export async function updateProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const id = getString(formData, "id");
  if (!id) return { ok: false, message: "Missing product id." };

  const { input, errors, values } = parseProductForm(formData);
  if (!input) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors,
      values,
    };
  }

  const updated = await updateProduct(id, input);
  if (!updated) {
    return { ok: false, message: "That product no longer exists." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/products?updated=1");
}

// Plain form action (no useActionState): reads the hidden id, deletes, and
// redirects back to the refreshed list.
export async function deleteProductAction(formData: FormData): Promise<void> {
  const id = getString(formData, "id");
  if (!id) return;

  await deleteProduct(id);
  revalidatePath("/", "layout");
  redirect("/admin/products?deleted=1");
}
