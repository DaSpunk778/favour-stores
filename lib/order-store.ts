// Server-only data layer for orders. Mirrors the shape/approach of
// lib/product-store.ts: all order reads/writes go through this one file, so the
// rest of the app never touches Sequelize directly.
//
// It talks to Postgres (via the models wired in lib/models.ts) and returns
// plain, serializable objects (never raw Sequelize instances) so the results
// can be handed straight to Client Components.

import "server-only";

import { Order, OrderItem, sequelize } from "@/lib/models";
import { getProductById } from "@/lib/product-store";

/* ------------------------------- Types ----------------------------------- */

// What the checkout sends us: just the product and how many. We deliberately do
// NOT accept a price from the client — prices are re-resolved on the server (see
// createOrder) so a tampered request can't set its own price.
export type OrderLineInput = {
  productId: string;
  quantity: number;
};

// A single purchased line, as the UI reads it.
export type OrderItemView = {
  id: number;
  productId: string;
  name: string;
  price: number; // unit price (Naira)
  image: string | null;
  quantity: number;
  lineTotal: number; // price * quantity, precomputed for convenience
};

// One order with its items — used by both the list and the detail page.
export type OrderView = {
  id: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  total: number;
  createdAt: string; // ISO string (Date is not serializable to Client Components)
  itemCount: number; // total units across all items
  items: OrderItemView[];
};

/* ----------------------------- Serializers -------------------------------- */

// pg returns DECIMAL columns as strings; coerce to number for the UI.
function toNumber(value: unknown): number {
  const n = typeof value === "string" ? parseFloat(value) : Number(value);
  return Number.isFinite(n) ? n : 0;
}

// The plain shape of an Order row (from Sequelize's `.get({ plain: true })`).
// Named so we can also annotate the map callbacks below — the models are defined
// in JS, so without this they'd be inferred as `any`.
type OrderRow = {
  id: number;
  status: OrderView["status"];
  total: unknown;
  createdAt: Date;
  items?: Array<{
    id: number;
    productId: string;
    name: string;
    price: unknown;
    image: string | null;
    quantity: number;
  }>;
};

// What a raw Sequelize instance exposes that we rely on.
type OrderInstance = { get: (options: { plain: true }) => OrderRow };

// Turn a Sequelize Order instance (with eager-loaded `items`) into a clean DTO.
// `item` rows come in under the association alias we set in lib/models.ts.
function serializeOrder(order: OrderRow): OrderView {
  const items: OrderItemView[] = (order.items ?? []).map((it) => {
    const price = toNumber(it.price);
    return {
      id: it.id,
      productId: it.productId,
      name: it.name,
      price,
      image: it.image ?? null,
      quantity: it.quantity,
      lineTotal: price * it.quantity,
    };
  });

  return {
    id: order.id,
    status: order.status,
    total: toNumber(order.total),
    createdAt: order.createdAt.toISOString(),
    itemCount: items.reduce((sum, it) => sum + it.quantity, 0),
    items,
  };
}

/* -------------------------------- Reads ----------------------------------- */

// All of a user's orders, newest first, each with its line items.
export async function getOrdersForUser(userId: number): Promise<OrderView[]> {
  const orders = await Order.findAll({
    where: { userId },
    include: [{ model: OrderItem, as: "items" }],
    order: [["createdAt", "DESC"]],
  });
  return orders.map((o: OrderInstance) => serializeOrder(o.get({ plain: true })));
}

// A single order, scoped to its owner. Scoping by BOTH id and userId is the
// security check: user A can never load user B's order by guessing the id — it
// simply returns null.
export async function getOrderForUser(
  orderId: number,
  userId: number
): Promise<OrderView | null> {
  const order = await Order.findOne({
    where: { id: orderId, userId },
    include: [{ model: OrderItem, as: "items" }],
  });
  return order ? serializeOrder(order.get({ plain: true })) : null;
}

/* ------------------------------ Mutations --------------------------------- */

/**
 * Create an order for `userId` from the given cart lines.
 *
 * Security/correctness notes:
 * - Prices and product details are looked up here from the catalog
 *   (getProductById), never taken from the client. The order total is computed
 *   server-side from those authoritative prices.
 * - Lines whose product no longer exists are skipped. If nothing valid remains,
 *   we throw rather than create an empty order.
 * - The order + its items are written in a single transaction, so a failure
 *   can't leave a half-written order behind.
 *
 * Returns the new order's id.
 */
export async function createOrder(
  userId: number,
  lines: OrderLineInput[]
): Promise<number> {
  // Resolve each line against the live catalog and build the snapshot rows.
  const resolved: Array<{
    productId: string;
    name: string;
    price: number;
    image: string | null;
    quantity: number;
  }> = [];

  for (const line of lines) {
    const qty = Math.floor(Number(line.quantity));
    if (!line.productId || !Number.isFinite(qty) || qty < 1) continue;

    const product = await getProductById(line.productId);
    if (!product) continue; // product was removed since it entered the cart

    resolved.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image ?? null,
      quantity: qty,
    });
  }

  if (resolved.length === 0) {
    throw new Error("Cannot create an order with no valid items.");
  }

  const total = resolved.reduce((sum, it) => sum + it.price * it.quantity, 0);

  // Transaction: create the order, then its items. All-or-nothing.
  const orderId = await sequelize.transaction(async (t) => {
    const order = await Order.create(
      { userId, status: "pending", total },
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      resolved.map((it) => ({ ...it, orderId: order.id })),
      { transaction: t }
    );

    return order.id as number;
  });

  return orderId;
}
