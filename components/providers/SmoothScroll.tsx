"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Drives Lenis smooth scrolling and GSAP off a SINGLE requestAnimationFrame
 * loop so ScrollTrigger stays perfectly in sync with Lenis's smoothed scroll
 * position (no jitter between the scroll and scroll-linked animations).
 *
 * How it works:
 *  - `autoRaf: false` turns off Lenis's own internal RAF loop.
 *  - We tick Lenis from GSAP's ticker instead (one loop for everything).
 *  - `lagSmoothing(0)` stops GSAP from trying to "catch up" after a frame
 *    spike, which would otherwise fight Lenis.
 *  - Every Lenis scroll pushes an update into ScrollTrigger.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = (time: number) => {
      // GSAP ticker gives seconds; Lenis.raf expects milliseconds.
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const lenis = lenisRef.current?.lenis;
    const onScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onScroll);

    // Trigger positions are measured against layout that isn't final until
    // fonts/images load and Lenis has set up. Refresh once everything settles
    // so triggers below the fold actually fire (otherwise reveals stay hidden).
    const refresh = () => ScrollTrigger.refresh();
    // Defer the FIRST refresh past the initial paint: on a cold load the DOM
    // isn't measured until Lenis has ticked a frame, so refreshing synchronously
    // here measures a stale layout and the top-of-page trigger never fires
    // (the card only appears after a manual reload). rAF-after-rAF lets Lenis
    // paint one frame first, then we measure against the real layout.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(refresh)
    );
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", onScroll);
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}
