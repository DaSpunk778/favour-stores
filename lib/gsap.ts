"use client";

// Single place where GSAP plugins are registered, so no component
// double-registers ScrollTrigger. Import gsap / ScrollTrigger / useGSAP
// from here (not directly from "gsap") anywhere in the app.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
