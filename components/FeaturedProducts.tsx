"use client"

import Link from "next/link";
import { BsBagCheck } from "react-icons/bs";
import Reveal from "@/components/anim/Reveal";
import ProductCard from "@/components/products/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

// Homepage "Best Sellers" grid. Data + card markup now live in shared modules
// (lib/products.ts, components/products/ProductCard) so these match the
// listing pages exactly.
const featured = getFeaturedProducts();

export default function FeaturedProducts() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    <span>Best Sellers </span>
                    <span className="inline-flex"><BsBagCheck size={20} color="green" /></span>
                </h2>
                <Link
                    href="/products"
                    className="border border-[#c6f4c6] bg-[#cdf4cd] w-fit px-3 py-1  text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                    More products
                </Link>
            </div>

            <Reveal
                stagger
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            >
                {featured.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Reveal>
            <div className="flex justify-center mt-8">
                <Link
                    href="/products"
                    className="text-[13px] inline-flex items-center justify-center  border border-brand text-brand font-semibold px-8 py-3 hover:bg-brand hover:text-white transition-colors duration-150"
                >
                    View All Products
                </Link>
            </div>
        </section>
    );
}
