import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PortalButton from "../PortalButton/PortalButton";
import "./HeroSection.scss";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = ({ heroRef }) => {
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const blockRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(blockRef.current, {
        y: 28,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero"
    >
      {/* Video Background — autoPlay/playsInline required for mobile autoplay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        x-webkit-airplay="allow"
        className="hero__video"
      >
        <source src="/assets/Hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div ref={overlayRef} className="hero__overlay" />

      {/* Centered lower-hero content block */}
      <div className="hero__content">
        <div ref={blockRef} className="hero__block">



          {/* Main headline */}
          <h1 className="hero__title">Your Virtual Project Manager</h1>

          {/* Subheadline */}
          <p className="hero__sub">
            Eliminate manual tracking, follow-ups, and schedule coordination.
          </p>

          {/* CTA */}
          <PortalButton
            label="BOOK A DEMO"
            redirectTo="/schedule"
            className="hero-portal-btn"
          />

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <svg
          className="hero__scroll-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
