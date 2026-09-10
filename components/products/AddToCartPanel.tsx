"use client";

import { useState } from "react";
import { FiShoppingCart, FiMinus, FiPlus, FiCheck } from "react-icons/fi";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/products";

// Interactive purchase controls for the detail page: quantity stepper + add to
// cart. Kept as its own client component so the surrounding detail page can stay
// a server component.
export default function AddToCartPanel({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      qty
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  if (!product.inStock) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-xl bg-gray-200 text-gray-500 text-sm font-semibold py-3.5 cursor-not-allowed"
      >
        Out of stock
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Quantity stepper */}
      <div className="flex items-center rounded-xl border border-gray-200">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          className="grid h-12 w-12 place-items-center text-gray-600 hover:text-brand disabled:opacity-40 disabled:pointer-events-none"
        >
          <FiMinus size={16} />
        </button>
        <span className="w-10 text-center text-sm font-semibold text-gray-900">
          {qty}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => q + 1)}
          className="grid h-12 w-12 place-items-center text-gray-600 hover:text-brand"
        >
          <FiPlus size={16} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand text-white text-sm font-semibold py-3.5 px-6 hover:bg-brand-dark transition-colors"
      >
        {added ? (
          <>
            <FiCheck size={18} />
            Added to cart
          </>
        ) : (
          <>
            <FiShoppingCart size={18} />
            Add to cart
          </>
        )}
      </button>
    </div>
  );
}
