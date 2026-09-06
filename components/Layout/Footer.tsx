import Link from "next/link";
import Image from "next/image";
import {
    FiFacebook,
    FiInstagram,
    FiTwitter,
    FiMapPin,
    FiPhone,
    FiMail,
} from "react-icons/fi";
import {
    TbTruckDelivery,
    TbShieldCheck,
    TbCreditCard,
} from "react-icons/tb";

/**
 * Site footer — the closing block of every page.
 *
 * It's built from a few small data arrays (the link columns, the socials, the
 * trust badges) so the markup below stays a simple loop. To change what's in
 * the footer, edit the data at the top rather than hunting through JSX.
 *
 * This is a Server Component (no "use client") — it's purely presentational
 * with no state or effects, so it ships zero JavaScript to the browser.
 */

// The three link columns. Each has a heading and its list of links. Swap the
// hrefs for real routes as those pages get built.
const linkColumns: { heading: string; links: { label: string; href: string }[] }[] = [
    {
        heading: "Shop",
        links: [
            { label: "All Products", href: "/products" },
            { label: "Categories", href: "/categories" },
            { label: "Deals", href: "/deals" },
            { label: "New Arrivals", href: "/new-arrivals" },
            { label: "Brands", href: "/brands" },
        ],
    },
    {
        heading: "Support",
        links: [
            { label: "Contact Us", href: "/support" },
            { label: "Shipping & Delivery", href: "/shipping" },
            { label: "Returns & Warranty", href: "/returns" },
            { label: "Track Your Order", href: "/track" },
            { label: "FAQs", href: "/faqs" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Our Stores", href: "/stores" },
            { label: "Careers", href: "/careers" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
        ],
    },
];

// Social links. Each pairs an icon with its outbound URL — replace the "#"
// placeholders with the real handles.
const socials = [
    { icon: FiInstagram, label: "Instagram", href: "#" },
    { icon: FiFacebook, label: "Facebook", href: "#" },
    { icon: FiTwitter, label: "Twitter", href: "#" },
];

// Small reassurance badges shown in a row just above the columns — reinforces
// the same promises made in the "Why Shop With Us" section.
const trustBadges = [
    { icon: TbTruckDelivery, label: "Fast Nationwide Delivery" },
    { icon: TbShieldCheck, label: "Genuine Products, Warrantied" },
    { icon: TbCreditCard, label: "Secure Checkout" },
];

export default function Footer() {
    // Computed once at render so the copyright year is always current.
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 text-gray-300">
            {/* TRUST BADGES: a thin strip across the top, separated from the main
                footer body by a hairline border. Wraps to multiple rows on small
                screens rather than squashing. */}
            <div className="border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {trustBadges.map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center justify-center gap-3 text-sm"
                        >
                            <Icon size={22} className="text-brand-light shrink-0" />
                            <span className="text-gray-200">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN BODY: brand/contact block on the left, then the three link
                columns. On desktop it's a 5-col grid where the brand block spans
                two columns so it has room to breathe. */}
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 gap-8 lg:grid-cols-5">
                {/* BRAND + CONTACT — spans the full width on mobile, 2 cols on desktop. */}
                <div className="col-span-2">
                    <Link href="/" className="inline-block">
                        <Image
                            src="/favour-logo.png"
                            alt="Favour Stores"
                            width={160}
                            height={40}
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                    <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
                        Your trusted home for genuine electronics and home appliances —
                        great prices, fast delivery, and support that actually helps.
                    </p>

                    {/* Contact rows: each icon + line. Address is plain text; the
                        phone and email are click-to-action links. */}
                    <ul className="mt-6 space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                            <FiMapPin size={18} className="text-brand-light shrink-0 mt-0.5" />
                            <span className="text-gray-400">
                                Lagos, Nigeria
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <FiPhone size={18} className="text-brand-light shrink-0" />
                            <a
                                href="tel:+2340000000000"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                +234 000 000 0000
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <FiMail size={18} className="text-brand-light shrink-0" />
                            <a
                                href="mailto:hello@favourstores.com"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                hello@favourstores.com
                            </a>
                        </li>
                    </ul>
                </div>

                {/* LINK COLUMNS: one <nav> per column, driven by the data above. */}
                {linkColumns.map((column) => (
                    <nav key={column.heading} aria-label={column.heading}>
                        <h3 className="text-sm font-semibold text-white">
                            {column.heading}
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {column.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>

            {/* BOTTOM BAR: copyright on the left, social icons on the right,
                divided from the body by a hairline. Stacks and centers on mobile. */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500 text-center sm:text-left">
                        © {year} Favour Stores. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2">
                        {socials.map(({ icon: Icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 hover:border-brand hover:text-brand-light transition-colors"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
