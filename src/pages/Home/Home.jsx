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
import MetalButton from "../../components/Shared/MetalButton/MetalButton";

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

        {/* ── Feasibility Intelligence Section ── */}
        <section className="feasibility-section">
          <div className="feasibility-section__inner">
            
            <div className="feasibility-section__header">
              <p className="feasibility-section__eyebrow">BEFORE YOU COMMIT CAPITAL</p>
              <h2 className="feasibility-section__title">Know Your Execution Risk Before the Shovel Hits the Ground.</h2>
              <p className="feasibility-section__sub">1iQ generates full feasibility intelligence from minimal inputs in any geographic market, replacing $50K-$200K in consultant fees.</p>
            </div>

            <div className="feasibility-section__grid">
              
              <div className="feasibility-card">
                <div className="feasibility-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 9h6v6H9z"/>
                    <path d="M9 1v6M15 1v6M9 17v6M15 17v6M1 9h6M17 9h6M1 15h6M17 15h6"/>
                  </svg>
                </div>
                <h3 className="feasibility-card__title">AI Schedule Generation</h3>
                <p className="feasibility-card__desc">Upload project specs and receive a full construction schedule with trade sequences, critical path analysis, and duration estimates based on local market data.</p>
              </div>

              <div className="feasibility-card">
                <div className="feasibility-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="feasibility-card__title">Execution Risk Modeling</h3>
                <p className="feasibility-card__desc">Risk probability modeling across weather, permitting, material availability, labor capacity, and market conditions specific to your project location.</p>
              </div>

              <div className="feasibility-card">
                <div className="feasibility-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <h3 className="feasibility-card__title">Capital Commitment Intelligence</h3>
                <p className="feasibility-card__desc">Stress-test your budget against execution scenarios with variance modeling, cash flow projections, and ROI sensitivity analysis.</p>
              </div>

            </div>

            <div className="feasibility-comparison">
              <div className="feasibility-comparison__card feasibility-comparison__card--old">
                <div className="feasibility-comparison__badge">Traditional Approach</div>
                <div className="feasibility-comparison__rows">
                  <div className="feasibility-comparison__row">
                    <span className="feasibility-comparison__key">Cost</span>
                    <span className="feasibility-comparison__val feasibility-comparison__val--pain">$50,000 – $200,000</span>
                  </div>
                  <div className="feasibility-comparison__row">
                    <span className="feasibility-comparison__key">Timeline</span>
                    <span className="feasibility-comparison__val feasibility-comparison__val--pain">8 – 12 weeks</span>
                  </div>
                  <div className="feasibility-comparison__row">
                    <span className="feasibility-comparison__key">Source</span>
                    <span className="feasibility-comparison__val">One consultant's opinion</span>
                  </div>
                  <div className="feasibility-comparison__row">
                    <span className="feasibility-comparison__key">Analysis</span>
                    <span className="feasibility-comparison__val">Manual. Static. Backward-looking.</span>
                  </div>
                </div>
              </div>

              <div className="feasibility-comparison__divider">
                <div className="feasibility-comparison__divider-line" />
                <span className="feasibility-comparison__divider-vs">VS</span>
                <div className="feasibility-comparison__divider-line" />
              </div>

              <div className="feasibility-comparison__card feasibility-comparison__card--new">
                <div className="feasibility-comparison__badge feasibility-comparison__badge--new">
                  1iQ Feasibility Intelligence
                </div>
                <div className="feasibility-comparison__rows">
                  <div className="feasibility-comparison__row">
                    <span className="feasibility-comparison__key">Cost</span>
                    <span className="feasibility-comparison__val feasibility-comparison__val--win">Talk to us</span>
                  </div>
                  <div className="feasibility-comparison__row">
                    <span className="feasibility-comparison__key">Timeline</span>
                    <span className="feasibility-comparison__val feasibility-comparison__val--win">Minutes</span>
                  </div>
                  <div className="feasibility-comparison__row">
                    <span className="feasibility-comparison__key">Source</span>
                    <span className="feasibility-comparison__val feasibility-comparison__val--win">AI-calibrated to your market</span>
                  </div>
                  <div className="feasibility-comparison__row">
                    <span className="feasibility-comparison__key">Analysis</span>
                    <span className="feasibility-comparison__val feasibility-comparison__val--win">Live. Predictive. On-demand.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ROI Calculator */}
        <ROICalculator />


        {/* Brand Carousel */}
        <BrandCarousel />

        {/* ── AI Predictive Engine Section ── */}
        <section className="predictive-engine">
          <div className="predictive-engine__bg" aria-hidden="true" />
          <div className="predictive-engine__inner">
            
            {/* Section Header */}
            <div className="predictive-engine__header">
              <p className="predictive-engine__eyebrow">PREDICTIVE INTELLIGENCE</p>
              <h2 className="predictive-engine__title">See Carrying Costs and Overrun Risk Before They Hit Your Ledger.</h2>
              <p className="predictive-engine__sub">1iQ's deep learning models process daily field updates to simulate delivery variance, forecasting bottlenecks weeks before they manifest.</p>
            </div>

            {/* Split Bento Layout */}
            <div className="predictive-engine__split">
              
              {/* Left Column: Interactive Risk Indicators */}
              <div className="predictive-engine__visual">
                <div className="predictive-engine__visual-glow" aria-hidden="true" />
                <div className="pe-risk-card">
                  <div className="pe-risk-card__header">
                    <span className="pe-risk-card__status pe-risk-card__status--alert">CRITICAL EXPOSURE</span>
                    <span className="pe-risk-card__metric">92% Probable</span>
                  </div>
                  <h4 className="pe-risk-card__title">Framing Delay in Zone C</h4>
                  <p className="pe-risk-card__desc">Current pacing predicts a schedule slippage of 14 days, carrying a capital exposure risk of $120K if unmitigated.</p>
                  <div className="pe-risk-card__footer">
                    <span className="pe-risk-card__badge">AI Recommendation</span>
                    <p className="pe-risk-card__rec">Authorize subcontractor overtime for MEP installation to recover critical path timelines.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Bento Features */}
              <div className="predictive-engine__copy">
                <div className="predictive-engine__features">
                  
                  <div className="pe-feature">
                    <div className="pe-feature__num">01</div>
                    <div className="pe-feature__body">
                      <h3 className="pe-feature__heading">Monte Carlo Variance Modeling</h3>
                      <p className="pe-feature__desc">Simulates 10,000+ schedule outcomes daily based on local weather, trade capacity, and procurement pacing, delivering statistical certainty on delivery dates.</p>
                    </div>
                  </div>

                  <div className="pe-feature">
                    <div className="pe-feature__num">02</div>
                    <div className="pe-feature__body">
                      <h3 className="pe-feature__heading">Carrying Cost Projections</h3>
                      <p className="pe-feature__desc">Translates physical delays into financial exposure, showing you the exact carry and debt service impact of schedule shifts in real time.</p>
                    </div>
                  </div>

                  <div className="pe-feature">
                    <div className="pe-feature__num">03</div>
                    <div className="pe-feature__body">
                      <h3 className="pe-feature__heading">Automated Recovery Scenarios</h3>
                      <p className="pe-feature__desc">When a risk is detected, our decision engine models recovery paths such as sequence adjustments or trade overlapping to protect your yield.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Central CTA using our premium MetalButton */}
            <div className="predictive-engine__cta flex justify-center mt-8">
              <MetalButton variant="secondary" redirectTo="/schedule">
                Explore Predictive Recovery
              </MetalButton>
            </div>

          </div>
        </section>

        {/* 3D Model Section */}
        <ThreeDSection />

        {/* ── Pain Section: The Visibility Problem ── */}
        <section className="pain-section">
          <div className="pain-section__inner">
            
            <div className="pain-section__header">
              <p className="pain-section__eyebrow">THE PROBLEM</p>
              <h2 className="pain-section__title">You're Making $50M Decisions on Fragmented Information.</h2>
              <p className="pain-section__sub">Every real estate developer faces the same visibility gap. Here's what it looks like in practice.</p>
            </div>

            <div className="pain-section__grid">
              
              <div className="pain-card">
                <div className="pain-card__number">01</div>
                <h3 className="pain-card__title">Delayed Reporting</h3>
                <p className="pain-card__desc">GC reports arrive 2-4 weeks late, filtered through consultants paid to interpret what they want you to hear.</p>
              </div>

              <div className="pain-card">
                <div className="pain-card__number">02</div>
                <h3 className="pain-card__title">Fragmented Data</h3>
                <p className="pain-card__desc">Budget in Excel. Schedule in MS Project. Field updates in email. No single source of truth — ever.</p>
              </div>

              <div className="pain-card">
                <div className="pain-card__number">03</div>
                <h3 className="pain-card__title">Consultant Dependency</h3>
                <p className="pain-card__desc">$10K-$25K per month for owner's reps who still give you one person's filtered view of ground truth.</p>
              </div>

              <div className="pain-card">
                <div className="pain-card__number">04</div>
                <h3 className="pain-card__title">No Feasibility Intelligence</h3>
                <p className="pain-card__desc">Pre-development analysis costs $50K-$200K in consultant fees — capital committed before execution risk is properly assessed.</p>
              </div>

              <div className="pain-card">
                <div className="pain-card__number">05</div>
                <h3 className="pain-card__title">Zero Predictive Visibility</h3>
                <p className="pain-card__desc">Problems flagged reactively after they've already hit your schedule or budget. Average overrun: 20-30% on mid-market projects.</p>
              </div>

              <div className="pain-card">
                <div className="pain-card__number">06</div>
                <h3 className="pain-card__title">Investor Reporting Lag</h3>
                <p className="pain-card__desc">Quarterly PDFs manually compiled from five sources, two days before the investor call. Every time.</p>
              </div>

            </div>

          </div>
        </section>

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

        {/* ── Mobile App Section ── */}
        <section className="mobile-app-section">
          <div className="mobile-app-section__inner">
            
            <div className="mobile-app-section__content">
              
              {/* Left Side - Content */}
              <div className="mobile-app-section__text">
                <p className="mobile-app-section__eyebrow">1iQ FIELD</p>
                <h2 className="mobile-app-section__title">Your GC's Team Logs Updates. You See Them Instantly.</h2>
                <p className="mobile-app-section__sub">Three taps on the mobile app: Start Task, Report Issue, End Task. That field data flows directly to your developer dashboard the moment it happens — no filtering, no delay, no consultant in the middle.</p>
                
                <div className="mobile-app-features">
                  
                  <div className="mobile-app-feature">
                    <div className="mobile-app-feature__icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                    </div>
                    <div className="mobile-app-feature__content">
                      <h4 className="mobile-app-feature__title">Live Progress Updates</h4>
                      <p className="mobile-app-feature__desc">Track completion percentage by trade, phase, and zone in real-time.</p>
                    </div>
                  </div>

                  <div className="mobile-app-feature">
                    <div className="mobile-app-feature__icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                    </div>
                    <div className="mobile-app-feature__content">
                      <h4 className="mobile-app-feature__title">Issue Escalation</h4>
                      <p className="mobile-app-feature__desc">Problems flagged on-site trigger immediate alerts to your dashboard.</p>
                    </div>
                  </div>

                  <div className="mobile-app-feature">
                    <div className="mobile-app-feature__icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div className="mobile-app-feature__content">
                      <h4 className="mobile-app-feature__title">Schedule Impact Analysis</h4>
                      <p className="mobile-app-feature__desc">Every field update automatically recalculates schedule and budget impact.</p>
                    </div>
                  </div>

                </div>

                <div className="mobile-app-section__cta">
                  <a href="/platform" className="mobile-app-cta-btn">
                    See 1iQ Field in Action
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>

              </div>

              {/* Right Side - Mobile App Mockup */}
              <div className="mobile-app-section__mockup">
                <div className="mobile-app-mockup-container">
                  <img 
                    src="/assets/img/mockups/mobile-app-mockup.png" 
                    alt="1iQ Field mobile app interface showing task tracking and issue reporting"
                    className="mobile-app-mockup-img"
                    loading="lazy"
                  />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── Social Proof/Validation Section ── */}
        <section className="validation-section">
          <div className="validation-section__inner">
            
            <div className="validation-section__header">
              <p className="validation-section__eyebrow">VALIDATED BY THE INDUSTRY</p>
              <h2 className="validation-section__title">Trusted by Developers Who Know Capital Risk.</h2>
            </div>

            <div className="validation-section__content">
              
              <div className="validation-stats">
                
                <div className="validation-stat">
                  <span className="validation-stat__number">$2.4B+</span>
                  <span className="validation-stat__label">Development Capital Protected</span>
                </div>

                <div className="validation-stat">
                  <span className="validation-stat__number">87%</span>
                  <span className="validation-stat__label">Overrun Detection Rate</span>
                </div>

                <div className="validation-stat">
                  <span className="validation-stat__number">14 Days</span>
                  <span className="validation-stat__label">Average Early Risk Identification</span>
                </div>

              </div>

              <div className="validation-testimonials">
                
                <div className="validation-testimonial">
                  <blockquote className="validation-testimonial__quote">
                    "1iQ caught a structural steel delay that would have pushed our delivery six weeks. We course-corrected in 48 hours instead of losing $800K to carrying costs."
                  </blockquote>
                  <cite className="validation-testimonial__attribution">
                    <span className="validation-testimonial__name">Principal</span>
                    <span className="validation-testimonial__company">$180M Mixed-Use Development</span>
                    <span className="validation-testimonial__location">Austin, TX</span>
                  </cite>
                </div>

                <div className="validation-testimonial">
                  <blockquote className="validation-testimonial__quote">
                    "The feasibility intelligence replaced our $120K consultant spend and gave us execution risk models no consultant has ever provided."
                  </blockquote>
                  <cite className="validation-testimonial__attribution">
                    <span className="validation-testimonial__name">Managing Partner</span>
                    <span className="validation-testimonial__company">Multifamily Development Fund</span>
                    <span className="validation-testimonial__location">Denver, CO</span>
                  </cite>
                </div>

              </div>

              <div className="validation-credentials">
                <div className="validation-credentials__item">
                  <h4 className="validation-credentials__title">Construction Industry Institute</h4>
                  <p className="validation-credentials__desc">Research Partnership: AI Risk Prediction in Construction</p>
                </div>
                <div className="validation-credentials__item">
                  <h4 className="validation-credentials__title">MIT Technology Review</h4>
                  <p className="validation-credentials__desc">Featured: "Construction's Intelligence Revolution"</p>
                </div>
                <div className="validation-credentials__item">
                  <h4 className="validation-credentials__title">Y Combinator S22</h4>
                  <p className="validation-credentials__desc">Graduate: Construction Intelligence Accelerator Program</p>
                </div>
              </div>

            </div>

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
