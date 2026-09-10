"use client";

import Link from "next/link";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useCartStore } from "@/lib/cart-store";
import { formatNaira, type Product } from "@/lib/products";
import ProductBadge from "./ProductBadge";

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

// Shared product card used by the homepage best-sellers grid and the product
// listing pages. Keep this the single source of card markup so cards stay
// visually identical everywhere.
export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="group relative flex h-full flex-col rounded-2xl overflow-hidden border border-white/50 bg-white/25 backdrop-blur-xl shadow-lg shadow-black/5 ring-1 ring-inset ring-white/40 transition-all duration-300 hover:-translate-y-1 hover:bg-white/35 hover:shadow-xl hover:shadow-black/10">
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-2 left-2 z-20">
          <ProductBadge badge={product.badge} />
        </span>
      )}

      {/* Out-of-stock overlay */}
      {!product.inStock && (
        <span className="absolute top-2 right-2 z-20 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-800/80 text-white">
          Out of stock
        </span>
      )}

      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative w-full aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="min-h-10 text-sm font-medium text-gray-900 leading-snug line-clamp-2 hover:text-brand transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5">
          <RatingStars rating={product.rating} />
          <span className="text-xs text-gray-600">({product.reviewCount})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-gray-900">
            {formatNaira(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-gray-500 line-through">
              {formatNaira(product.compareAtPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!product.inStock}
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            })
          }
          className="mt-auto flex items-center justify-center gap-1.5 w-full rounded-lg bg-brand/90 text-white text-xs font-semibold py-2 hover:bg-brand transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <FiShoppingCart size={14} />
          {product.inStock ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
