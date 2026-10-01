import Link from "next/link";
import { redirect } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";
import { getCurrentUser } from "@/lib/dal";
import { getOrdersForUser } from "@/lib/order-store";
import { formatNaira } from "@/lib/products";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";

// Format an ISO date string as e.g. "1 Oct 2026".
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Full list of the signed-in user's orders, newest first.
export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login"); // defensive: handles a session that expired mid-visit
  const orders = await getOrdersForUser(user.id);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">My Orders</h2>

      {orders.length === 0 ? (
        // Empty state with a path back into the catalog.
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center shadow-sm">
          <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 text-sm font-medium text-white bg-brand rounded-lg hover:opacity-90 transition-opacity"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-gray-200 hover:shadow transition-all"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      Order #{order.id}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)} · {order.itemCount} item
                    {order.itemCount === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNaira(order.total)}
                  </span>
                  <FiChevronRight className="text-gray-400" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
