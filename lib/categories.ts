// Single source of truth for product categories. Imported by the homepage
// CategoryStrip and the /categories/[slug] listing route so slugs stay in sync.

export type Category = {
  name: string;
  slug: string;
  image: string;
  comingSoon?: boolean;
};

export const categories: Category[] = [
  { name: "Electric Kettles & Jugs", slug: "kettles-jugs", image: "/categories/kettles-jugs.jpg" },
  { name: "Airfryers", slug: "airfryers", image: "/categories/airfryers.jpg" },
  { name: "Fans", slug: "fans", image: "/categories/fans.jpg" },
  { name: "Blenders", slug: "blenders", image: "/categories/blenders.jpg" },
  { name: "Combo Deals", slug: "combo-deals", image: "/categories/combo-deals.jpg", comingSoon: true },
  { name: "Power Solutions", slug: "power-solutions", image: "/categories/power-solutions.jpg" },
  { name: "Video Games", slug: "video-games", image: "/categories/video-games.jpg" },
  { name: "Monitors", slug: "monitors", image: "/categories/monitors.jpg" },
  { name: "Cookers", slug: "cookers", image: "/categories/cookers.jpg" },
  { name: "Freezers", slug: "freezers", image: "/categories/freezers.jpg" },
  { name: "ACs", slug: "acs", image: "/categories/acs.jpg" },
  { name: "Audio", slug: "audio", image: "/categories/audio.jpg" },
  { name: "Washing Machines", slug: "washing-machines", image: "/categories/washing-machines.jpg" },
  { name: "Refrigerators", slug: "refrigerators", image: "/categories/refrigerators.jpg" },
  { name: "TVs", slug: "tvs", image: "/categories/tvs.jpg" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
