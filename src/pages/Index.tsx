
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <Hero />
        <ScrollingBanner />
        <Features />
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
