import { redirect } from "next/navigation";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import AccountNav from "@/components/account/AccountNav";
import { getCurrentUser } from "@/lib/dal";

// Shared shell for every /account/* page. This is where we gate the whole
// section: if there's no signed-in user we send them to /login. Because
// getCurrentUser is cached per request, the child pages can call it again for
// the user id without a second DB hit.
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="text-sm text-gray-500">Signed in as {user.email}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <AccountNav />
          </aside>

          {/* Page content */}
          <section className="flex-1 min-w-0">{children}</section>
        </div>
      </main>
      <Footer />
    </>
  );
}
