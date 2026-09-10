import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";

import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin · Favour Stores",
  // Keep the dashboard out of search results.
  robots: { index: false, follow: false },
};

// Branded admin shell: a sticky sidebar (logo, nav, back-to-store) beside the
// page content. Server component — the only interactive piece is <AdminNav>.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-gray-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="border-b border-gray-100 px-5 py-4">
              <Link href="/admin" className="inline-flex items-center">
                <Image
                  src="/favour-logo.png"
                  alt="Favour Stores"
                  width={140}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </Link>
            </div>

            <div className="flex-1 px-3 py-4">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Manage
              </p>
              <AdminNav />
            </div>

            <div className="border-t border-gray-100 p-3">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <FiExternalLink size={16} className="shrink-0" />
                View store
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
