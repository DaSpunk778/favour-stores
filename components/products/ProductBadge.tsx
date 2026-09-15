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
    className: "bg-slate-900/40 backdrop-blur-sm shadow-lg",
  },
  New: {
    icon: FaBolt,
    label: "New",
    className: "bg-slate-900/40 backdrop-blur-sm shadow-lg",
  },
  Sale: {
    icon: FaTag,
    label: "Sale",
    className: "bg-slate-900/40 backdrop-blur-sm shadow-lg",
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
      ? "text-[11px] px-2.5 py-3 gap-1.5"
      : "text-[13px] px-1.5 py-1.5 gap-1";

  return (
    <span
      className={`inline-flex items-center bg-linear-to-br font-bold uppercase tracking-wide text-white shadow-sm shadow-black/10 ring-1 ring-inset ${className} ${sizing}`}
    >
      <Icon size={size === "md" ? 12 : 10} className="shrink-0" />
      {label}
    </span>
  );
}
