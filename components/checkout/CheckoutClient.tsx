"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { useCartStore } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatNaira } from "@/lib/products";
import { placeOrder } from "@/app/actions/orders";

export default function CheckoutClient({ isAuthed }: { isAuthed: boolean }) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const [error, setError] = useState<string | null>(null);
  // useTransition keeps the UI responsive and gives us a pending flag while the
  // server action runs.
  const [isPending, startTransition] = useTransition();

  // The cart lives in localStorage (zustand persist), unavailable during server
  // render. useHydrated renders the same "loading" markup on server + first
  // client pass, then flips to true — avoiding a hydration mismatch.
  const hydrated = useHydrated();

  function handlePlaceOrder() {
    setError(null);
    // Send only product id + quantity; the server resolves prices itself.
    const lines = items.map((i) => ({ productId: i.productId, quantity: i.qty }));

    startTransition(async () => {
      const result = await placeOrder(lines);
      if (result.ok) {
        clearCart();
        router.push(`/account/orders/${result.orderId}`);
      } else if (result.needsAuth) {
        router.push("/login");
      } else {
        setError(result.error);
      }
    });
  }

  if (!hydrated) {
    return <p className="text-sm text-gray-500">Loading your cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-10 text-center shadow-sm">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 text-sm font-medium text-white bg-brand rounded-lg hover:opacity-90 transition-opacity"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    // min-w-0 on the grid + its children stops a long product name from forcing
    // the tracks wider than the viewport (grid/flex items default to
    // min-width:auto, which is what causes the horizontal overflow on mobile).
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
      {/* Cart line items */}
      <ul className="min-w-0 bg-white border border-gray-100 rounded-xl shadow-sm divide-y divide-gray-100">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.variantId ?? ""}`}
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg bg-gray-50 overflow-hidden relative">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">
                {formatNaira(item.price)} × {item.qty}
              </p>
            </div>
            <p className="text-sm font-semibold text-gray-900 shrink-0">
              {formatNaira(item.price * item.qty)}
            </p>
            <button
              onClick={() => removeItem(item.productId, item.variantId)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              aria-label={`Remove ${item.name}`}
            >
              <FiTrash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      {/* Summary / place order */}
      <div className="min-w-0 bg-white border border-gray-100 rounded-xl shadow-sm p-5 lg:sticky lg:top-20">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Order summary</h2>
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-500">Total</span>
          <span className="text-lg font-bold text-gray-900">{formatNaira(totalPrice)}</span>
        </div>

        {!isAuthed && (
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mb-3">
            You&apos;ll be asked to log in to complete your order.
          </p>
        )}

        {error && (
          <p className="text-xs text-red-700 bg-red-50 rounded-lg p-2 mb-3">{error}</p>
        )}

        <button
          onClick={handlePlaceOrder}
          disabled={isPending}
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-brand rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isPending ? "Placing order…" : "Place order"}
        </button>
      </div>
    </div>
  );
}
