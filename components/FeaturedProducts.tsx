"use client"

import Link from "next/link";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useCartStore } from "@/lib/cart-store";
import { BsBagCheck } from "react-icons/bs";
import Reveal from "@/components/anim/Reveal";

type Product = {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    compareAtPrice?: number;
    rating: number;
    reviewCount: number; //0-5
    badge?: "Best Seller" | "New" | "Sale";
};

// Static/fake data for now — swap for a real fetch (Sequelize/Postgres) once
// the products table + API route exist.

const products: Product[] = [
    {
        id: "1",
        name: "1.8L Stainless Steel Electric Kettle",
        slug: "1-8l-stainless-steel-electric-kettle",
        image: "/categories/kettles-jugs.jpg",
        price: 15500,
        compareAtPrice: 19000,
        rating: 4.5,
        reviewCount: 128,
        badge: "Best Seller",
    },
    {
        id: "2",
        name: "5.5L Digital Air Fryer",
        slug: "5-5l-digital-air-fryer",
        image: "/categories/airfryers.jpg",
        price: 42000,
        rating: 4.8,
        reviewCount: 96,
        badge: "Best Seller",
    },
    {
        id: "3",
        name: "18-Inch Rechargeable Standing Fan",
        slug: "18-inch-rechargeable-standing-fan",
        image: "/categories/fans.jpg",
        price: 38500,
        compareAtPrice: 45000,
        rating: 4.3,
        reviewCount: 64,
        badge: "Sale",
    },
    {
        id: "4",
        name: "1.5HP Split Unit Air Conditioner",
        slug: "1-5hp-split-unit-air-conditioner",
        image: "/categories/acs.jpg",
        price: 285000,
        rating: 4.6,
        reviewCount: 41,
    },
    {
        id: "5",
        name: "43-Inch Smart LED TV",
        slug: "43-inch-smart-led-tv",
        image: "/categories/tvs.jpg",
        price: 165000,
        compareAtPrice: 190000,
        rating: 4.7,
        reviewCount: 210,
        badge: "Best Seller",
    },
    {
        id: "6",
        name: "Double Door Refrigerator 260L",
        slug: "double-door-refrigerator-260l",
        image: "/categories/refrigerators.jpg",
        price: 320000,
        rating: 4.4,
        reviewCount: 57,
        badge: "New",
    },
    {
        id: "7",
        name: "7KG Front Load Washing Machine",
        slug: "7kg-front-load-washing-machine",
        image: "/categories/washing-machines.jpg",
        price: 275000,
        rating: 4.5,
        reviewCount: 33,
    },
    {
        id: "8",
        name: "Bluetooth Soundbar with Subwoofer",
        slug: "bluetooth-soundbar-with-subwoofer",
        image: "/categories/freezers.jpg",
        price: 58000,
        compareAtPrice: 70000,
        rating: 4.2,
        reviewCount: 89,
        badge: "Sale",
    },
];

const badgeStyles: Record<NonNullable<Product["badge"]>, string> = {
    "Best Seller": "bg-green text-white",
    New: "bg-[#2563eb] text-white",
    Sale: "bg-[#dc2626] text-white",
};

function formatNaira(amount: number) {
    return `₦${amount.toLocaleString("en-NG")}`;
}

function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                    key={i}
                    size={12}
                    className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"}
                />
            ))}
        </div>
    );
}

export default function FeaturedProducts() {
    const addItem = useCartStore((state) => state.addItem);

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
                {products.map((products) => (
                    <div
                        key={products.id}
                        className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/50 bg-white/25 backdrop-blur-xl shadow-lg shadow-black/5 ring-1 ring-inset ring-white/40 transition-all duration-300 hover:-translate-y-1 hover:bg-white/35 hover:shadow-xl hover:shadow-black/10"
                    >
                        {/* Badge */}
                        {products.badge && (
                            <span
                                className={`absolute top-2 left-2 z-20 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeStyles[products.badge]}`}
                            >
                                {products.badge}
                            </span>
                        )}

                        <Link href={`/products/${products.slug}`} className="block">
                            {/* Image */}
                            <div className="relative w-full aspect-square">
                                <Image
                                    src={products.image}
                                    alt={products.name}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </Link>

                        {/* Info */}
                        <div className="flex flex-col gap-1.5 p-3">
                            <Link href={`/products/${products.slug}`}>
                                <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 hover:text-brand transition-colors">
                                    {products.name}
                                </h3>
                            </Link>

                            <div className="flex items-center gap-1.5">
                                <RatingStars rating={products.rating} />
                                <span className="text-xs text-gray-600">
                                    ({products.reviewCount})
                                </span>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-bold text-gray-900">
                                    {formatNaira(products.price)}
                                </span>
                                {products.compareAtPrice && (
                                    <span className="text-xs text-gray-500 line-through">
                                        {formatNaira(products.compareAtPrice)}
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    addItem({
                                        productId: products.id,
                                        name: products.name,
                                        price: products.price,
                                        image: products.image,
                                    })
                                }
                                className="mt-1 flex items-center justify-center gap-1.5 w-full rounded-lg bg-brand/90 text-white text-xs font-semibold py-2 hover:bg-brand transition-colors"
                            >
                                <FiShoppingCart size={14} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
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