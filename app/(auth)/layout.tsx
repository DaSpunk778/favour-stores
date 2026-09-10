import Link from "next/link";
import Image from "next/image";

// Focused, distraction-free shell for the auth pages: no site header/footer,
// just the brand mark and a soft green gradient backdrop that echoes the
// glassy aesthetic used across the store.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-linear-to-br from-[#f0fdf4] via-white to-[#ecfdf3] flex flex-col">
      {/* Ambient brand-green glow blobs. Clipped by their own wrapper (not by
          <main>) so the sticky header below keeps working — position: sticky
          breaks if an ancestor on its chain has overflow-hidden. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-brand-light/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 px-4 sm:px-6 py-5 bg-white/50 backdrop-blur-md">
        <Link href="/" className="inline-flex">
          <Image
            src="/favour-logo.png"
            alt="Favour Stores"
            height={40}
            width={160}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12">
        {children}
      </div>
    </main>
  );
}
