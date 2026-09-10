"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiBox, FiPlusCircle } from "react-icons/fi";

// Sidebar navigation with active-state highlighting. Split out as a client
// component so app/admin/layout.tsx can stay a server component.
export default function AdminNav() {
  const pathname = usePathname();
  const isNew = pathname === "/admin/products/new";

  const items = [
    {
      href: "/admin",
      label: "Dashboard",
      Icon: FiGrid,
      active: pathname === "/admin",
    },
    {
      href: "/admin/products",
      label: "Products",
      Icon: FiBox,
      // Active on the list and on edit pages, but not on "Add product".
      active:
        pathname === "/admin/products" ||
        (pathname.startsWith("/admin/products/") && !isNew),
    },
    {
      href: "/admin/products/new",
      label: "Add product",
      Icon: FiPlusCircle,
      active: isNew,
    },
  ];

  return (
    <nav className="flex flex-col gap-1">
      {items.map(({ href, label, Icon, active }) => (
        <Link
          key={href}
          href={href}
          aria-current={active ? "page" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active
              ? "bg-brand/10 text-brand"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Icon size={17} className="shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
