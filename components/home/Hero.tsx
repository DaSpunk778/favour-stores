"use client"

import { useRef } from "react";
import Link from "next/link";
import { FiArrowRight, FiHeadphones, FiLock, FiShield } from "react-icons/fi";
import { motion, useScroll, useTransform } from "framer-motion";


const trustBadges = [
    { icon: FiShield, title: "Premium Quality", sub: "Top Rated Products" },
    { icon: FiLock, title: "Secure Payment", sub: "100% Safe & Secure" },
    { icon: FiHeadphones, title: "Customer Support", sub: "24/7 Dedicated Support" },
];

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-160 flex items-center overflow-hidden"
        >
            {/* Background image - fixed pin + scroll zooom */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    scale,
                    backgroundImage: "url('/home/hero.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            {/** Dark overlay  */}
            <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none" />

            <div className=" relative z-20 max-w-7xl mx-auto px-4 py-20 w-full mix-blend-normal">
                <div className="max-w-xl space-y-6">
                    <p className="text-brand-light font-bold text-sm tracking-wider uppercase">
                        New Tech. Better Life.
                    </p>
                    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white leading-tight">
                        Upgrade to
                        <br />
                        Next Level
                        <br />
                        <span className="text-brand-light">Technology</span>
                    </h1>
                    <p className="text-gray-200 text-base leading-relaxed max-w-md">
                        Discover the latest electrical products and devices designed to
                        make everyday life smarter, easier, and more reliable.
                    </p>

                    <div className="flex flex-wrap gap-3 ">
                        <Link
                            href="#"
                            className="lex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-xl transition-all duration-150 hover:shadow-lg hover:shadow-brand/30"
                        >
                            Shop Now <FiArrowRight />
                        </Link>
                        <Link
                            href="/categories"
                            className="flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-all duration-150"
                        >
                            Explore Categories
                        </Link>
                        <div className="flex flex-wrap gap-6 pt-2">
                            {trustBadges.map(({ icon: Icon, title, sub }) => (
                                <div key={title} className="flex items-center gap-2">
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
            </div>
        </section>
    );
};