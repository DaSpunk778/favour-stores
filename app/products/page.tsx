import type { Metadata } from "next";
import AnnouncementBar from "@/components/Layout/AnnouncementBar";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Breadcrumb from "@/components/products/Breadcrumb";
import ProductListing from "@/components/products/ProductListing";

export const metadata: Metadata = {
  title: "All Products | Favour Stores",
  description: "Browse the full range of appliances and electronics at Favour Stores.",
};

export default function ProductsPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6">
          All Products
        </h1>
        <ProductListing />
      </main>
      <Footer />
    </>
  );
}
