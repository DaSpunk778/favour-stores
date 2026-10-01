"use client"

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronDown, FiLogOut, FiSearch, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import { FaBarsStaggered } from "react-icons/fa6";
import { useCartStore } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { logoutAction } from "@/app/actions/auth";
import type { CurrentUser } from "@/lib/dal";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "#", hasDropdown: true },
    { label: "Categories", href: "/#categories"},
    { label: "Faqs", href: "/#faqs" },
    { label: "New Arrivals", href: "/#new-arrivals" },
    { label: "Brands", href: "/#brands" },
    { label: "About", href: "/about" },
];

function initials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}


export default function HeaderClient({ user }: { user: CurrentUser | null }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const accountRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const lenis = useLenis();   
    const rawCartCount = useCartStore((state) => state.totalItems());
    const hydrated = useHydrated();
    // Until the client has hydrated the persisted cart, render 0 on both server
    // and first client pass so the badge markup matches (no hydration error).
    const cartCount = hydrated ? rawCartCount : 0;

    // Close the account dropdown when clicking outside of it or pressing Escape.
    useEffect(() => {
        if (!accountOpen) return;
        function onPointerDown(e: MouseEvent) {
            if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
                setAccountOpen(false);
            }
        }
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setAccountOpen(false);
        }
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [accountOpen]);

    const handleScrollTo = (e: React.MouseEvent, href: string) => {
        setMobileOpen(false); // close the mobile menu for ANY link (scroll or route)

        const hashIndex = href.indexOf("#");
        if (hashIndex === -1) return; // plain route link (Home, About) — let <Link> navigate

        const id = href.slice(hashIndex + 1);
        if (!id) {
            //bare "#" (the shop toogle) - never let it jump to the top 
            e.preventDefault();
            return;
        }

        if (pathname === "/") {
            //Already on the landing page: take over and glide with Lenis.
            e.preventDefault();
            const target = document.getElementById(id);
            if (target) lenis?.scrollTo(target, { offset: -80});
        }
        // Otherwise (on another page) we do NOT preventDefault — the
        // <Link href="/#id"> routes home, and the effect in step D scrolls on arrival.
    }

    // When we land on the landing page carrying a hash (e.g. arriving from
// /products via a "/#brands" link), glide to that section once it's mounted.
    useEffect(() => {
        if (pathname !== "/") return;
        const id = window.location.hash.slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        const raf = requestAnimationFrame(() => lenis?.scrollTo(target, { offset: -80 }));
        return () => cancelAnimationFrame(raf);
    }, [pathname, lenis])

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
                                onClick={(e) => handleScrollTo(e, link.href)}
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
                        {/* Desktop search (lg+): former inline expand-in-place form. On
                            smaller screens the standalone <SearchBar /> under the header
                            handles search instead. */}
                        <div className="relative hidden lg:block">
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

                        {/* Account: dropdown when signed in, login/signup buttons otherwise */}
                        {user ? (
                            <div className="relative" ref={accountRef}>
                                <button
                                    onClick={() => setAccountOpen((o) => !o)}
                                    className="flex items-center gap-1 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-haspopup="menu"
                                    aria-expanded={accountOpen}
                                    aria-label="Account menu"
                                >
                                    <span className="w-7 h-7 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">
                                        {initials(user.name) || <FiUser size={16} />}
                                    </span>
                                    <FiChevronDown
                                        size={14}
                                        className={`hidden sm:block transition-transform ${accountOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {accountOpen && (
                                    <div
                                        role="menu"
                                        className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/account"
                                            role="menuitem"
                                            onClick={() => setAccountOpen(false)}
                                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            My account
                                        </Link>
                                        <Link
                                            href="/account/orders"
                                            role="menuitem"
                                            onClick={() => setAccountOpen(false)}
                                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                        >
                                            My orders
                                        </Link>
                                        <form action={logoutAction}>
                                            <button
                                                type="submit"
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <FiLogOut size={16} />
                                                Log out
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2 ml-1">
                                <Link
                                    href="/login"
                                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}

                        {/* Shopping cart with item count badge */}
                        <Link
                            href="/checkout"
                            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Shopping cart"
                        >
                            <FiShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

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
                                onClick={(e) => handleScrollTo(e, link.href)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Account section for mobile */}
                        <div className="mt-2 pt-3 border-t border-gray-100">
                            {user ? (
                                <>
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        href="/account"
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                                    >
                                        My account
                                    </Link>
                                    <Link
                                        href="/account/orders"
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                                    >
                                        My orders
                                    </Link>
                                    <form action={logoutAction}>
                                        <button
                                            type="submit"
                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                                        >
                                            <FiLogOut size={16} />
                                            Log out
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full text-center px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full text-center px-3 py-2.5 text-sm font-medium text-white bg-brand hover:opacity-90 rounded-lg"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
