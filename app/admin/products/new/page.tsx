import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "@/app/admin/actions";
import { getBrandSlugs } from "@/lib/product-store";

export const metadata: Metadata = { title: "Add product · Favour Stores" };

export default async function NewProductPage() {
  const brandSuggestions = await getBrandSlugs();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <FiArrowLeft size={15} />
          Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Add product</h1>
        <p className="text-sm text-gray-500">
          Fill in the details below. It goes live on the storefront as soon as
          you save.
        </p>
      </div>

      <ProductForm
        action={createProductAction}
        submitLabel="Add product"
        brandSuggestions={brandSuggestions}
      />
    </div>
  );
}
