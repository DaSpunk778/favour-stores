"use server";
// Server action for placing an order. Runs only on the server, so it's the safe
// place to check the session and write to the database.

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/dal";
import { createOrder, type OrderLineInput } from "@/lib/order-store";

export type PlaceOrderResult =
  | { ok: true; orderId: number }
  | { ok: false; error: string; needsAuth?: boolean };

/**
 * Turn the caller's cart lines into a persisted order for the signed-in user.
 *
 * The client sends only { productId, quantity } per line — the price and the
 * order total are resolved server-side in createOrder, never trusted from the
 * client. We return a plain result object (instead of redirecting here) so the
 * client can clear its local cart first, then navigate to the new order.
 */
export async function placeOrder(
  lines: OrderLineInput[]
): Promise<PlaceOrderResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Please log in to place your order.", needsAuth: true };
  }

  if (!Array.isArray(lines) || lines.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  try {
    const orderId = await createOrder(user.id, lines);
    // Make sure the account pages show the new order on next visit.
    revalidatePath("/account/orders");
    return { ok: true, orderId };
  } catch (err) {
    console.error("placeOrder failed:", err);
    return { ok: false, error: "Something went wrong placing your order. Try again." };
  }
}
