import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";
import AnnouncementBar from "@/components/Layout/AnnouncementBar";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Breadcrumb from "@/components/products/Breadcrumb";
import ProductGrid from "@/components/products/ProductGrid";
import AddToCartPanel from "@/components/products/AddToCartPanel";
import ProductGallery from "@/components/products/ProductGallery";
import {
  products,
  getProductBySlug,
  getRelatedProducts,
  getBrandName,
  getProductDescription,
  formatNaira,
} from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";

// Pre-render a static page per product slug.
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product | Favour Stores" };
  return {
    title: `${product.name} | Favour Stores`,
    description: `Buy the ${product.name} at Favour Stores. ${formatNaira(
      product.price
    )}.`,
  };
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          size={16}
          className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.category);
  const related = getRelatedProducts(product);
  // Detail-page gallery = the card thumbnail plus any extra images, de-duped.
  const gallery = Array.from(
    new Set([product.image, ...(product.images ?? [])])
  );
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : null;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            ...(category
              ? [{ label: category.name, href: `/categories/${category.slug}` }]
              : []),
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div className="flex justify-center lg:justify-start">
            <ProductGallery
              images={gallery}
              alt={product.name}
              badge={product.badge}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {category && (
              <Link
                href={`/categories/${category.slug}`}
                className="text-sm font-medium text-brand hover:text-brand-dark"
              >
                {category.name}
              </Link>
            )}
            <h1 className="mt-1 text-xl sm:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2">
              <RatingStars rating={product.rating} />
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {formatNaira(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatNaira(product.compareAtPrice)}
                </span>
              )}
              {discount !== null && discount > 0 && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-sm font-semibold text-red-600">
                  -{discount}%
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-gray-500">Brand:</span>
              <span className="font-medium text-gray-900">
                {getBrandName(product.brand)}
              </span>
              <span className="text-gray-300">·</span>
              {product.inStock ? (
                <span className="font-medium text-brand">In stock</span>
              ) : (
                <span className="font-medium text-red-600">Out of stock</span>
              )}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <AddToCartPanel product={product} />
            </div>

            {/* Trust badges */}
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: FiTruck, label: "Fast delivery nationwide" },
                { icon: FiShield, label: "Genuine product warranty" },
                { icon: FiRefreshCw, label: "Easy returns" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-xs text-gray-600"
                >
                  <Icon size={18} className="shrink-0 text-brand" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Description */}
        <section className="mt-12 max-w-3xl">
          <h2 className="mb-3 text-lg sm:text-xl font-bold text-gray-900">
            Product description
          </h2>
          <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-gray-600">
            {getProductDescription(product)}
          </p>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-lg sm:text-2xl font-bold text-gray-900">
              You may also like
            </h2>
            <ProductGrid products={related} keySeed={product.slug} />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
