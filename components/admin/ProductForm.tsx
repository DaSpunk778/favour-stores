"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { FiUpload, FiLoader } from "react-icons/fi";

import type { Product } from "@/lib/products";
import { productBadges } from "@/lib/products";
import { categories } from "@/lib/categories";
import type { ProductFormState } from "@/app/admin/actions";
import { uploadProductImages, type UploadResult } from "@/app/admin/upload";
import SubmitButton from "@/components/auth/SubmitButton";
import { TextField, SelectField, TextareaField, ToggleField } from "./Field";

type Action = (
  state: ProductFormState,
  formData: FormData
) => Promise<ProductFormState>;

type ProductFormProps = {
  action: Action;
  product?: Product; // present when editing
  submitLabel: string;
  brandSuggestions: string[]; // known brand slugs for the datalist
};

const initialState: ProductFormState = { ok: false };

// Shared input classes for the one controlled input (the image field), matched
// to components/admin/Field so it looks identical to the rest of the form.
const controlBase =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all";
function controlCls(error?: string) {
  return `${controlBase} ${
    error
      ? "border-red-400 ring-2 ring-red-100 focus:border-red-500"
      : "border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
  }`;
}

// A styled <label> wrapping a hidden file input — the friendly "Upload" button.
function UploadButton({
  onFiles,
  busy,
  multiple,
  children,
}: {
  onFiles: (files: File[]) => void;
  busy?: boolean;
  multiple?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 ${
        busy ? "pointer-events-none opacity-60" : ""
      }`}
    >
      {busy ? (
        <FiLoader size={15} className="animate-spin" />
      ) : (
        <FiUpload size={15} />
      )}
      {children}
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = ""; // let the same file be re-picked
          if (files.length) onFiles(files);
        }}
      />
    </label>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function ProductForm({
  action,
  product,
  submitLabel,
  brandSuggestions,
}: ProductFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  // The image field is controlled so the live preview and stock-image picker
  // can update it. Everything else is uncontrolled (defaultValue).
  const [image, setImage] = useState(product?.image ?? "");
  // The gallery is controlled too, so uploaded paths can be appended to it.
  const [gallery, setGallery] = useState((product?.images ?? []).join("\n"));
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const galleryList = gallery
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Fail fast on the client with a friendly message rather than tripping the
  // server action's 12MB body limit (which would throw, not return cleanly).
  const MAX_FILE = 8 * 1024 * 1024; // 8MB per file
  const MAX_TOTAL = 11 * 1024 * 1024; // keep the whole request under the cap

  function validateFiles(files: File[]): string | null {
    for (const f of files) {
      if (!f.type.startsWith("image/")) return `“${f.name}” isn’t an image.`;
      if (f.size > MAX_FILE) return `“${f.name}” is larger than 8MB.`;
    }
    if (files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL)
      return "Those files total more than 11MB — upload fewer or smaller ones.";
    return null;
  }

  async function runUpload(files: File[]): Promise<UploadResult | null> {
    const err = validateFiles(files);
    if (err) {
      setUploadError(err);
      return null;
    }
    setUploadError(null);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    try {
      return await uploadProductImages(fd);
    } catch {
      setUploadError(
        "Upload failed — the images may be too large. Try smaller files."
      );
      return null;
    }
  }

  async function handleMainUpload(files: File[]) {
    setUploadingMain(true);
    const res = await runUpload(files.slice(0, 1));
    setUploadingMain(false);
    if (res?.ok && res.paths[0]) setImage(res.paths[0]);
    else if (res && !res.ok) setUploadError(res.error ?? "Upload failed.");
  }

  async function handleGalleryUpload(files: File[]) {
    setUploadingGallery(true);
    const res = await runUpload(files);
    setUploadingGallery(false);
    if (res?.ok) {
      setGallery((prev) => {
        const existing = prev
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean);
        return [...existing, ...res.paths].join("\n");
      });
    } else if (res && !res.ok) {
      setUploadError(res.error ?? "Upload failed.");
    }
  }

  const categoryOptions = categories
    .filter((c) => !c.comingSoon)
    .map((c) => ({ value: c.slug, label: c.name }));
  const badgeOptions = [
    { value: "", label: "No badge" },
    ...productBadges.map((b) => ({ value: b, label: b })),
  ];

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* Top banner: only errors surface here — success redirects to the list. */}
      {state.message && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </div>
      )}

      <Section
        title="Basics"
        description="The essentials shoppers see first."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            label="Product name"
            name="name"
            required
            defaultValue={product?.name}
            error={state.errors?.name}
            placeholder="e.g. 1.8L Stainless Steel Electric Kettle"
          />
          <TextField
            label="URL slug"
            name="slug"
            defaultValue={product?.slug}
            error={state.errors?.slug}
            placeholder="auto-generated from the name"
            hint="Leave blank to generate it automatically. Editing this changes the product's web link."
          />
          <SelectField
            label="Category"
            name="category"
            required
            options={categoryOptions}
            defaultValue={product?.category}
            placeholder="Choose a category"
            error={state.errors?.category}
          />
          <TextField
            label="Brand"
            name="brand"
            required
            list="admin-brands"
            defaultValue={product?.brand}
            error={state.errors?.brand}
            hint="Pick an existing brand or type a new one."
          />
        </div>
        <datalist id="admin-brands">
          {brandSuggestions.map((b) => (
            <option key={b} value={b} />
          ))}
        </datalist>
      </Section>

      <Section title="Pricing" description="All prices are in Naira (₦).">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            label="Price (₦)"
            name="price"
            type="number"
            min={0}
            inputMode="numeric"
            required
            defaultValue={product?.price?.toString()}
            error={state.errors?.price}
            placeholder="15500"
          />
          <TextField
            label="Compare-at price (₦)"
            name="compareAtPrice"
            type="number"
            min={0}
            inputMode="numeric"
            defaultValue={product?.compareAtPrice?.toString()}
            error={state.errors?.compareAtPrice}
            hint="Optional. The old price, shown struck-through as a discount."
            placeholder="19000"
          />
        </div>
      </Section>

      <Section
        title="Media"
        description="A main image is required. Upload photos from your computer, paste an image URL/path, or pick a stock image."
      >
        <div className="flex flex-col gap-5">
          {/* Controlled main image field + upload-from-computer */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="image"
              className="text-sm font-medium text-gray-700"
            >
              Main image <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                id="image"
                name="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Upload, or paste a URL / path"
                aria-invalid={state.errors?.image ? true : undefined}
                className={`${controlCls(state.errors?.image)} min-w-0 sm:flex-1`}
              />
              <UploadButton onFiles={handleMainUpload} busy={uploadingMain}>
                {uploadingMain ? "Uploading…" : "Upload from computer"}
              </UploadButton>
            </div>
            {state.errors?.image ? (
              <p className="text-xs font-medium text-red-500">
                {state.errors.image}
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Choose a photo from your device, or paste an image URL / a path
                like /categories/blenders.jpg. This is the card thumbnail.
              </p>
            )}
          </div>

          {uploadError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {uploadError}
            </p>
          )}

          {/* Live preview + stock-image quick-pick */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
            <div>
              <p className="mb-1.5 text-sm font-medium text-gray-700">Preview</p>
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt="Selected product"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="px-2 text-center text-xs text-gray-400">
                    No image yet
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium text-gray-700">
                Or pick a stock image
              </p>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setImage(c.image)}
                    title={c.name}
                    aria-label={`Use ${c.name} image`}
                    className={`relative aspect-square overflow-hidden rounded-lg border transition-all ${
                      image === c.image
                        ? "border-brand ring-2 ring-brand/30"
                        : "border-gray-200 hover:border-brand/50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controlled gallery: upload several at once, or edit the list. */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="images"
                className="text-sm font-medium text-gray-700"
              >
                Gallery images
              </label>
              <UploadButton
                onFiles={handleGalleryUpload}
                busy={uploadingGallery}
                multiple
              >
                {uploadingGallery ? "Uploading…" : "Upload images"}
              </UploadButton>
            </div>
            <textarea
              id="images"
              name="images"
              value={gallery}
              onChange={(e) => setGallery(e.target.value)}
              rows={3}
              placeholder={"/uploads/photo-1.jpg\n/uploads/photo-2.jpg"}
              className={`${controlBase} resize-y border-gray-200 leading-relaxed focus:border-brand focus:ring-2 focus:ring-brand/20`}
            />
            <p className="text-xs text-gray-500">
              Optional extra photos shown on the product page. Upload several at
              once, or list one image URL/path per line.
            </p>
            {galleryList.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {galleryList.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="h-14 w-14 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section
        title="Availability"
        description="Control where and how this product shows up."
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ToggleField
              label="In stock"
              name="inStock"
              defaultChecked={product?.inStock ?? true}
              hint="Turn off to show “Out of stock” and disable Add to Cart."
            />
            <ToggleField
              label="Featured"
              name="featured"
              defaultChecked={product?.featured ?? false}
              hint="Featured products appear in the homepage Best Sellers grid."
            />
          </div>
          <div className="sm:max-w-xs">
            <SelectField
              label="Badge"
              name="badge"
              options={badgeOptions}
              defaultValue={product?.badge ?? ""}
              hint="Optional ribbon shown on the product card."
            />
          </div>
        </div>
      </Section>

      <Section
        title="Details"
        description="Description and the numbers shown on the product page."
      >
        <div className="flex flex-col gap-5">
          <TextareaField
            label="Description"
            name="description"
            defaultValue={product?.description}
            rows={5}
            hint="Optional. If left blank, a friendly placeholder is shown until you add copy."
            placeholder="Describe the product's key features and benefits…"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <TextField
              label="Rating"
              name="rating"
              type="number"
              min={0}
              step={0.1}
              inputMode="decimal"
              defaultValue={product?.rating?.toString()}
              error={state.errors?.rating}
              hint="0 to 5"
              placeholder="4.5"
            />
            <TextField
              label="Review count"
              name="reviewCount"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={product?.reviewCount?.toString()}
              error={state.errors?.reviewCount}
              placeholder="128"
            />
            <TextField
              label="Date added"
              name="createdAt"
              type="date"
              defaultValue={product?.createdAt ?? today}
              hint="Used for “Newest” sorting."
            />
          </div>
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <div className="w-full sm:w-56">
          <SubmitButton>{submitLabel}</SubmitButton>
        </div>
        <Link
          href="/admin/products"
          className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
