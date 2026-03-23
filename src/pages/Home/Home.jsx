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

        {/* Industries Banner */}
        <IndustriesBanner />

        {/* ── Value Blocks ── */}
        <section className="value-blocks">

          {/* Subtle background texture */}
          <div className="value-blocks__bg" aria-hidden="true" />

          <div className="value-blocks__inner">
            <div className="value-blocks__header">
              <h2 className="value-blocks__title">What 1iQ actually does.</h2>
            </div>

            <div className="value-blocks__grid">

              {/* Block 1 */}
              <div className="value-block">
                <div className="value-block__num">01</div>
                <div className="value-block__content">
                  <h3 className="value-block__heading">
                    Field activity becomes intelligence. INSTANTLY.
                  </h3>
                  <p className="value-block__desc">
                    Site activity converts to live project data the moment it happens.
                  </p>
                </div>
                <div className="value-block__footer">
                  <span className="value-block__pill">Real-Time Capture</span>
                </div>
              </div>

              {/* Block 2 */}
              <div className="value-block value-block--mid">
                <div className="value-block__num">02</div>
                <div className="value-block__content">
                  <h3 className="value-block__heading">
                    Schedules that rewrite themselves.
                  </h3>
                  <p className="value-block__desc">
                    Tasks close. Timelines adjust. No one touches a thing.
                  </p>
                </div>
                <div className="value-block__footer">
                  <span className="value-block__pill">Auto-Scheduling</span>
                </div>
              </div>

              {/* Block 3 */}
              <div className="value-block">
                <div className="value-block__num">03</div>
                <div className="value-block__content">
                  <h3 className="value-block__heading">
                    Stop waiting for someone to tell you what's happening.
                  </h3>
                  <p className="value-block__desc">
                    Live alerts surface issues before anyone sends an update.
                  </p>
                </div>
                <div className="value-block__footer">
                  <span className="value-block__pill">Proactive Alerts</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <ROICalculator />

        {/* ── What 1iQ Returns ── */}
        <section className="returns-section">
          <div className="returns-section__inner">

            <div className="returns-section__header">
              <p className="returns-section__eyebrow">THE RETURN</p>
              <h2 className="returns-section__title">What 1iQ Returns to Every PM</h2>
            </div>

            <div className="returns-grid">

              <div className="returns-card">
                <span className="returns-card__stat">332 hrs</span>
                <h3 className="returns-card__heading">Schedules That Stop Breaking</h3>
                <p className="returns-card__desc">Live field data. No manual P6 entry.</p>
              </div>

              <div className="returns-card">
                <span className="returns-card__stat">182 hrs</span>
                <h3 className="returns-card__heading">Reports That Write Themselves</h3>
                <p className="returns-card__desc">Automated summaries. Every week. Zero effort.</p>
              </div>

              <div className="returns-card">
                <span className="returns-card__stat">109 hrs</span>
                <h3 className="returns-card__heading">Every Answer. Instantly.</h3>
                <p className="returns-card__desc">Ask 1iQ. It has read every document on the job.</p>
              </div>

              <div className="returns-card">
                <span className="returns-card__stat">208 hrs</span>
                <h3 className="returns-card__heading">The Admin That Runs Itself</h3>
                <p className="returns-card__desc">RFIs, reporting, daily logs are handled automatically.</p>
              </div>

              <div className="returns-card returns-card--accent">
                <span className="returns-card__stat">See Your Number</span>
                <h3 className="returns-card__heading">Direct Savings Per PM</h3>
                <p className="returns-card__desc">Your savings depend on your PM rate. Use the calculator above to find your exact figure.</p>
              </div>

              <div className="returns-card returns-card--accent">
                <span className="returns-card__stat">$350K</span>
                <h3 className="returns-card__heading">New Revenue Per PM</h3>
                <p className="returns-card__desc">One extra project a year. Already in your capacity.</p>
              </div>

            </div>

          </div>
        </section>

        {/* Brand Carousel */}
        <BrandCarousel />

        {/* 3D Model Section */}
        <ThreeDSection />

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
              <span className="testimonial-section__name">Bamshad Akhbari — CEO</span>
              <span className="testimonial-section__company">Halifax Construction &amp; Development</span>
              <span className="testimonial-section__company">Los Angeles, CA</span>
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
