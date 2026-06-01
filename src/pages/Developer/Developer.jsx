import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Shared/Footer/Footer";
import ROICalculator from "../../components/ROICalculator";
import PortalButton from "../../components/Shared/PortalButton/PortalButton";
import "./Developer.scss";

gsap.registerPlugin(ScrollTrigger);

const Developer = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const pageRef = useRef(null);

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
    <div ref={pageRef} className="app relative w-full overflow-x-hidden">
      <Navigation heroRef={heroRef} />

      {/* ── Hero Section with Video Background ── */}
      <section ref={heroRef} className="developer-hero">
        <div className="developer-hero__bg" aria-hidden="true" />
        
        {/* Video Background */}
        <video 
          className="developer-hero__video"
          src="/assets/video/1iq_hero_video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Overlay */}
        <div className="developer-hero__overlay" />

        <div className="developer-hero__content">
          <div className="developer-hero__inner">
            <h1 className="developer-hero__title">
              You're Committing $30M to a Project. What Are You Actually Seeing?
            </h1>
            <p className="developer-hero__sub">
              If your answer involves a consultant's weekly update or a GC's PDF report — 1iQ was built to change that.
            </p>
            <div className="developer-hero__cta">
              <PortalButton
                label="See 1iQ on a Real Project"
                redirectTo="/schedule"
                className="developer-hero-btn"
                showDivider={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem Section ── */}
      <section className="developer-problem">
        <div className="developer-problem__inner">
          
          <div className="developer-problem__statements">
            
            <div className="problem-statement">
              <h2 className="problem-statement__text">
                The information you're making decisions on is 2-4 weeks old.
              </h2>
            </div>

            <div className="problem-statement">
              <h2 className="problem-statement__text">
                The consultant between you and ground truth costs $180K-$300K a year.
              </h2>
            </div>

            <div className="problem-statement">
              <h2 className="problem-statement__text">
                Average mid-market development overruns: 20-30%. That is a visibility problem, not fate.
              </h2>
            </div>

          </div>

        </div>
      </section>

      {/* ── Three Intelligence Layers Section ── */}
      <section className="intelligence-layers" data-nav-theme="bright">
        <div className="intelligence-layers__inner">
          
          <div className="intelligence-layers__header">
            <h2 className="intelligence-layers__title">Three Intelligence Layers</h2>
            <p className="intelligence-layers__sub">1iQ operates across the entire development lifecycle — from pre-development feasibility through investor reporting.</p>
          </div>

          <div className="intelligence-layers__grid">
            
            <div className="intelligence-layer">
              <div className="intelligence-layer__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 9h6v6H9z"/>
                  <path d="M9 1v6M15 1v6M9 17v6M15 17v6M1 9h6M17 9h6M1 15h6M17 15h6"/>
                </svg>
              </div>
              <h3 className="intelligence-layer__title">Pre-Development Feasibility</h3>
              <p className="intelligence-layer__desc">Generate execution risk models and schedule projections from minimal project inputs. Replace $50K-$200K in consultant feasibility fees with AI-generated intelligence in hours.</p>
            </div>

            <div className="intelligence-layer">
              <div className="intelligence-layer__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <h3 className="intelligence-layer__title">Active Execution Oversight</h3>
              <p className="intelligence-layer__desc">Direct connection between field operations and your developer dashboard. Your GC's team logs updates through 1iQ mobile, giving you real-time visibility without consultant filters.</p>
            </div>

            <div className="intelligence-layer">
              <div className="intelligence-layer__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3 className="intelligence-layer__title">Investor-Grade Reporting</h3>
              <p className="intelligence-layer__desc">Automated quarterly reporting from live project data. Replace manual compilation with on-demand intelligence that protects capital relationships and demonstrates execution certainty.</p>
            </div>

          </div>

        </div>
      </section>

      {/* ── ROI Calculator Section ── */}
      <section className="developer-roi" data-nav-theme="bright">
        <div className="developer-roi__inner">
          <div className="developer-roi__header">
            <h2 className="developer-roi__title">What Is Your Capital Exposure on This Project?</h2>
            <p className="developer-roi__sub">Calculate the cost of visibility gaps on your active development projects.</p>
          </div>
        </div>
      </section>
      
      <ROICalculator />

      {/* ── Pricing Section ── */}
      <section className="developer-pricing" data-nav-theme="bright">
        <div className="developer-pricing__inner">
          
          <div className="developer-pricing__header">
            <h2 className="developer-pricing__title">Transparent Pricing. Aligned with Your Capital.</h2>
            <p className="developer-pricing__sub">1iQ pricing scales with project size and complexity. No hidden fees, no per-seat charges, no consultant markups.</p>
          </div>

          <div className="developer-pricing__grid">
            
            <div className="pricing-tier">
              <div className="pricing-tier__header">
                <h3 className="pricing-tier__name">Feasibility Intelligence</h3>
                <p className="pricing-tier__desc">Pre-development risk modeling and schedule analysis</p>
              </div>
              <div className="pricing-tier__price">
                <span className="pricing-tier__amount">From $1,500</span>
                <span className="pricing-tier__unit">Credit/token based</span>
              </div>
              <div className="pricing-tier__features">
                <div className="pricing-feature">AI schedule generation</div>
                <div className="pricing-feature">Execution risk modeling</div>
                <div className="pricing-feature">Capital exposure analysis</div>
                <div className="pricing-feature">Market-specific variables</div>
              </div>
            </div>

            <div className="pricing-tier pricing-tier--highlighted">
              <div className="pricing-tier__badge">Most Popular</div>
              <div className="pricing-tier__header">
                <h3 className="pricing-tier__name">Active Project Intelligence</h3>
                <p className="pricing-tier__desc">Full platform access for active development projects</p>
              </div>
              <div className="pricing-tier__price">
                <span className="pricing-tier__amount">2.5%</span>
                <span className="pricing-tier__unit">of project budget</span>
              </div>
              <div className="pricing-tier__note">Capped at $1.25M for projects above $50M</div>
              <div className="pricing-tier__features">
                <div className="pricing-feature">Live field-to-dashboard intelligence</div>
                <div className="pricing-feature">Predictive risk analysis</div>
                <div className="pricing-feature">Automated investor reporting</div>
                <div className="pricing-feature">GC mandate integration</div>
                <div className="pricing-feature">24/7 platform access</div>
              </div>
            </div>

            <div className="pricing-tier">
              <div className="pricing-tier__header">
                <h3 className="pricing-tier__name">Portfolio Retainer</h3>
                <p className="pricing-tier__desc">Custom pricing for 3+ simultaneous projects</p>
              </div>
              <div className="pricing-tier__price">
                <span className="pricing-tier__amount">Custom</span>
                <span className="pricing-tier__unit">Contact for pricing</span>
              </div>
              <div className="pricing-tier__features">
                <div className="pricing-feature">Multi-project dashboard</div>
                <div className="pricing-feature">Portfolio risk analytics</div>
                <div className="pricing-feature">Consolidated reporting</div>
                <div className="pricing-feature">Dedicated account management</div>
                <div className="pricing-feature">Custom integrations</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── Final CTA Section ── */}
      <section className="developer-cta">
        <div className="developer-cta__inner">
          
          <div className="developer-cta__content">
            <h2 className="developer-cta__title">Book Your 30-Minute Development Intelligence Briefing</h2>
            <p className="developer-cta__sub">See 1iQ running on a real development project. Built around your asset class and capital challenge.</p>
            
            <div className="developer-cta__button">
              <PortalButton
                label="Schedule Your Briefing"
                redirectTo="/schedule"
                className="developer-cta-btn"
                showDivider={false}
              />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Developer;