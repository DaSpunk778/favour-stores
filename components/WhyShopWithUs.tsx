"use client";

import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdOutlineVerified } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import Reveal from "@/components/anim/Reveal";

// Each benefit is data, not markup — keeps the JSX below a simple loop and
// makes it trivial to add/remove/reorder a benefit later.
const benefits = [
    {
        icon: TbTruckDelivery,
        title: "Fast Delivery",
        desc: "Same-day dispatch on orders placed before 2PM, nationwide.",
    },
    {
        icon: MdOutlineVerified,
        title: "Genuine Products",
        desc: "Only authentic items, sourced directly from trusted brands.",
    },
    {
        icon: RiSecurePaymentLine,
        title: "Secure Payment",
        desc: "Your transactions are protected end to end, every time.",
    },
    {
        icon: BiSupport,
        title: "24/7 Support",
        desc: "A real team ready to help before, during, and after your order.",
    },
];

export default function WhyShopWithUs() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-14">
            <div className="mb-8 text-center">
                <h2 className="text-xl sm:text-3xl font-bold text-gray-900">
                    Why Shop With Us
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    The little things that make every order worry-free.
                </p>
            </div>

            {/*
              Reveal with `stagger` animates each direct child (each benefit card)
              in sequence as the row scrolls into view — same pattern as the
              product grid. The className here IS the grid, so Reveal doesn't add
              an extra wrapper.
            */}
            <Reveal
                stagger
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {benefits.map(({ icon: Icon, title, desc }) => (
                    <div
                        key={title}
                        className="group relative flex flex-col items-center text-center gap-3 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-b from-white to-gray-50/60 p-6 shadow-sm ring-1 ring-inset ring-white/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/5"
                    >
                        {/* Soft whitish glow that sits behind the content and blooms
                            a little brighter on hover — gives the flat card a subtle
                            frosted-light interior instead of plain white. Decorative. */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-white blur-2xl opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        {/* Faint brand tint bleeding up from the bottom on hover. */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />

                        {/* Icon in a soft brand-tinted circle. relative + z-10 keeps
                            all real content above the decorative glows. */}
                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand ring-1 ring-brand/10 transition-colors group-hover:bg-brand/15">
                            <Icon size={24} />
                        </div>
                        <h3 className="relative z-10 text-base font-semibold text-gray-900">
                            {title}
                        </h3>
                        <p className="relative z-10 text-sm text-gray-500 leading-relaxed">
                            {desc}
                        </p>
                    </div>
                ))}
            </Reveal>
        </section>
    );
}
