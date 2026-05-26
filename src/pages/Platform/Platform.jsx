import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import PlatformSlider from "../../components/PlatformSlider";
import PortalButton from "../../components/Shared/PortalButton/PortalButton";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Platform = () => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const location = useLocation();
  const lastScrollSignatureRef = useRef("");



  useEffect(() => {
    const stateTarget = location.state && location.state.scrollTo ? String(location.state.scrollTo) : "";
    const hashTarget = location.hash ? location.hash.substring(1) : "";
    const targetId = stateTarget || hashTarget;

    if (!targetId) {
      return;
    }

    const locationKey = location.key || "default";
    const signature = `${locationKey}-${targetId}`;

    if (lastScrollSignatureRef.current === signature) {
      return;
    }

    const attemptScroll = () => {
      const element = document.getElementById(targetId);
      if (!element) {
        return false;
      }

      if (window.lenis) {
        window.lenis.scrollTo(element);
      } else {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      lastScrollSignatureRef.current = signature;
      return true;
    };

    if (attemptScroll()) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const retryInterval = setInterval(() => {
      attempts += 1;
      if (attemptScroll() || attempts >= maxAttempts) {
        clearInterval(retryInterval);
      }
    }, 150);

    return () => clearInterval(retryInterval);
  }, [location]);

  return (
    <div ref={pageRef} className="app relative w-full overflow-x-hidden">
      {/* Navigation Component */}
      <Navigation heroRef={heroRef} />

      {/* Common Header Section - Black Background */}
      <CommonHeader
        ref={heroRef}
        title="Development Intelligence Platform"
      />

      {/* Hero Section - Dark dot grid background */}
      <section id="hero" className="hero__section relative w-full bg-[#070707] text-white pt-10 pb-6 md:pt-14 md:pb-10 bg-dot-grid">
        <div className="container mx-auto px-6 md:px-12">
          <div className="hero__content max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-4 text-center font-space-grotesk">
              The Operating Intelligence Your Development Business Needs.
            </h2>
            <p className="hero__description text-center text-neutral-400 text-xl md:text-2xl leading-relaxed font-light mb-6 w-full mt-0 md:mt-2 max-w-3xl">
              Real estate developers manage multi-million dollar projects with fragmented information, weeks-old reports, and consultant filters. 1iQ is the intelligence platform that connects your field operations to your capital decisions in real-time.
            </p>

            <div className="flex justify-center mt-4 mb-6">
              <PortalButton
                label="Schedule Intelligence Demo"
                redirectTo="/schedule"
                className="hero-portal-btn"
                showDivider={false}
              />
            </div>

            {/* Hero Image */}
            {/* <div className="hero__image mt-16">
              <div className="border-2 border-black rounded-lg overflow-hidden">
                <video
                  src="/assets/video/intel_1.mp4"
                  alt="1iQ Intelligence Platform"
                  className="w-full h-auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* ── Integration Architecture Section ── */}
      <section className="integration-section" style={{ padding: "120px 24px", background: "#070707" }}>
        <div className="integration-section__inner" style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <img 
            src="/platform-integration.png" 
            alt="Platform Integration: Connects to Your Existing Workflow" 
            style={{ width: "100%", height: "auto", borderRadius: "16px", boxShadow: "0 4px 40px rgba(0,0,0,0.4)" }} 
          />
        </div>
      </section>

      <PlatformSlider />



      {/* ── Developer ROI Section ── */}
      <section className="developer-roi">
        <div className="developer-roi__inner">

          <div className="developer-roi__header">
            <p className="developer-roi__eyebrow">PLATFORM ROI</p>
            <h2 className="developer-roi__title">Capital Protection That Pays for Itself</h2>
            <p className="developer-roi__subtitle">1iQ delivers measurable returns through risk reduction, time savings, and consultant cost elimination.</p>
          </div>

          <div className="roi-grid">

            {/* ROI Card 1 */}
            <div className="roi-card">
              <div className="roi-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <h3 className="roi-card__title">Overrun Protection</h3>
              <p className="roi-card__value">$4M - $6M</p>
              <p className="roi-card__desc">Average overrun exposure protected per $20M project through early risk identification.</p>
            </div>

            {/* ROI Card 2 */}
            <div className="roi-card">
              <div className="roi-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 9h6v6H9z"/>
                  <path d="M9 1v6M15 1v6M9 17v6M15 17v6M1 9h6M17 9h6M1 15h6M17 15h6"/>
                </svg>
              </div>
              <h3 className="roi-card__title">Feasibility Intelligence</h3>
              <p className="roi-card__value">$50K - $200K</p>
              <p className="roi-card__desc">Traditional consultant feasibility costs eliminated through AI-generated analysis.</p>
            </div>

            {/* ROI Card 3 */}
            <div className="roi-card">
              <div className="roi-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <path d="M20 8v6M23 11h-6"/>
                </svg>
              </div>
              <h3 className="roi-card__title">Owner's Rep Elimination</h3>
              <p className="roi-card__value">$300K/year</p>
              <p className="roi-card__desc">Direct field visibility eliminates need for $10K-$25K/month owner's representative fees.</p>
            </div>

            {/* ROI Card 4 */}
            <div className="roi-card">
              <div className="roi-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3 className="roi-card__title">Investor Reporting</h3>
              <p className="roi-card__value">$100K/year</p>
              <p className="roi-card__desc">Internal labor savings from automated quarterly reporting and on-demand investor updates.</p>
            </div>

          </div>

          <div className="developer-roi__summary">
            <div className="roi-summary__calculation">
              <div className="roi-calc-item">
                <span className="roi-calc-label">1iQ Platform Cost (20M Project):</span>
                <span className="roi-calc-value">$500K</span>
              </div>
              <div className="roi-calc-item">
                <span className="roi-calc-label">Minimum Value Protection:</span>
                <span className="roi-calc-value">$1M+</span>
              </div>
              <div className="roi-calc-item roi-calc-item--result">
                <span className="roi-calc-label">Net ROI Minimum:</span>
                <span className="roi-calc-value">2x+</span>
              </div>
            </div>
            <p className="roi-summary__note">
              Based on single avoided overrun event. Calculations derived from McKinsey, FMI, and Construction Industry Institute research.
            </p>
          </div>

        </div>
      </section>

      {/* ── Final CTA Section ── */}
      <section className="platform-cta">
        <div className="platform-cta__inner">
          
          <div className="platform-cta__content">
            <p className="platform-cta__eyebrow">START PROTECTING YOUR CAPITAL</p>
            <h2 className="platform-cta__title">See 1iQ Intelligence in Action</h2>
            <p className="platform-cta__description">
              Schedule a live demo with real project data. Our team will show you exactly how 1iQ transforms fragmented information into intelligence that protects your capital.
            </p>
            
            <div className="platform-cta__buttons">
              <PortalButton
                label="Schedule Live Demo"
                redirectTo="/schedule"
                className="platform-cta-primary"
                showDivider={false}
              />
              <a href="/schedule" className="platform-cta__secondary">
                Download Platform Overview
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="platform-cta__stats">
            <div className="cta-stat">
              <span className="cta-stat__number">$2.4B+</span>
              <span className="cta-stat__label">Development Capital Protected</span>
            </div>
            <div className="cta-stat">
              <span className="cta-stat__number">87%</span>
              <span className="cta-stat__label">Risk Detection Accuracy</span>
            </div>
            <div className="cta-stat">
              <span className="cta-stat__number">2x+</span>
              <span className="cta-stat__label">ROI on Single Avoided Overrun</span>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Platform;
