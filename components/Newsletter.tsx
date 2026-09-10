"use client";

import { useState, type FormEvent } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Reveal from "@/components/anim/Reveal";

// The delivery/mail character animation. Paste your LottieFiles asset URL here
// (the direct .lottie or .json link). Everything else is already wired — the
// character will render half above the card, half inside it.
const CHARACTER_LOTTIE_SRC =
    "https://lottie.host/b1cfe367-06d2-4850-9007-77ae49888024/Dn9R4TaKtA.json";

/**
 * Newsletter signup — the last content block before the footer.
 *
 * Right now this handles the email entirely on the client (validates the
 * format, shows a success state, no network call). When you have a real
 * mailing-list backend (Mailchimp, Resend, a /api/subscribe route, etc.),
 * swap the body of `handleSubmit` for a `fetch` to that endpoint — the UI
 * states below (idle / error / success) are already wired for it.
 */

// The three states the form can be in. Using a string union instead of
// separate booleans keeps the UI logic simple: only one state at a time.
type Status = "idle" | "error" | "success";

export default function Newsletter() {
    // Controlled input: React owns the value so we can read/validate/reset it.
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        // Stop the browser's default full-page reload on form submit.
        e.preventDefault();

        // Basic email sanity check. This isn't bulletproof validation (no regex
        // fully captures the email spec), just enough to catch obvious typos
        // before we'd send it anywhere.
        const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!looksValid) {
            setStatus("error");
            return;
        }

        // --- Where a real API call would go ---
        // Example for later:
        //   await fetch("/api/subscribe", {
        //     method: "POST",
        //     body: JSON.stringify({ email }),
        //   });
        // For now we just jump straight to the success state.
        setStatus("success");
        setEmail(""); // clear the field after a successful signup
    }

    return (
        // Outer section just provides vertical rhythm + horizontal padding. The
        // actual band is the contained card below, so nothing stretches edge to
        // edge — it sits within the same max-w-7xl rail as the rest of the page.
        <section className="max-w-7xl mx-auto px-4 py-16">
            {/*
              Reveal = the scroll-in wrapper. It is overflow-VISIBLE and has extra
              top padding (pt-24) so the character can spill out above the card's
              top edge without being clipped. The rounded dark band is drawn here,
              but the glow-clipping happens on the inner layer below.
            */}
            <Reveal className="relative rounded-3xl bg-gray-950 px-6 pt-24 pb-12 sm:px-12 lg:px-16">
                {/*
                  THE BREAKOUT CHARACTER. Absolutely positioned, centered, pulled
                  up with -top so roughly its lower half overlaps the card and its
                  upper half rises above the top edge. pointer-events-none so it
                  never blocks clicks on the form. z-20 keeps it above everything.
                  The subtle float animation is defined in globals.css.
                */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 -top-20 z-20 h-40 w-40 -translate-x-1/2"
                >
                    {/* Inner wrapper does the float (translateY only) so it doesn't
                        fight the parent's translateX(-50%) centering. */}
                    <div className="animate-float h-full w-full">
                        <DotLottieReact
                            src={CHARACTER_LOTTIE_SRC}
                            loop
                            autoplay
                            className="h-full w-full"
                        />
                    </div>
                </div>

                {/* Inner clip layer: this one is overflow-hidden and rounded, so the
                    decorative glows stay inside the card while the character (which
                    lives OUTSIDE this div) is free to break out the top. */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                    {/* Soft green glow, top-right, for brand warmth. */}
                    <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-brand/25 blur-3xl" />
                    {/* Faint second glow bottom-left for balance. */}
                    <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-brand-dark/20 blur-3xl" />
                </div>

                {/*
                  Two-column layout on desktop: message on the left, form on the
                  right, vertically centered. Stacks to one column on mobile.
                  items-center keeps both columns aligned on their shared midline.
                */}
                <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
                    {/* LEFT: heading + copy. Centered on mobile (character sits
                        above center there), left-aligned on desktop. */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-xl sm:text-3xl font-bold text-white">
                            Get 10% Off Your First Order
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0">
                            Join our newsletter for exclusive deals, new arrivals, and
                            insider offers — straight to your inbox. No spam, ever.
                        </p>
                    </div>

                    {/* RIGHT: the form (or success state after signup) */}
                    <div className="lg:pl-6">
                        {/*
                          Conditional rendering: once status === "success" we swap
                          the form out for a thank-you message. Otherwise the form.
                        */}
                        {status === "success" ? (
                            <div className="flex items-center gap-2 text-white">
                                <FiCheckCircle size={22} className="text-brand-light" />
                                <span className="font-semibold">
                                    You&apos;re in! Check your inbox for your code.
                                </span>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                // noValidate: we run our own validation in handleSubmit,
                                // so the browser's native popup doesn't fight ours.
                                noValidate
                            >
                                {/* stacked input + button; on wider screens they sit
                                    side by side via the sm:flex-row switch. */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <label htmlFor="newsletter-email" className="sr-only">
                                            Email address
                                        </label>
                                        <input
                                            id="newsletter-email"
                                            type="email"
                                            value={email}
                                            // Each keystroke updates state AND clears any
                                            // prior error so the message disappears as the
                                            // user fixes their input.
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (status === "error") setStatus("idle");
                                            }}
                                            placeholder="Enter your email"
                                            className="w-full rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 placeholder:text-gray-500 outline-none focus:border-brand/60 focus:bg-white/10 transition"
                                            aria-invalid={status === "error"}
                                            aria-describedby="newsletter-error"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="shrink-0 rounded-xl bg-brand text-white font-semibold px-6 py-3 text-sm hover:bg-brand-dark transition-colors"
                                    >
                                        Subscribe
                                    </button>
                                </div>

                                {/*
                                  Error message. role="alert" makes screen readers
                                  announce it. Fixed height so the layout never jumps.
                                */}
                                <p
                                    id="newsletter-error"
                                    role="alert"
                                    className="mt-2 h-4 text-sm text-brand-light font-medium"
                                >
                                    {status === "error" && "Please enter a valid email address."}
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
