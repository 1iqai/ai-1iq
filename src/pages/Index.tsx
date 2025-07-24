
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ModernFeatures from "@/components/ModernFeatures";
import ModernTestimonials from "@/components/ModernTestimonials";
import ModernCTA from "@/components/ModernCTA";
import PartnersSection from "@/components/PartnersSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="bg-background">
        <Hero />
        <ModernFeatures />
        <ModernTestimonials />
        <PartnersSection />
        <ModernCTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
