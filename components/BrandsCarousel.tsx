"use client";

import { PiHandshake } from "react-icons/pi";

type Brand = {
    name: string;
    slug: string;
    logo: string;
};

const brands: Brand[] = [
    { name: "Hisense", slug: "hisense", logo: "/brands/hisense.png" },
    { name: "LG", slug: "lg", logo: "/brands/lg.png" },
    { name: "Skyrun", slug: "skyrun", logo: "/brands/skyrun.png" },
    { name: "Aeon", slug: "aeon", logo: "/brands/aeon.png" },
    { name: "Royal", slug: "royal", logo: "/brands/royal.png" },
    { name: "Century", slug: "century", logo: "/brands/century.png" },
    { name: "Mewe", slug: "mewe", logo: "/brands/mewe.png" },
    { name: "TCL", slug: "tcl", logo: "/brands/tcl.png" },
    { name: "Snowsea", slug: "snowsea", logo: "/brands/snowsea.png" },
    { name: "Sony", slug: "sony", logo: "/brands/sony.png" },
    { name: "Senwei", slug: "senwei", logo: "/brands/senwei.png" },
    { name: "Philips", slug: "philips", logo: "/brands/philips.png" },
    { name: "Panasonic", slug: "panasonic", logo: "/brands/panasonic.png" },
];

// Duplicate the list so the CSS marquee can loop seamlessly (see
// the @keyframes in globals.css — it translates exactly -50%,
// which lines up perfectly since there are two identical halves).
const marqueeBrands = [...brands, ...brands];

export default function BrandsCarousel() {
    return (
        <section className="py-10 border-y border-gray-100 bg-gray-50/50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
                    <span>Trusted Brands </span>
                    <span className="inline-flex"><PiHandshake size={20} color="green" /></span>
                </h2>
            </div>

            <div className="relative">
                {/* Fade edges so logos don't hard-cut at the viewport edge */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 bg-linear-to-r from-gray-50/50 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-linear-to-l from-gray-50/50 to-transparent" />

                <div className="brand-marquee-track flex items-center gap-10 sm:gap-16 w-max">
                    {marqueeBrands.map((brand, i) => (
                        <div
                            key={`${brand.slug}-${i}`}
                            className="shrink-0 flex items-center justify-center h-12 sm:h-14 w-28 sm:w-32"
                        >
                            {/* Plain <img> here (not next/image) since these are small,
                                purely decorative logos repeated in a duplicated marquee list —
                                next/image optimization overhead isn't worth it for this case. */}
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}