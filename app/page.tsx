import Image from "next/image";
import AnnouncementBar from "@/components/Layout/AnnouncementBar";
import Header from "@/components/Layout/Header";
import Hero from "@/components/home/Hero";
import CategoryStrip from "@/components/CategoryStrip";
import FeaturedProducts from "@/components/FeaturedProducts"
import BrandsCarousel from "@/components/BrandsCarousel";


export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Hero />
      <CategoryStrip />
      <FeaturedProducts />
      <BrandsCarousel />
    </>
  );
}
