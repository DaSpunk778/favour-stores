"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  /** Element to render (default "div") — lets Reveal *be* a grid/section
   *  instead of adding an extra wrapper that could break layout. */
  as?: ElementType;
  className?: string;
  /** Animate the direct children with a stagger instead of the element itself. */
  stagger?: boolean;
  /** Distance (px) the content rises from. */
  y?: number;
  duration?: number;
  delay?: number;
  staggerAmount?: number;
  /** ScrollTrigger start, e.g. "top 85%" = fire when the top of the
   *  element reaches 85% down the viewport. */
  start?: string;
};

/**
 * Subtle scroll-reveal: fades + rises content into view once, driven by
 * GSAP ScrollTrigger (which is synced to Lenis via <SmoothScroll>).
 * Respects `prefers-reduced-motion` — under it, nothing animates and the
 * content simply shows in its final state.
 */
export default function Reveal({
  children,
  as,
  className,
  stagger = false,
  y = 24,
  duration = 0.6,
  delay = 0,
  staggerAmount = 0.08,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = stagger ? Array.from(el.children) : el;
        // Explicit fromTo (not from): a bare `from` tween records its END state
        // lazily, so a ScrollTrigger.refresh() that fires before the tween plays
        // can capture the hidden opacity:0 as the destination and animate 0 -> 0,
        // leaving content permanently invisible. fromTo pins both ends.
        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: "power2.out",
            stagger: stagger ? staggerAmount : 0,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
