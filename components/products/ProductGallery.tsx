"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FiX, FiMaximize2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductBadge from "./ProductBadge";
import type { Product } from "@/lib/products";

// Detail-page gallery: a sized main image with a thumbnail strip (shown only
// when there's more than one image) and a click-to-zoom lightbox that can be
// navigated with the arrows or the keyboard. Client-side for the open/active
// state; the surrounding detail page stays a server component.
export default function ProductGallery({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge?: Product["badge"];
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const hasMany = images.length > 1;

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((i) => (i + dir + images.length) % images.length);
    },
    [images.length]
  );

  // Lock body scroll + wire keyboard controls while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go]);

  return (
    <>
      <div className="flex w-full max-w-md flex-col gap-3">
        {/* Main image */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="View larger image"
          className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 cursor-zoom-in"
        >
          {badge && (
            <span className="absolute top-3 left-3 z-10">
              <ProductBadge badge={badge} size="md" />
            </span>
          )}
          <Image
            src={images[active]}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute bottom-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-gray-700 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <FiMaximize2 size={16} />
          </span>
        </button>

        {/* Thumbnails */}
        {hasMany && (
          <div className="flex gap-2.5">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:w-20 ${
                  i === active
                    ? "border-brand"
                    : "border-gray-100 hover:border-gray-300"
                }`}
              >
                <Image
                  src={src}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <FiX size={22} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-2xl"
          >
            <Image
              src={images[active]}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-contain"
            />

            {/* Arrows overlaid ON the image, vertically centred — not below it. */}
            {hasMany && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <FiChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <FiChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {hasMany && (
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              {active + 1} / {images.length}
            </span>
          )}
        </div>
      )}
    </>
  );
}
