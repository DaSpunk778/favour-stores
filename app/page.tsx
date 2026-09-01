import AnnouncementBar from "@/components/Layout/AnnouncementBar";
import Header from "@/components/Layout/Header";
import Hero from "@/components/home/Hero";
import CategoryStrip from "@/components/CategoryStrip";
import FeaturedProducts from "@/components/FeaturedProducts"
import BrandsCarousel from "@/components/BrandsCarousel";
import Testimonials from "@/components/Testimonials";


export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Hero />
      <CategoryStrip />
      <FeaturedProducts />
      <BrandsCarousel />
      <Testimonials />
    </>
  );
}
