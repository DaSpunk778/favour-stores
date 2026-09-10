import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import ProductForm from "@/components/admin/ProductForm";
import { updateProductAction } from "@/app/admin/actions";
import { getProductById, getBrandSlugs } from "@/lib/product-store";

export const metadata: Metadata = { title: "Edit product · Favour Stores" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, brandSuggestions] = await Promise.all([
    getProductById(id),
    getBrandSlugs(),
  ]);

  if (!product) {
    notFound();
  }

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
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Edit product</h1>
        <p className="text-sm text-gray-500">
          Editing{" "}
          <span className="font-medium text-gray-700">{product.name}</span>.
          Changes apply to the storefront as soon as you save.
        </p>
      </div>

      <ProductForm
        action={updateProductAction}
        product={product}
        submitLabel="Save changes"
        brandSuggestions={brandSuggestions}
      />
    </div>
  );
}
