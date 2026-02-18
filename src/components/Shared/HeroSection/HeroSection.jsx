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
              The AI Engine for High-Performance Construction
            </p>
            <p className="hero__subtitle-text text-white/70 text-xs lg:text-sm leading-relaxed max-w-lg">
              1iQ transforms the way teams build by turning every jobsite action into live intelligence.
              With passive data flow, predictive insights, and real-time transparency, 1iQ connects the field
              to the boardroom and gives your entire organization the leverage to build faster, smarter, and
              with total confidence.
            </p>
          </div>

          {/* Right Column - Empty for balance */}
          <div />
        </div>

        {/* Center - Main Heading with horizontal line */}
        <div className="hero__heading-container absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-8">
          <div className="hero__heading-line h-px w-full bg-white/40 mb-5" />
          <div className="hero__heading-content flex flex-col items-center justify-center space-y-6">
            {/* Full-width horizontal line above heading */}
            <h2 className="hero__title text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-white leading-none tracking-tight">
              Where Intelligence
              <br />
              <span className="hero__title-line block mt-2">Builds Tomorrow</span>
            </h2>

            <PortalButton
              label="Speak to Team"
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
