"use client"

import { useRef } from "react";
import Link from "next/link";
import { FiArrowRight, FiHeadphones, FiLock, FiShield } from "react-icons/fi";
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

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(
            ".hero-kicker",
            { y: -60, opacity: 0, rotate: -8 },
            { y: 0, opacity: 1, rotate: 0, duration: 0.8 }
        )
            .fromTo(
                ".hero-line",
                { opacity: 0, y: 80, rotate: (i) => (i % 2 === 0 ? -10 : 10), x: (i) => (i % 2 === 0 ? -60 : 60) },
                { opacity: 1, y: 0, rotate: 0, x: 0, duration: 1, stagger: 0.15 },
                "-=0.4"
            )
            .fromTo(
                ".hero-desc",
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8 },
                "-=0.5"
            )
            .fromTo(
                ".hero-cta",
                { opacity: 0, scale: 0.7, x: (i) => (i % 2 === 0 ? -40 : 40) },
                { opacity: 1, scale: 1, x: 0, duration: 0.7, stagger: 0.15, ease: "back.out(1.6)" },
                "-=0.4"
            )
            .fromTo(
                ".hero-badge",
                { opacity: 0, y: 30, x: -20 },
                { opacity: 1, y: 0, x: 0, duration: 0.6, stagger: 0.1 },
                "-=0.3"
            );
    }, { scope: containerRef });

    return (
        <section
            ref={sectionRef}
            className="relative min-h-160 flex items-center overflow-hidden"
        >
            {/* Background image - fixed pin + scroll zoom */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    scale,
                    backgroundImage: "url('/home/hero.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none" />

            <div ref={containerRef} className="relative z-20 max-w-7xl mx-auto px-4 py-20 w-full mix-blend-normal">
                <div className="max-w-xl space-y-6">
                    
                    <p className="hero-kicker w-fit px-3 py-1 border border-brand rounded-lg bg-brand/10 text-brand-light font-bold text-sm tracking-wider uppercase">
                        New Tech. Better Life.
                    </p>
                    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white leading-tight">
                        <span className="hero-line block">Upgrade to</span>
                        <span className="hero-line block">Next Level</span>
                        <span className="hero-line block whitespace-nowrap text-green"> Electronical Appliances </span>
                    </h1>
                    <p className="hero-desc text-gray-200 text-base leading-relaxed max-w-md">
                        Discover the latest electrical products and devices designed to
                        make everyday life smarter, easier, and more reliable.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="#"
                            className="hero-cta flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 rounded-xl transition-all duration-150 hover:shadow-lg hover:shadow-brand/30"
                        >
                            Shop Now <FiArrowRight />
                        </Link>
                        <Link
                            href="/categories"
                            className="hero-cta flex items-center gap-2 border-2 border-white/40 hover:border-brand-light text-white hover:text-green font-semibold px-6 py-3 rounded-xl transition-all duration-150"
                        >
                            Explore Categories
                        </Link>
                    </div>

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