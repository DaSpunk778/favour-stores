"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronDown, FiMenu, FiSearch, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import { useCartStore } from "@/lib/cart-store";
import { FaBarsStaggered } from "react-icons/fa6";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop", hasDropdown: true },
    { label: "Categories", href: "/categories", hasDropdown: true },
    { label: "Deals", href: "/deals" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Brands", href: "/brands" },
    { label: "Support", href: "/support" },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const cartCount = useCartStore((state) => state.totalItems());

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16 pl-0">
                    {/* Logo */}
                    <Link href="#" className="shrink-0 -ml-2 sm:-ml-4">
                        <Image
                            src="/favour-logo.png"
                            alt="logo"
                            height={40}
                            width={160}
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop navigation links */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-0.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${link.label === "Home"
                                    ? "text-brand"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {link.label}
                                {link.hasDropdown && <FiChevronDown size={14} />}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side action icons */}
                    <div className="flex items-center gap-1">
                        {/* Search: fixed width container to prevent layout shift */}
                        <div className="relative">
                            {searchOpen ? (
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                                    <FiSearch size={18} className="text-gray-400 shrink-0" />
                                    <input
                                        autoFocus
                                        placeholder="Search products…"
                                        className="bg-transparent text-sm outline-none w-32 sm:w-48"
                                        onBlur={() => setSearchOpen(false)}
                                    />
                                </div>
                            ) : (
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Open search"
                                >
                                    <FiSearch size={18} />
                                </button>
                            )}
                        </div>

                        {/* User account button */}
                        <Link
                            href="/login"
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="User account"
                        >
                            <FiUser size={18} />
                        </Link>

                        {/* Shopping cart with item count badge */}
                        <button
                            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Shopping cart"
                        >
                            <FiShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
                            onClick={() => setMobileOpen((o) => !o)}
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        >
                            {mobileOpen ? <FiX size={22} /> : <FaBarsStaggered size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile navigation menu: positioned absolutely to avoid pushing content down */}
            {mobileOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 border-t border-gray-100 bg-white shadow-lg">
                    <div className="px-4 py-4 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};