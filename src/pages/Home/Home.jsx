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
import ROICalculator from "../../components/ROICalculator";

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

        {/* ── Value Blocks ── */}
        <section className="value-blocks">
          <div className="value-blocks__header">
            <h2 className="value-blocks__title">What 1iQ actually does.</h2>
          </div>
          <div className="value-blocks__grid">

            <div className="value-block">
              <div className="value-block__bar" />
              <div className="value-block__content">
                <h3 className="value-block__heading">
                  Field activity becomes intelligence, instantly.
                </h3>
                <p className="value-block__desc">
                  The moment work happens on site, 1iQ converts it into real-time analytics your team can act on immediately.
                </p>
              </div>
            </div>

            <div className="value-block">
              <div className="value-block__bar" />
              <div className="value-block__content">
                <h3 className="value-block__heading">
                  Schedules that rewrite themselves.
                </h3>
                <p className="value-block__desc">
                  Completed tasks trigger automatic date adjustments, timeline shifts, and team alerts with no human in the loop required.
                </p>
              </div>
            </div>

            <div className="value-block">
              <div className="value-block__bar" />
              <div className="value-block__content">
                <h3 className="value-block__heading">
                  Stop waiting for someone to tell you what's happening.
                </h3>
                <p className="value-block__desc">
                  1iQ tells you first with live data, live alerts, and decisions that don't wait for Monday's meeting.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ROI Calculator Section */}
        <ROICalculator />


        {/* Features Section */}
        <FeaturesSection />

        {/* Brand Carousel */}
        <BrandCarousel />

        {/* 3D Model Section */}
        <ThreeDSection />

        {/* Industries Banner */}
        <IndustriesBanner />
        {/* Core Value Pillars Section */}
        <CoreValuePillars />

        {/* ADDITION 3 — Testimonial Placeholder */}
        <section className="testimonial-section">
          <div className="testimonial-section__inner">
            <svg className="testimonial-section__quote-mark" width="40" height="32" viewBox="0 0 40 32" fill="none">
              <path d="M0 32V19.2C0 8.533 5.867 2.133 17.6 0L19.2 3.2C13.6 4.267 10.4 7.467 9.6 12.8H16V32H0ZM24 32V19.2C24 8.533 29.867 2.133 41.6 0L43.2 3.2C37.6 4.267 34.4 7.467 33.6 12.8H40V32H24Z" fill="#4a9eff" fillOpacity="0.2"/>
            </svg>
            {/* PLACEHOLDER — replace with real client quote when available */}
            <blockquote className="testimonial-section__quote">
              "1iQ didn't just save us time; it changed how our PMs think about their week. The reporting alone recovered two full days per month, per person."
            </blockquote>
            {/* PLACEHOLDER — replace with real name, title, and company */}
            <cite className="testimonial-section__attribution">
              <span className="testimonial-section__name">Senior Project Executive</span>
              <span className="testimonial-section__company">Commercial Construction, Southwest US</span>
            </cite>
          </div>
        </section>

        {/* ADDITION 1 — Positioning Statement Section */}
        <section className="positioning-section">
          <div className="positioning-section__inner">
            <p className="positioning-section__eyebrow">A NEW CATEGORY OF SOFTWARE</p>
            <div className="positioning-section__statements">
              <p className="positioning-section__line">CRMs manage customers.</p>
              <p className="positioning-section__line">ERPs manage finances.</p>
              <p className="positioning-section__line positioning-section__line--highlight">1iQ manages project intelligence.</p>
            </div>
            <p className="positioning-section__body">
              Every construction firm runs some version of a CRM and an ERP. Neither one knows what's happening on site. 1iQ is the layer that does, connecting field activity, scheduling, reporting, and risk into a single live intelligence platform built specifically for construction operations.
            </p>
            <a href="/platform" className="positioning-section__cta">
              Explore the Platform
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </section>

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
