import type { Metadata } from "next";
import Link from "next/link";
import { FiPlus, FiEdit2, FiCheckCircle, FiInbox } from "react-icons/fi";

import { formatNaira, getBrandName } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import { getAllProducts } from "@/lib/product-store";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const metadata: Metadata = { title: "Products · Favour Stores" };

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "green" | "red" | "amber" | "gray";
}) {
  const tones = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
  }>;
}) {
  const [params, products] = await Promise.all([
    searchParams,
    getAllProducts(),
  ]);

  // Success banner text driven by the redirect query from actions.ts.
  const banner = params.created
    ? "Product added."
    : params.updated
      ? "Changes saved."
      : params.deleted
        ? "Product deleted."
        : null;

  const rows = [...products].sort(
    (a, b) =>
      b.createdAt.localeCompare(a.createdAt) || Number(b.id) - Number(a.id)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            in your catalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          <FiPlus size={16} />
          Add product
        </Link>
      </div>

      {banner && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <FiCheckCircle size={16} className="shrink-0" />
          {banner}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <FiInbox size={22} />
          </span>
          <p className="mt-4 font-medium text-gray-900">No products yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Add your first product to see it here and on the storefront.
          </p>
          <Link
            href="/admin/products/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <FiPlus size={16} />
            Add product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Brand</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Arbitrary paths — plain <img> avoids next/image host config. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-lg border border-gray-200 bg-gray-50 object-cover"
                        />
                        <div className="min-w-0 max-w-[240px]">
                          <p className="truncate font-medium text-gray-900">
                            {p.name}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {getCategoryBySlug(p.category)?.name ?? p.category}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {getBrandName(p.brand)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatNaira(p.price)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {p.inStock ? (
                          <Pill tone="green">In stock</Pill>
                        ) : (
                          <Pill tone="red">Out of stock</Pill>
                        )}
                        {p.featured && <Pill tone="amber">Featured</Pill>}
                        {p.badge && <Pill tone="gray">{p.badge}</Pill>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <FiEdit2 size={13} />
                          Edit
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
