import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PortalButton from "../PortalButton/PortalButton";
import "./HeroSection.scss";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const HeroSection = ({ heroRef }) => {
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Create GSAP context for proper cleanup
    const ctx = gsap.context(() => {
    }, heroRef);

    // Cleanup function
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hero__video absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/assets/Hero.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for text readability */}
      <div ref={overlayRef} className="hero__overlay absolute inset-0 bg-black/50" />

      {/* Hero Content - Brutalist Typography */}
      <div
        ref={contentRef}
        className="hero__content relative h-full flex flex-col justify-between px-8 py-8"
      >
        {/* Left Side Content - Bottom Left */}
        <div className="hero__spacer flex-1" />

        <div className="hero__subtitle-container grid grid-cols-1 lg:grid-cols-2 gap-8 mb-0">
          {/* Left Column - Subtitle */}
          <div className="hero__subtitle space-y-4">
            <p className="hero__subtitle-label text-white text-xs lg:text-sm font-medium tracking-wide uppercase">
              AN AI ENGINE FOR HIGH-PERFORMANCE MANAGEMENT
            </p>
            <p className="hero__subtitle-text text-white/70 text-xs lg:text-sm leading-relaxed max-w-lg">
              Project managers burn 1,220 hours a year—almost 60% of their time—on admin and paperwork.
              1iQ reclaims that time. Our AI automates scheduling, reporting, and analysis, returning 831 hours
              to every PM, every year. Stop drowning in paperwork. Start building.
            </p>
            <div className="pt-4">
              <PortalButton
                label="REQUEST A DEMO"
                outline={true}
                showDivider={false}
                redirectTo="/schedule"
              />
            </div>
          </div>

          {/* Right Column - Empty for balance */}
          <div />
        </div>

        {/* Center - Main Heading with horizontal line */}
        <div className="hero__heading-container absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-8">
          <div className="hero__heading-line h-px w-full bg-white/40 mb-5" />
          <div className="hero__heading-content flex flex-col items-center justify-center space-y-6">
            {/* Massive Hero Headline */}
            <h1 className="hero__title font-sans text-4xl md:text-6xl lg:text-[4.8rem] font-black text-white leading-[1.1] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-10">
              A New Generation Of Intelligence
              <br />
              <span className="hero__title-line flex flex-col md:flex-row items-center justify-center md:items-baseline gap-2 md:gap-4 mt-2 md:mt-4 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]">
                <span className="text-4xl md:text-6xl lg:text-[3.9rem] text-blue-400">Real-Time Management</span>
                <span className="text-xl md:text-2xl lg:text-[1.3rem] text-blue-400">Powered by AI</span>
              </span>
            </h1>

            <PortalButton
              label="DEMO"
              className="hero__cta-button"
              redirectTo="/schedule"
              showDivider={false}
            />
          </div>

        </div>
      </div>

      {/* Scroll Indicator - Bottom Center */}
      <div className="hero__scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="hero__scroll-container flex flex-col items-center space-y-2">
          <div className="hero__scroll-line hidden lg:block w-px h-12 bg-white/30" />
          <svg
            className="hero__scroll-icon w-4 h-4 text-white/60 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
