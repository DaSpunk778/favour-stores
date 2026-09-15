"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";


const BACKGROUND_IMAGE = "/home/promo-bg.jpg";

type Slide = {
    kicker: string; // small label above the title, e.g. "DEAL OF THE WEEK"
    title: string;
    desc: string;
    cta: string; // button label
    href: string; // where the button links
    image: string; // the crisp image shown inside the card only
};

const slides: Slide[] = [
    {
        kicker: "Limited Time Offer",
        title: "Big Savings on TVs",
        desc: "Upgrade your viewing with deep discounts on our best-selling smart TVs — while stock lasts.",
        cta: "Shop TVs",
        href: "/categories/tvs",
        image: "/categories/tvs.jpg",
    },
    {
        kicker: "Stay Cool",
        title: "Air Conditioners, For Less",
        desc: "Beat the heat with energy-efficient split units, now at prices built for the season.",
        cta: "Shop ACs",
        href: "/categories/acs",
        image: "/categories/acs.jpg",
    },
    {
        kicker: "Fresh Deals",
        title: "Refrigerators & Freezers",
        desc: "Keep it fresh for longer. Big capacity, low prices, trusted brands you already know.",
        cta: "Shop Cooling",
        href: "/categories/refrigerators",
        image: "/categories/refrigerators.jpg",
    },
];

export default function PromoBanner() {
    // Which slide is currently showing.
    const [active, setActive] = useState(0);
    const current = slides[active];

    // --- Parallax on the background (same technique as the Hero) ---
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    // Very subtle parallax. The backdrop is a small (740px) image, so a big
    // zoom would upscale it and look soft — keep the range tight so it stays
    // near natural size and reads sharp under the light wash.
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.17]);

    // Step through slides. The modulo math wraps around both ends so you can
    // go forward past the last slide (back to first) and back past the first.
    const go = (dir: 1 | -1) =>
        setActive((i) => (i + dir + slides.length) % slides.length);

    
    return (
        <section
            ref={sectionRef}
            aria-roledescription="carousel"
            aria-label="Promotions"
            className="relative overflow-hidden py-16 sm:py-20"
        >
        
            <motion.div
                aria-hidden
                style={{
                    scale,
                    backgroundImage: `url('${BACKGROUND_IMAGE}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className=" absolute inset-0 z-0 pointer-events-none"
            />

            {/* A gentle wash keeps the card readable while letting the backdrop
                stay sharp (no blur) — like the reference. Nudge the opacity here
                if you want the background more or less prominent. */}
            <div aria-hidden className="absolute inset-0 z-0 " />

            {/* THE FLOATING CARD */}
            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <div className="grid overflow-hidden  bg-white shadow-2xl shadow-black/10 md:grid-cols-2">
                    {/* LEFT: text panel. The AnimatePresence crossfades the copy in
                        sync with the background whenever the slide changes. */}
                    <div className="flex flex-col justify-center p-8 sm:p-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current.title}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.35 }}
                            >
                            
                                <p className="inline-block border border-green-300 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                                   {current.kicker.trim()}
                                </p>
                                <h2 className="mt-2 text-xl sm:text-4xl font-bold text-gray-900 leading-tight">
                                    {current.title}
                                </h2>
                                <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-md">
                                    {current.desc}
                                </p>
                                <Link
                                    href={current.href}
                                    className="mt-7 inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-sm px-7 py-3  transition-colors"
                                >
                                    {current.cta} <FiArrowRight />
                                </Link>
                            </motion.div>
                        </AnimatePresence>

                        {/* Prev / next arrows + slide counter, pinned to the bottom
                            of the panel like the reference. */}
                        <div className="mt-10 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => go(-1)}
                                aria-label="Previous promotion"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:border-brand hover:text-brand transition-colors"
                            >
                                <FiArrowLeft size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={() => go(1)}
                                aria-label="Next promotion"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:border-brand hover:text-brand transition-colors"
                            >
                                <FiArrowRight size={18} />
                            </button>
                            <span className="ml-1 text-sm text-gray-400 tabular-nums">
                                {/* padStart keeps it as 01 / 03 for a tidier look */}
                                {String(active + 1).padStart(2, "0")}
                                <span className="mx-1">/</span>
                                {String(slides.length).padStart(2, "0")}
                            </span>
                        </div>
                    </div>

                
        
                    <div className="relative flex items-center justify-center h-56 sm:h-72 md:h-88 bg-gray-50 p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current.image}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0 p-6 md:p-8"
                            >
                                <Image
                                    src={current.image}
                                    alt={current.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
