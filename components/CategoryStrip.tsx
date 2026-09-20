"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { GoTag } from "react-icons/go";
import Reveal from "@/components/anim/Reveal";
import { categories } from "@/lib/categories";

export default function CategoryStrip() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    const scrollByAmount = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.8;
        el.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    // Auto-play: advance one "page" every 3.5s, loop back to start at the end.
    // Paused on hover/touch so users can browse without fighting the motion.
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            const el = scrollRef.current;
            if (!el) return;

            const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;

            if (atEnd) {
                el.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <Reveal className="flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900">
                    <span>Shop by Category</span>
                    <span className="inline-flex text-brand"><GoTag size={20}  /></span>
                </h2>
                <Link
                    href="/products"
                    className="border border-[#c6f4c6] bg-[#cdf4cd] w-fit px-3 py-1  text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                    View all
                </Link>
            </Reveal>

            <div
                className="relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
            >
                {/* Left arrow — desktop only */}
                <button
                    type="button"
                    onClick={() => scrollByAmount("left")}
                    aria-label="Scroll categories left"
                    className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:border-brand hover:text-brand transition-colors"
                >
                    <FiChevronLeft size={18} />
                </button>

                <div
                    ref={scrollRef}
                    role="list"
                    aria-label="Product categories"
                    className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
                >
                    {categories.map(({ name, slug, image, comingSoon }) => {
                        const tileContent = (
                            <>
                                <span className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden block transition-all duration-150 group-hover:border-brand group-hover:shadow-md">
                                    <Image
                                        src={image}
                                        alt={name}
                                        fill
                                        sizes="128px"
                                        className="object-cover"
                                    />
                                    {comingSoon && (
                                        <span className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                            <span className="text-[10px] font-semibold text-brand-dark bg-white px-1.5 py-0.5 rounded shadow-sm">
                                                Coming soon
                                            </span>
                                        </span>
                                    )}
                                </span>
                                <span className="text-[14px] font-medium text-gray-800 leading-tight">
                                    {name}
                                </span>
                            </>
                        );

                        const tileClass = `snap-start shrink-0 w-28 sm:w-32 flex flex-col items-center gap-2 text-center group ${comingSoon ? "opacity-60" : ""
                            }`;

                        if (comingSoon) {
                            return (
                                <div key={slug} role="listitem" className={tileClass}>
                                    {tileContent}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={slug}
                                href={`/categories/${slug}`}
                                role="listitem"
                                className={tileClass}
                            >
                                {tileContent}
                            </Link>
                        );
                    })}
                </div>

                {/* Right arrow — desktop only */}
                <button
                    type="button"
                    onClick={() => scrollByAmount("right")}
                    aria-label="Scroll categories right"
                    className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:border-brand hover:text-brand transition-colors"
                >
                    <FiChevronRight size={18} />
                </button>
            </div>
        </section>
    );
}