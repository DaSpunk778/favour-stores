import type { OrderView } from "@/lib/order-store";

// Maps each order status to a label + Tailwind colour classes. Centralised here
// so the list page and the detail page always render a status the same way.
const STATUS_STYLES: Record<OrderView["status"], { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  paid: { label: "Paid", className: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  shipped: { label: "Shipped", className: "bg-indigo-50 text-indigo-700 ring-indigo-600/20" },
  delivered: { label: "Delivered", className: "bg-green-50 text-green-700 ring-green-600/20" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600 ring-gray-500/20" },
};

export default function OrderStatusBadge({ status }: { status: OrderView["status"] }) {
  const { label, className } = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}
