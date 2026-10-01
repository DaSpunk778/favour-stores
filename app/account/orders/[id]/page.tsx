import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { getCurrentUser } from "@/lib/dal";
import { getOrderForUser } from "@/lib/order-store";
import { formatNaira } from "@/lib/products";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Detail view for a single order. `params` is a Promise in this Next.js version.
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);

  // Guard against non-numeric ids like /account/orders/abc.
  if (!Number.isInteger(orderId)) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/login"); // defensive: handles a session that expired mid-visit
  // getOrderForUser scopes by userId, so this returns null for someone else's
  // order — which we treat as "not found" rather than leaking its existence.
  const order = await getOrderForUser(orderId, user.id);
  if (!order) notFound();

  return (
    <div>
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <FiArrowLeft size={16} /> Back to orders
      </Link>

      {/* Header: order number, date, status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Line items */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 shrink-0 rounded-lg bg-gray-50 overflow-hidden relative">
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
                  {formatNaira(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900 shrink-0">
                {formatNaira(item.lineTotal)}
              </p>
            </li>
          ))}
        </ul>

        {/* Total */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-base font-bold text-gray-900">
            {formatNaira(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
