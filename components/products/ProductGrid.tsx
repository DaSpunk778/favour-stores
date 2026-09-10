"use client";

import Reveal from "@/components/anim/Reveal";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

// Wraps the ProductCard map with the same grid classes used on the homepage.
// Keyed on `keySeed` so the Reveal stagger re-runs when the page/filters change
// (otherwise GSAP would leave newly-swapped cards at opacity from a prior run).
export default function ProductGrid({
  products,
  keySeed,
}: {
  products: Product[];
  keySeed?: string | number;
}) {
  return (
    <Reveal
      key={keySeed}
      stagger
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Reveal>
  );
}
