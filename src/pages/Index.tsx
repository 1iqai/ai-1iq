
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";
import PlatformsIntro from "@/components/PlatformsIntro";
import BuildSection from "@/components/BuildSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="bg-white">
        <Hero />
        <ScrollingBanner />
        <PlatformsIntro />
        <BuildSection />
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
