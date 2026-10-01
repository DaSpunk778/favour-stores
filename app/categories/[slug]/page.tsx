import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/Layout/AnnouncementBar";
import Header from "@/components/Layout/Header";
import SearchBar from "@/components/search/SearchBar";
import Footer from "@/components/Layout/Footer";
import Breadcrumb from "@/components/products/Breadcrumb";
import ProductListing from "@/components/products/ProductListing";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { getAllProducts, getBrandSlugs } from "@/lib/product-store";

// Pre-render a static page per known category slug.
export function generateStaticParams() {
  return categories.filter((c) => !c.comingSoon).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category | Favour Stores" };
  return {
    title: `${category.name} | Favour Stores`,
    description: `Shop ${category.name} at Favour Stores.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  // Unknown slug, or a category not yet open for shopping.
  if (!category || category.comingSoon) {
    notFound();
  }

  // Pass the full catalog + brand list; `initialCategory` pre-selects this
  // category's filter while still letting shoppers broaden the selection.
  const [products, brandSlugs] = await Promise.all([
    getAllProducts(),
    getBrandSlugs(),
  ]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <SearchBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/products" },
            { label: category.name },
          ]}
        />
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6">
          {category.name}
        </h1>
        <ProductListing
          initialCategory={category.slug}
          products={products}
          brandSlugs={brandSlugs}
        />
      </main>
      <Footer />
    </>
  );
}
