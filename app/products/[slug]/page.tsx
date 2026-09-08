// so slug becomes the string, which automatically needs no configuration

// Placeholder product detail page. The real gallery/price/add-to-cart UI still
// needs building — for now this just renders the slug so the route is valid.
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="max-w-7xl mx-auto px-4 py-20">
      <p className="text-sm text-gray-500">Product detail page — coming soon.</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">{slug}</h1>
    </main>
  );
}
