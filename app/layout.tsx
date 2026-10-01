import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { getCurrentUser } from "@/lib/dal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Favour Stores",
  description: "Projectors and allied electrical products",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read the session once on the server and expose just "is logged in" to client
  // components (e.g. the add-to-cart buttons) via AuthProvider.
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider isAuthed={Boolean(user)}>
          <SmoothScroll>{children}</SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}