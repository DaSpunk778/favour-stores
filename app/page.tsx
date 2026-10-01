import AnnouncementBar from "@/components/Layout/AnnouncementBar";
import Header from "@/components/Layout/Header";
import SearchBar from "@/components/search/SearchBar";
import Hero from "@/components/home/Hero";
import CategoryStrip from "@/components/CategoryStrip";
import FeaturedProducts from "@/components/FeaturedProducts"
import BrandsCarousel from "@/components/BrandsCarousel";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import WhyShopWithUs from "@/components/WhyShopWithUs";
import PromoBanner from "@/components/PromoBanner";
import Faq from "@/components/Faq";
import Footer from "@/components/Layout/Footer";


export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <SearchBar />
      <Hero />
      <CategoryStrip />
      <FeaturedProducts />
      <BrandsCarousel />
      <WhyShopWithUs />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
      <Faq />
      <Footer />
    </>
  );
}
