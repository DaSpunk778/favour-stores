import Link from "next/link";
import { redirect } from "next/navigation";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { getCurrentUser } from "@/lib/dal";
import { getOrdersForUser } from "@/lib/order-store";
import { formatNaira } from "@/lib/products";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";

// Account overview: a profile card plus a short preview of recent orders.
// The layout already guaranteed a signed-in user, so getCurrentUser is non-null
// here (and free — it's cached from the layout's call).
export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login"); // defensive: handles a session that expired mid-visit
  const orders = await getOrdersForUser(user.id);
  const recent = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Name</dt>
            <dd className="font-medium text-gray-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium text-gray-900">{user.email}</dd>
          </div>
        </dl>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent orders</h2>
          <Link
            href="/account/orders"
            className="text-sm font-medium text-brand hover:underline flex items-center gap-1"
          >
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-sm text-gray-500">You haven&apos;t placed any orders yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recent.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <FiShoppingBag className="text-gray-400" />
                    <span>
                      <span className="block text-sm font-medium text-gray-900">
                        Order #{order.id}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                      </span>
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-semibold text-gray-900">
                      {formatNaira(order.total)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
