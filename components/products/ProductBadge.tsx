import type { IconType } from "react-icons";
import { FaCrown, FaBolt, FaTag } from "react-icons/fa";
import type { Product } from "@/lib/products";

type BadgeKind = NonNullable<Product["badge"]>;

// One professional badge treatment shared by the product card and the detail
// page so the "Best Seller / New / Sale" labels look identical everywhere.
// Gradient fill + inset ring + soft shadow + uppercase micro-label with an icon.
const config: Record<
  BadgeKind,
  { icon: IconType; label: string; className: string }
> = {
  "Best Seller": {
    icon: FaCrown,
    label: "Best Seller",
    className: "from-amber-400 to-amber-600 ring-amber-200/50",
  },
  New: {
    icon: FaBolt,
    label: "New",
    className: "from-sky-500 to-indigo-600 ring-sky-200/50",
  },
  Sale: {
    icon: FaTag,
    label: "Sale",
    className: "from-rose-500 to-red-600 ring-rose-200/50",
  },
};

export default function ProductBadge({
  badge,
  size = "sm",
}: {
  badge: BadgeKind;
  size?: "sm" | "md";
}) {
  const { icon: Icon, label, className } = config[badge];
  const sizing =
    size === "md"
      ? "text-[11px] px-2.5 py-1 gap-1.5"
      : "text-[10px] px-2 py-1 gap-1";

  return (
    <span
      className={`inline-flex items-center rounded-lg bg-gradient-to-br font-bold uppercase tracking-wide text-white shadow-sm shadow-black/10 ring-1 ring-inset ${className} ${sizing}`}
    >
      <Icon size={size === "md" ? 12 : 10} className="shrink-0" />
      {label}
    </span>
  );
}
