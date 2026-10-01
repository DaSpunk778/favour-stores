"use client";

import { useSyncExternalStore } from "react";

// A noop subscription — we never need to re-fire; we only care about the
// server-vs-client snapshot difference.
const subscribe = () => () => {};

/**
 * Returns false during server render AND the first client render, then true.
 *
 * Use this to gate anything that depends on client-only state (e.g. the cart,
 * which lives in localStorage via zustand `persist`). Rendering the same output
 * on the server and the first client pass avoids React hydration mismatches,
 * without a setState-in-effect. After hydration, React re-renders with `true`.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}
