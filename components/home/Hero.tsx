"use client"

import { useRef } from "react";
import Link from "next/link";
import { FiArrowRight, FiHeadphones, FiLock } from "react-icons/fi";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const trustBadges = [
    { icon: IoShieldCheckmarkSharp, title: "Premium Quality", sub: "Top Rated Products" },
    { icon: FiLock, title: "Secure Payment", sub: "100% Safe & Secure" },
    { icon: FiHeadphones, title: "Customer Support", sub: "24/7 Dedicated Support" },
];

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parallax scroll effect: background image zooms in as you scroll down
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

    // GSAP entrance animation: runs once on mount
    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: {
                ease: "power3.out" // Smoother, less aggressive easing
            }
        });

        tl
            // Kicker badge: slides in from top with a subtle fade
            .fromTo(
                ".hero-kicker",
                { y: -40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 }
            )
            // Headline lines: stagger from below with slight rotation for dynamism
            .fromTo(
                ".hero-line",
                { opacity: 0, y: 60, rotate: (i) => (i % 2 === 0 ? -3 : 3) },
                {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    duration: 0.8,
                    stagger: 0.12, // Slightly faster stagger for tighter rhythm
                },
                "-=0.3" // Overlap with previous animation
            )
            // Description: simple fade and slide up
            .fromTo(
                ".hero-desc",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7 },
                "-=0.4"
            )
            // CTA buttons: bouncy entrance with stagger
            .fromTo(
                ".hero-cta",
                { opacity: 0, scale: 0.85, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "back.out(1.4)" // Subtle bounce
                },
                "-=0.3"
            )
            // Trust badges: slide in from left with stagger
            .fromTo(
                ".hero-badge",
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.08 },
                "-=0.2"
            );
    }, { scope: containerRef });

    return (
        <section
            ref={sectionRef}
            className="relative min-h-160 flex items-center overflow-hidden"
        >
            {/* Background image: fixed position with scroll-based zoom effect */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    scale,
                    backgroundImage: "url('/home/Hero-1.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Dark overlay for text legibility */}
            <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none" />

            {/* Hero content container */}
            <div ref={containerRef} className="relative z-20 max-w-7xl mx-auto px-4 py-20 w-full">
                <div className="max-w-2xl space-y-6">

                    {/* Kicker badge */}
                    <p className="hero-kicker w-fit px-3 py-1 border border-brand rounded-lg bg-brand/10 text-brand-light font-bold text-sm tracking-wider uppercase">
                        New Tech. Better Life.
                    </p>

                    {/* Main headline: bold, impactful, multi-line */}
                    <h1 className="text-3xl sm:text-5xl xl:text-6xl font-bold  text-white leading-tight">
                        <span className="hero-line block">Upgrade to</span>
                        <span className="hero-line block">Next Level</span>
                        {/* Prevent "Appliances" from breaking awkwardly on mobile */}
                        <span className="hero-line block text-green">
                            Electrical <span className="inline-block">Appliances</span>
                        </span>
                    </h1>

                    {/* Supporting description */}
                    <p className="hero-desc text-gray-200 text-base sm:text-lg leading-relaxed max-w-lg font-light">
                        Discover the latest electrical products and devices designed to
                        make everyday life smarter, easier, and more reliable.
                    </p>

                    {/* Call-to-action buttons */}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="#"
                            className="hero-cta flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 rounded-l transition-all duration-150 hover:shadow-lg hover:shadow-brand/30"
                        >
                            Shop Now <FiArrowRight />
                        </Link>
                        <Link
                            href="/categories"
                            className="hero-cta flex items-center gap-2 border-2 border-white/40 hover:border-brand-light text-white hover:text-green font-semibold px-6 py-3 rounded-l transition-all duration-150"
                        >
                            Explore Categories
                        </Link>
                    </div>

                    {/* Trust badges: social proof elements */}
                    <div className="flex flex-wrap gap-6 pt-2">
                        {trustBadges.map(({ icon: Icon, title, sub }) => (
                            <div key={title} className="hero-badge flex items-center gap-2">
                                <Icon className="text-brand-light" size={20} />
                                <div>
                                    <div className="text-xs font-bold text-white">{title}</div>
                                    <div className="text-xs text-gray-300">{sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}