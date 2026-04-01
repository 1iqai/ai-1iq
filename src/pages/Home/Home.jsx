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

            {/* Split layout: content left, mockup right */}
            <div className="value-blocks__split">

              {/* LEFT — heading + feature list */}
              <div className="value-blocks__copy">
                <p className="value-blocks__eyebrow">THE PLATFORM</p>
                <h2 className="value-blocks__title">What 1iQ actually does.</h2>

                <div className="value-blocks__features">

                  <div className="vb-feature">
                    <div className="vb-feature__num">01</div>
                    <div className="vb-feature__body">
                      <div className="vb-feature__header">
                        <span className="vb-feature__pill">Real-Time Capture</span>
                        <h3 className="vb-feature__heading">
                          Field activity becomes intelligence. Instantly.
                        </h3>
                      </div>
                      <p className="vb-feature__desc">
                        Site activity converts to live project data the moment it happens — no manual entry, no lag.
                      </p>
                    </div>
                  </div>

                  <div className="vb-feature">
                    <div className="vb-feature__num">02</div>
                    <div className="vb-feature__body">
                      <div className="vb-feature__header">
                        <span className="vb-feature__pill">Auto-Scheduling</span>
                        <h3 className="vb-feature__heading">
                          Schedules that rewrite themselves.
                        </h3>
                      </div>
                      <p className="vb-feature__desc">
                        Tasks close. Timelines adjust. No one touches a thing.
                      </p>
                    </div>
                  </div>

                  <div className="vb-feature">
                    <div className="vb-feature__num">03</div>
                    <div className="vb-feature__body">
                      <div className="vb-feature__header">
                        <span className="vb-feature__pill">Proactive Alerts</span>
                        <h3 className="vb-feature__heading">
                          Stop waiting to find out what's wrong.
                        </h3>
                      </div>
                      <p className="vb-feature__desc">
                        Live alerts surface issues before anyone sends an update or makes a call.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* RIGHT — multi-device product mockup */}
              <div className="value-blocks__mockup">
                <div className="value-blocks__mockup-glow" aria-hidden="true" />
                <img
                  src="/assets/img/mockups/MultiDeviceMock.png"
                  alt="1iQ project management platform across desktop, laptop, tablet, and mobile"
                  className="value-blocks__mockup-img"
                  loading="lazy"
                />
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
              <p className="returns-section__sub">The breakdown of 831 hours — and where the real value lives.</p>
            </div>

            <div className="returns-two-col">

              {/* ── LEFT: Hours visual ── */}
              <div className="returns-hours">
                <div className="returns-hours__hero">
                  <span className="returns-hours__total">831</span>
                  <span className="returns-hours__label">Hours Returned to Every PM Annually</span>
                </div>

                {/* Stacked bar */}
                <div className="returns-bar" aria-label="Hour breakdown bar chart">
                  <div className="returns-bar__segment returns-bar__segment--1" style={{width: '40%'}}>
                    <span className="returns-bar__tip">332 hrs</span>
                  </div>
                  <div className="returns-bar__segment returns-bar__segment--2" style={{width: '22%'}}>
                    <span className="returns-bar__tip">182 hrs</span>
                  </div>
                  <div className="returns-bar__segment returns-bar__segment--3" style={{width: '13%'}}>
                    <span className="returns-bar__tip">109 hrs</span>
                  </div>
                  <div className="returns-bar__segment returns-bar__segment--4" style={{width: '25%'}}>
                    <span className="returns-bar__tip">208 hrs</span>
                  </div>
                </div>

                {/* Legend */}
                <ul className="returns-legend">
                  <li className="returns-legend__item">
                    <span className="returns-legend__dot returns-legend__dot--1" />
                    <span className="returns-legend__text"><strong>332 hrs</strong> — Schedules That Stop Breaking</span>
                  </li>
                  <li className="returns-legend__item">
                    <span className="returns-legend__dot returns-legend__dot--2" />
                    <span className="returns-legend__text"><strong>182 hrs</strong> — Reports That Write Themselves</span>
                  </li>
                  <li className="returns-legend__item">
                    <span className="returns-legend__dot returns-legend__dot--3" />
                    <span className="returns-legend__text"><strong>109 hrs</strong> — Every Answer. Instantly</span>
                  </li>
                  <li className="returns-legend__item">
                    <span className="returns-legend__dot returns-legend__dot--4" />
                    <span className="returns-legend__text"><strong>208 hrs</strong> — The Admin That Runs Itself</span>
                  </li>
                </ul>
              </div>

              {/* ── RIGHT: Financial impact ── */}
              <div className="returns-financial">
                <h3 className="returns-financial__headline">Here's What That Means</h3>

                <div className="returns-metric">
                  <span className="returns-metric__value">$71,397</span>
                  <span className="returns-metric__label">Direct Savings Per PM</span>
                  <span className="returns-metric__sub">Based on fully loaded PM rate</span>
                </div>

                <div className="returns-metric">
                  <span className="returns-metric__value">$350,000</span>
                  <span className="returns-metric__label">New Revenue Per PM</span>
                  <span className="returns-metric__sub">One extra project per year — already in your capacity</span>
                </div>

                <div className="returns-metric">
                  <span className="returns-metric__value">$2.1M</span>
                  <span className="returns-metric__label">Year 1 Net Benefit</span>
                  <span className="returns-metric__sub">For a 5-PM team</span>
                </div>

                <p className="returns-financial__note">
                  Numbers based on industry averages.{' '}
                  <a
                    href="#roi-calculator"
                    className="returns-financial__roi-link"
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById('roi-calculator');
                      if (!target) return;
                      if (window.lenis) {
                        window.lenis.scrollTo(target);
                      } else {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    Use the ROI calculator to see your firm's exact figures.
                  </a>
                </p>
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
