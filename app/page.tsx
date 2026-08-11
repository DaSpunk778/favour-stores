import Image from "next/image";
import AnnouncementBar from "@/components/Layout/AnnouncementBar";
import Header from "@/components/Layout/Header";
import Hero from "@/components/home/Hero";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Hero />
    </>
  );
}
