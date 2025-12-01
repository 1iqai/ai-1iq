import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../../components/Navigation";
import HeroSection from "../../components/Shared/HeroSection/HeroSection";
import IndustriesBanner from "../../components/Shared/IndustriesBanner/IndustriesBanner";
// import FeedbackSection from "../../components/Shared/FeedbackSection/FeedbackSection";
import CoreValuePillars from "../../components/Shared/CoreValuePillars/CoreValuePillars";
import ThreeDSection from "../../components/ThreeDSection";
import FeaturesSection from "../../components/Shared/FeaturesSection/FeaturesSection";
import Footer from "../../components/Shared/Footer/Footer";
import BrandCarousel from "../../components/Shared/BrandCarousel/BrandCarousel";

// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { ScrollSmoother } from "gsap/ScrollSmoother";

const Home = () => {
  const heroRef = useRef(null);
  // gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  // const main = useRef(null);

  // useGSAP(
  //   () => {
  //     const smoother = ScrollSmoother.create({
  //       wrapper: "#smooth-wrapper",
  //       content: "#smooth-content",
  //       smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
  //       effects: true, // looks for data-speed and data-lag attributes on elements
  //     });

  //     return () => {
  //       // Clean up the ScrollSmoother instance on component unmount
  //       smoother.kill();
  //     };
  //   },
  //   { scope: main }
  // );

  useEffect(() => {
    // Smooth scrolling setup
    // This can be handled via CSS (already added in index.css) or with GSAP ScrollSmoother
    // For now, we're using CSS smooth scroll behavior

    // Refresh ScrollTrigger on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Kill all ScrollTrigger instances on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* <div ref={main}> */}
      {/* <div id="smooth-wrapper">
          <div id="smooth-content"> */}
      <div className="app relative w-full overflow-x-hidden">
        {/* Navigation Component */}
        <Navigation heroRef={heroRef} />

        {/* Hero Section with Video Background */}
        <HeroSection heroRef={heroRef} />

        {/* Industries Banner */}
        <IndustriesBanner />

        {/* Core Value Pillars Section */}
        <CoreValuePillars />

        {/* 3D Model Section */}
        <ThreeDSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Brand Carousel */}
        <BrandCarousel />

        {/* Footer */}
        <Footer />
      </div>
      {/* </div>
        </div>
      </div> */}
    </>
  );
};

export default Home;
