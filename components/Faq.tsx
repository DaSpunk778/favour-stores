"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import Reveal from "@/components/anim/Reveal";

/**
 * FAQ section — a single-open accordion sitting just before the footer.
 *
 * Behaviour the page wants:
 *   • at most 10 questions live in the `faqs` array below,
 *   • only the first 5 render on load,
 *   • a "See more" button reveals the remaining 5 (and toggles back to
 *     "See less" so people can collapse them again).
 *
 * Editing the FAQs is just editing the array — the two-batch split and the
 * accordion are driven off it, so you never touch the JSX to add a question
 * (up to the 10 the design caps at).
 */

// The full list. Keep this to 10 or fewer — the design only makes room for a
// single "See more" reveal, not paging beyond that.
const faqs: { question: string; answer: string }[] = [
    {
        question: "How long does delivery take?",
        answer:
            "Orders placed before 2PM are dispatched the same day. Delivery within Lagos typically arrives in 1–2 business days, and 2–5 business days for the rest of Nigeria.",
    },
    {
        question: "Are your products genuine and warrantied?",
        answer:
            "Yes. Every item is sourced directly from the brand or an authorised distributor, and comes with the manufacturer's warranty. We never sell refurbished units as new.",
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "We accept debit and credit cards, bank transfers, and payment on delivery for eligible locations. All online payments are processed over a secure, encrypted connection.",
    },
    {
        question: "Can I return an item if I change my mind?",
        answer:
            "You can return most items within 30 days of delivery, provided they're unused and in their original packaging. Some large appliances have specific return conditions noted on their product page.",
    },
    {
        question: "Do you offer installation for large appliances?",
        answer:
            "Yes, we offer professional installation for ACs, refrigerators, washing machines, and TVs in select cities. You can add installation at checkout or arrange it with our support team afterwards.",
    },
    {
        question: "How do I track my order?",
        answer:
            "Once your order ships, you'll receive a tracking link by email and SMS. You can also track it any time from the 'Track Your Order' page using your order number.",
    },
    {
        question: "Is same-day delivery available everywhere?",
        answer:
            "Same-day dispatch applies nationwide for orders before 2PM, but same-day arrival is currently limited to parts of Lagos. Delivery time for other areas is shown at checkout.",
    },
    {
        question: "Do you price match?",
        answer:
            "If you find the same genuine product at a lower price from an authorised Nigerian retailer, reach out to our support team — we'll do our best to match it.",
    },
    {
        question: "What if my item arrives damaged?",
        answer:
            "Contact us within 48 hours of delivery with a photo of the damage and we'll arrange a replacement or full refund at no cost to you.",
    },
    {
        question: "How can I reach customer support?",
        answer:
            "Our team is available 24/7 by phone, email, and live chat. You'll find all the details on our Contact page — before, during, and after your order.",
    },
];

// How many show before the "See more" click. The rest reveal on toggle.
const INITIAL_COUNT = 5;

export default function Faq() {
    // Which question is currently open. `null` = all collapsed. Only one opens
    // at a time so the section stays compact.
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    // Whether the extra questions (beyond INITIAL_COUNT) are showing.
    const [expanded, setExpanded] = useState(false);

    // Show the first 5, or all of them once "See more" is clicked.
    const visibleFaqs = expanded ? faqs : faqs.slice(0, INITIAL_COUNT);
    // Only worth showing the button if there's actually a second batch.
    const hasMore = faqs.length > INITIAL_COUNT;

    const toggle = (index: number) =>
        setOpenIndex((current) => (current === index ? null : index));

    return (
        <section className="max-w-3xl mx-auto px-4 py-16">
            <Reveal className="mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Frequently Asked Questions
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Everything you need to know before you order. Still stuck? Our team
                    is here 24/7.
                </p>
            </Reveal>

            {/* The accordion. Each item is a rounded card; the open one gets a
                brand-tinted border so it's easy to see what's expanded. */}
            <div className="space-y-3">
                {visibleFaqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={faq.question}
                            className={`rounded-2xl border bg-white transition-colors ${
                                isOpen
                                    ? "border-brand/40 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            {/* The clickable question row. aria-expanded + the
                                controlled panel id make it accessible to screen
                                readers as a proper disclosure. */}
                            <button
                                type="button"
                                onClick={() => toggle(index)}
                                aria-expanded={isOpen}
                                aria-controls={`faq-panel-${index}`}
                                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                            >
                                <span className="text-sm sm:text-base font-medium text-gray-900">
                                    {faq.question}
                                </span>
                                {/* Icon swaps plus/minus to signal open state. The
                                    circle picks up the brand tint when open. */}
                                <span
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                                        isOpen
                                            ? "bg-brand text-white"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {isOpen ? <FiMinus size={16} /> : <FiPlus size={16} />}
                                </span>
                            </button>

                            {/* The answer panel. We animate max-height + opacity via
                                a grid-rows trick so it slides open smoothly without
                                needing to measure the content height in JS. */}
                            <div
                                id={`faq-panel-${index}`}
                                role="region"
                                className={`grid transition-all duration-300 ease-out ${
                                    isOpen
                                        ? "grid-rows-[1fr] opacity-100"
                                        : "grid-rows-[0fr] opacity-0"
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* See more / See less. Only rendered when there's a second batch.
                Clicking toggles the extra questions; collapsing also closes any
                open question that's about to disappear so state stays clean. */}
            {hasMore && (
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setExpanded((prev) => {
                                const next = !prev;
                                // If we're collapsing and the open question is in the
                                // hidden batch, close it so it doesn't linger in state.
                                if (!next && openIndex !== null && openIndex >= INITIAL_COUNT) {
                                    setOpenIndex(null);
                                }
                                return next;
                            });
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-brand hover:border-brand hover:bg-brand/5 transition-colors"
                    >
                        {expanded ? "See less" : "See more"}
                    </button>
                </div>
            )}
        </section>
    );
}
