"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Short, punchy messages that scroll across the bar. Add/remove freely —
// the marquee measures itself, so spacing stays seamless at any count.
const messages = [
    "10% Off Your First Order — Use Code: FAVOR10",
    "Free Delivery on Orders Over ₦100,000",
    "30-Day Warranty Returns",
    "Genuine Products · Trusted by Thousands",
    "Same-Day Dispatch on Orders Before 2PM",
];

export default function AnnouncementBar() {
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const track = trackRef.current;
            if (!track) return;

            // The track holds two identical copies of the message list back to
            // back. We animate left by exactly one copy's width, then loop — so
            // the second copy seamlessly takes the first's place with no gap.
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const loopWidth = track.scrollWidth / 2;

                const tween = gsap.to(track, {
                    x: -loopWidth,
                    duration: loopWidth / 60, // ~60px/sec, speed scales with content
                    ease: "none",
                    repeat: -1,
                });

                // Pause on hover so people can read a deal that catches their eye.
                const el = track.parentElement;
                const pause = () => tween.pause();
                const play = () => tween.play();
                el?.addEventListener("mouseenter", pause);
                el?.addEventListener("mouseleave", play);

                return () => {
                    el?.removeEventListener("mouseenter", pause);
                    el?.removeEventListener("mouseleave", play);
                };
            });

            return () => mm.revert();
        },
        { scope: trackRef }
    );

    return (
        <div className="bg-gray-950 text-white text-xs py-2 overflow-hidden">
            <div
                ref={trackRef}
                className="flex w-max whitespace-nowrap will-change-transform"
            >
                {/* Two copies for a seamless loop. aria-hidden on the 2nd so
                    screen readers don't announce the duplicated content. */}
                {[0, 1].map((copy) => (
                    <div
                        key={copy}
                        className="flex shrink-0"
                        aria-hidden={copy === 1}
                    >
                        {messages.map((message, i) => (
                            <span key={i} className="flex items-center">
                                <span className="px-6 font-medium">{message}</span>
                                <span className="text-brand-light">•</span>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
