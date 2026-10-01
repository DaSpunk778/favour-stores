import type { Metadata } from "next";
import AnnouncementBar from "@/components/Layout/AnnouncementBar";
import Header from "@/components/Layout/Header";
import SearchBar from "@/components/search/SearchBar";
import Footer from "@/components/Layout/Footer";
import Breadcrumb from "@/components/products/Breadcrumb";
import ProductListing from "@/components/products/ProductListing";
import { getAllProducts, getBrandSlugs } from "@/lib/product-store";

export const metadata: Metadata = {
  title: "All Products | Favour Stores",
  description: "Browse the full range of appliances and electronics at Favour Stores.",
};

export default async function ProductsPage() {
  const [products, brandSlugs] = await Promise.all([
    getAllProducts(),
    getBrandSlugs(),
  ]);

  return (
    <>
      <AnnouncementBar />
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <SearchBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6">
          All Products
        </h1>
        <ProductListing products={products} brandSlugs={brandSlugs} />
      </main>
      <Footer />
    </>
  );
}
