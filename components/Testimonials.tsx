"use client";

import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { PiUsersThree } from "react-icons/pi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Testimonial = {
    id: string;
    name: string;
    initial: string;
    rating: 5;
    text: string;
};

const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Tested Don",
        initial: "T",
        rating: 5,
        text: "Best plug in da bidness 2nd time doing business with you. Delivers like clock work Thanks @neo",
    },
    {
        id: "2",
        name: "Oba Himself",
        initial: "O",
        rating: 5,
        text: "My first time ever getting something online, and it came through safely and same day too. I made a big purchase from @neo_officiall he even surprised me with gifts. He even opened my eyes to things that I didn't know about. Neo is a great guy that knows his sauce.",
    },
    {
        id: "3",
        name: "ZODIN",
        initial: "Z",
        rating: 5,
        text: "NEO is selling trust, honesty and integrity not just electronics. there is this mad confidence in online purchase that comes when you dealing with NEO.",
    },
    {
        id: "4",
        name: "Chidera A.",
        initial: "C",
        rating: 5,
        text: "Excellent service and quality products! The delivery was prompt and the customer support was outstanding. Highly recommend!",
    },
    {
        id: "5",
        name: "Blessing O.",
        initial: "B",
        rating: 5,
        text: "I've been shopping here for months now and every single time the experience gets better. Genuine products at great prices.",
    },
    {
        id: "6",
        name: "Kunle M.",
        initial: "K",
        rating: 5,
        text: "Professional service from start to finish. They really care about customer satisfaction. Will definitely order again!",
    },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <div className="snap-start shrink-0 w-80 sm:w-96 flex flex-col p-6 bg-white border border-gray-200 rounded-xl h-64">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} size={16} className="text-yellow-400" />
                ))}
            </div>

            {/* Text */}
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-6 flex-1">
                {testimonial.text}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 mt-auto border-t border-gray-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand/10 text-brand font-bold text-sm">
                    {testimonial.initial}
                </div>
                <div className="font-semibold text-sm text-gray-900">
                    {testimonial.name}
                </div>
            </div>
        </div>
    );
}

export default function Testimonials() {
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

    // Auto-scroll: advance one card width every 4s, loop back to start at the end
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            const el = scrollRef.current;
            if (!el) return;

            const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;

            if (atEnd) {
                el.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                // Scroll by one card width + gap (384px card + 24px gap = ~408px, but use dynamic calc)
                const cardWidth = 384 + 24; // w-96 = 384px + gap-6 = 24px
                el.scrollBy({ left: cardWidth, behavior: "smooth" });
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <PiUsersThree size={20} className="text-brand" />
                    <span className="text-sm font-semibold text-brand uppercase tracking-wide">
                        Testimonials
                    </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Hear from our Customers
                </h2>
            </div>

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
                    aria-label="Scroll testimonials left"
                    className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:border-brand hover:text-brand transition-colors"
                >
                    <FiChevronLeft size={18} />
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
                >
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>

                {/* Right arrow — desktop only */}
                <button
                    type="button"
                    onClick={() => scrollByAmount("right")}
                    aria-label="Scroll testimonials right"
                    className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:border-brand hover:text-brand transition-colors"
                >
                    <FiChevronRight size={18} />
                </button>
            </div>
        </section>
    );
}
