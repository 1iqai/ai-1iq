import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../../components/Navigation";
import HeroSection from "../../components/Shared/HeroSection/HeroSection";
import IndustriesBanner from "../../components/Shared/IndustriesBanner/IndustriesBanner";
import ThreeDSection from "../../components/ThreeDSection";
import Footer from "../../components/Shared/Footer/Footer";
import BrandCarousel from "../../components/Shared/BrandCarousel/BrandCarousel";
import ROICalculator from "../../components/ROICalculator";
import AnimatedNumber from "../../components/Shared/AnimatedNumber/AnimatedNumber";

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <div className="app relative w-full overflow-x-hidden">

        <Navigation heroRef={heroRef} />
        <HeroSection heroRef={heroRef} />
        <IndustriesBanner />

        {/* ── Value Blocks ── */}
        <section className="value-blocks">
          <div className="value-blocks__bg" aria-hidden="true" />
          <div className="value-blocks__inner">
            <div className="value-blocks__split">

              {/* LEFT — heading + feature list */}
              <div className="value-blocks__copy">
                <p className="value-blocks__eyebrow">THE INTELLIGENCE LAYER</p>
                <h2 className="value-blocks__title">From field to boardroom. No intermediary.</h2>

                <div className="value-blocks__features">

                  <div className="vb-feature">
                    <div className="vb-feature__num">01</div>
                    <div className="vb-feature__body">
                      <div className="vb-feature__header">
                        <span className="vb-feature__pill">Live Field Intelligence</span>
                        <h3 className="vb-feature__heading">
                          Ground-truth visibility the moment it happens.
                        </h3>
                      </div>
                      <p className="vb-feature__desc">
                        Your GC's field team logs updates through 1iQ's mobile app. Three taps (Start Task, Report Issue, End Task) and the data flows directly to your developer dashboard. No filtering. No delay. No consultant in between.
                      </p>
                    </div>
                  </div>

                  <div className="vb-feature">
                    <div className="vb-feature__num">02</div>
                    <div className="vb-feature__body">
                      <div className="vb-feature__header">
                        <span className="vb-feature__pill">Feasibility Intelligence</span>
                        <h3 className="vb-feature__heading">
                          ROI visibility before capital is committed.
                        </h3>
                      </div>
                      <p className="vb-feature__desc">
                        1iQ generates full project schedules and execution risk models from minimal inputs in any geographic market, in minutes. Replaces $50K to $200K in consultant feasibility fees.
                      </p>
                    </div>
                  </div>

                  <div className="vb-feature">
                    <div className="vb-feature__num">03</div>
                    <div className="vb-feature__body">
                      <div className="vb-feature__header">
                        <span className="vb-feature__pill">Predictive Risk Oversight</span>
                        <h3 className="vb-feature__heading">
                          See problems before they become losses.
                        </h3>
                      </div>
                      <p className="vb-feature__desc">
                        AI continuously monitors schedule performance, budget variance, and field activity. Risk flags surface to your dashboard before your GC's next report, giving you days or weeks to act.
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
                  alt="1iQ development intelligence platform across desktop, laptop, tablet, and mobile"
                  className="value-blocks__mockup-img"
                  loading="lazy"
                />
              </div>

            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <ROICalculator />

        {/* ── What 1iQ Returns ── */}
        <section className="returns-section">
          <div className="returns-section__inner">

            <div className="returns-section__header">
              <p className="returns-section__eyebrow">THE ROI</p>
              <h2 className="returns-section__title">What 1iQ Returns to Every Developer</h2>
              <p className="returns-section__sub">The capital protection case for a single $20M project.</p>
            </div>

            <div className="returns-two-col">

              {/* LEFT */}
              <div className="returns-hours">
                <div className="returns-hours__hero">
                  <span className="returns-hours__total">2x</span>
                  <span className="returns-hours__label">Minimum ROI on a Single Avoided Overrun</span>
                </div>

                <div className="returns-bar" aria-label="Capital protection breakdown">
                  <div className="returns-bar__segment returns-bar__segment--1" style={{width: '40%'}}>
                    <span className="returns-bar__tip">$190K+</span>
                  </div>
                  <div className="returns-bar__segment returns-bar__segment--2" style={{width: '22%'}}>
                    <span className="returns-bar__tip">$1M+</span>
                  </div>
                  <div className="returns-bar__segment returns-bar__segment--3" style={{width: '13%'}}>
                    <span className="returns-bar__tip">$100K</span>
                  </div>
                  <div className="returns-bar__segment returns-bar__segment--4" style={{width: '25%'}}>
                    <span className="returns-bar__tip">$300K</span>
                  </div>
                </div>

                <ul className="returns-legend">
                  <li className="returns-legend__item">
                    <span className="returns-legend__dot returns-legend__dot--1" />
                    <span className="returns-legend__text"><strong><AnimatedNumber value={190} prefix="$" suffix="K+" /></strong>: Feasibility Study Savings</span>
                  </li>
                  <li className="returns-legend__item">
                    <span className="returns-legend__dot returns-legend__dot--2" />
                    <span className="returns-legend__text"><strong><AnimatedNumber value={4} prefix="$" suffix="M" /> to <AnimatedNumber value={6} prefix="$" suffix="M" /></strong>: Overrun Exposure Protected</span>
                  </li>
                  <li className="returns-legend__item">
                    <span className="returns-legend__dot returns-legend__dot--3" />
                    <span className="returns-legend__text"><strong><AnimatedNumber value={100} prefix="$" suffix="K/yr" /></strong>: Investor Reporting Labor Saved</span>
                  </li>
                  <li className="returns-legend__item">
                    <span className="returns-legend__dot returns-legend__dot--4" />
                    <span className="returns-legend__text"><strong><AnimatedNumber value={300} prefix="$" suffix="K/yr" /></strong>: Owner's Rep Fees Eliminated</span>
                  </li>
                </ul>
              </div>

              {/* RIGHT */}
              <div className="returns-financial">
                <h3 className="returns-financial__headline">Here's What That Means</h3>

                <div className="returns-metric">
                  <span className="returns-metric__value"><AnimatedNumber value={500} prefix="$" suffix="K" /></span>
                  <span className="returns-metric__label">1iQ Fee on a $20M Project</span>
                  <span className="returns-metric__sub">2.5% of total project budget</span>
                </div>

                <div className="returns-metric">
                  <span className="returns-metric__value"><AnimatedNumber value={1} prefix="$" suffix="M+" /></span>
                  <span className="returns-metric__label">Saved on a Single Avoided Overrun</span>
                  <span className="returns-metric__sub">5% budget protection on a $20M project</span>
                </div>

                <div className="returns-metric">
                  <span className="returns-metric__value"><AnimatedNumber value={2} suffix="x+" /></span>
                  <span className="returns-metric__label">Net ROI Minimum in Year 1</span>
                  <span className="returns-metric__sub">On a single avoided delay or overrun event</span>
                </div>

                <p className="returns-financial__note">
                  Numbers based on McKinsey, FMI, and CII industry research.{' '}
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
                    Use the ROI calculator to see your project's exact figures.
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

        {/* Testimonial: replace with real developer quote when available */}
        <section className="testimonial-section">
          <div className="testimonial-section__inner">
            <svg className="testimonial-section__quote-mark" width="40" height="32" viewBox="0 0 40 32" fill="none">
              <path d="M0 32V19.2C0 8.533 5.867 2.133 17.6 0L19.2 3.2C13.6 4.267 10.4 7.467 9.6 12.8H16V32H0ZM24 32V19.2C24 8.533 29.867 2.133 41.6 0L43.2 3.2C37.6 4.267 34.4 7.467 33.6 12.8H40V32H24Z" fill="#4a9eff" fillOpacity="0.2"/>
            </svg>
            <blockquote className="testimonial-section__quote">
              "Before 1iQ, I was making capital decisions based on a GC report that was two weeks old. Now I see exactly what's happening on site the moment it happens. That visibility is worth more than any consultant I've ever hired."
            </blockquote>
            <cite className="testimonial-section__attribution">
              <span className="testimonial-section__name">Developer & Investor</span>
              <span className="testimonial-section__company">Boutique Real Estate Development</span>
              <span className="testimonial-section__company">Los Angeles, CA</span>
            </cite>
          </div>
        </section>

        {/* Positioning Statement */}
        <section className="positioning-section">
          <div className="positioning-section__inner">
            <p className="positioning-section__eyebrow">DEVELOPMENT INTELLIGENCE INFRASTRUCTURE</p>
            <div className="positioning-section__statements">
              <p className="positioning-section__line">Consultants filter information.</p>
              <p className="positioning-section__line">GC reports arrive weeks late.</p>
              <p className="positioning-section__line positioning-section__line--highlight">1iQ gives you the unfiltered truth.</p>
            </div>
            <p className="positioning-section__body">
              Real estate developers and investors make multi-million dollar capital decisions based on information that is weeks old, filtered through consultants, and fragmented across disconnected platforms. 1iQ is the operating intelligence layer that changes this by connecting live field data, AI risk analysis, feasibility modeling, and investor reporting in a single platform. Built for the developer. Not the contractor.
            </p>
            <a href="/platform" className="positioning-section__cta">
              Explore the Platform
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;
