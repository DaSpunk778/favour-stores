"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser, FiShoppingBag } from "react-icons/fi";

// Sidebar links for the account area. `usePathname` lets us highlight the one
// the user is currently on, so this has to be a Client Component.
const links = [
  { href: "/account", label: "Overview", icon: FiUser, exact: true },
  { href: "/account/orders", label: "My Orders", icon: FiShoppingBag, exact: false },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row lg:flex-col gap-1">
      {links.map(({ href, label, icon: Icon, exact }) => {
        // "Overview" (/account) must match exactly, otherwise it would stay
        // highlighted on /account/orders too since that path starts with it.
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              active
                ? "bg-brand/10 text-brand"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
