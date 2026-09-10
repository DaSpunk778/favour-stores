import type { Metadata } from "next";
import type { IconType } from "react-icons";
import Link from "next/link";
import {
  FiBox,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiGrid,
  FiPlus,
  FiArrowRight,
  FiEdit2,
} from "react-icons/fi";

import { formatNaira } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import { getAllProducts } from "@/lib/product-store";

export const metadata: Metadata = { title: "Dashboard · Favour Stores" };

function StatCard({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: number;
  Icon: IconType;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}
      >
        <Icon size={18} />
      </span>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const products = await getAllProducts();

  const total = products.length;
  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = total - inStock;
  const featured = products.filter((p) => p.featured).length;
  const categoryCount = new Set(products.map((p) => p.category)).size;

  // Newest first for the "Recently added" list.
  const recent = [...products]
    .sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt) || Number(b.id) - Number(a.id)
    )
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            An overview of your catalog. Add and manage products from here.
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total products"
          value={total}
          Icon={FiBox}
          tone="bg-brand/10 text-brand"
        />
        <StatCard
          label="In stock"
          value={inStock}
          Icon={FiCheckCircle}
          tone="bg-green-100 text-green-600"
        />
        <StatCard
          label="Out of stock"
          value={outOfStock}
          Icon={FiXCircle}
          tone="bg-red-100 text-red-600"
        />
        <StatCard
          label="Featured"
          value={featured}
          Icon={FiStar}
          tone="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="Categories"
          value={categoryCount}
          Icon={FiGrid}
          tone="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Recently added */}
      <section className="rounded-2xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Recently added
          </h2>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark"
          >
            View all
            <FiArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-500">No products yet.</p>
            <Link
              href="/admin/products/new"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              <FiPlus size={15} />
              Add your first product
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recent.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50"
              >
                {/* Arbitrary image paths — plain <img> avoids next/image host config. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-lg border border-gray-200 bg-gray-50 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{p.name}</p>
                  <p className="truncate text-xs text-gray-400">
                    {getCategoryBySlug(p.category)?.name ?? p.category}
                  </p>
                </div>
                <span className="hidden shrink-0 text-sm font-medium text-gray-700 sm:block">
                  {formatNaira(p.price)}
                </span>
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FiEdit2 size={13} />
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
