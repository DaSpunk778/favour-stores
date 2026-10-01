import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { getCurrentUser } from "@/lib/dal";

// Checkout page. We don't force a login to *view* the cart — the user can review
// it first and is only sent to /login when they actually place the order (handled
// in the placeOrder action). We pass isAuthed just to show a heads-up banner.
export default async function CheckoutPage() {
  const user = await getCurrentUser();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
        <CheckoutClient isAuthed={Boolean(user)} />
      </main>
      <Footer />
    </>
  );
}
