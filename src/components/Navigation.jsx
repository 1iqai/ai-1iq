import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hamnav from "./Hamnav/Hamnav";
import "./Navigation.scss";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Navigation = ({ heroRef }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoOnBrightSection, setIsLogoOnBrightSection] = useState(false);
  const logoRef = useRef(null);
  const hoverInTweenRef = useRef(null);
  const hoverOutTweenRef = useRef(null);
  const isHoveringLogoRef = useRef(false);

  useEffect(() => {
    if (!logoRef.current || !heroRef?.current) return;
    // Set initial large logo
    gsap.set(logoRef.current, {
      scale: 1.5,
      transformOrigin: "top left"
    });

    // Animate scale down on scroll
    gsap.to(logoRef.current, {
      scale: 0.8, // Final small size
      ease: "power2.out",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "30% top",
        scrub: 0.8,
        onComplete: () => {
          // Keep the logo fixed at small size
          gsap.set(logoRef.current, {
            scale: 1.0,
            transformOrigin: "top left"
          });
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [heroRef]);

  useEffect(() => {
    const heroElement = heroRef?.current;
    if (!heroElement) {
      return;
    }

    const logoColorTrigger = ScrollTrigger.create({
      trigger: heroElement,
      start: "bottom top+=80",
      end: "+=1",
      onEnter: () => setIsLogoOnBrightSection(true),
      onLeaveBack: () => setIsLogoOnBrightSection(false),
    });

    return () => {
      logoColorTrigger.kill();
    };
  }, [heroRef]);

  useEffect(() => {
    return () => {
      hoverInTweenRef.current?.kill();
      hoverOutTweenRef.current?.kill();
    };
  }, []);

  // Resets the logo rotation after the hover animation completes.
  const resetLogoRotation = () => {
    if (!logoRef.current) {
      return;
    }

    hoverOutTweenRef.current?.kill();
    // Target the logo container inside the logoRef for rotation
    const logoContainer = logoRef.current.querySelector('.navigation__logo-container');
    hoverOutTweenRef.current = gsap.to(logoContainer, {
      rotationY: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        hoverOutTweenRef.current = null;
      },
    });
  };

  const handleLogoMouseEnter = () => {
    if (!logoRef.current) {
      return;
    }

    isHoveringLogoRef.current = true;

    hoverOutTweenRef.current?.kill();
    hoverOutTweenRef.current = null;

    if (hoverInTweenRef.current?.isActive()) {
      return;
    }

    hoverInTweenRef.current?.kill();

    // Target the logo container inside the logoRef for rotation
    const logoContainer = logoRef.current.querySelector('.navigation__logo-container');
    hoverInTweenRef.current = gsap.to(logoContainer, {
      rotationY: 180,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        hoverInTweenRef.current = null;
        if (!isHoveringLogoRef.current) {
          resetLogoRotation();
        }
      },
    });
  };

  const handleLogoMouseLeave = () => {
    isHoveringLogoRef.current = false;

    if (!hoverInTweenRef.current?.isActive()) {
      resetLogoRotation();
    }
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navigation fixed w-screen d-flex justify-between z-10">
      <div
        ref={logoRef}
        onMouseEnter={handleLogoMouseEnter}
        onMouseLeave={handleLogoMouseLeave}
        onClick={handleLogoClick}
        className="navigation__logo absolute top-5 left-10 cursor-pointer"
        style={{
          perspective: "1000px",
          transformOrigin: "top left"
        }}
      >
        <div className="navigation__logo-container relative h-12 md:h-24 lg:h-16" style={{ transformStyle: "preserve-3d" }}>
          {/* Placeholder image to maintain proper container width */}
          <img
            src="/assets/1iQ.png"
            alt=""
            className="h-full w-auto invisible"
            aria-hidden="true"
          />
          <img
            src="/assets/1iQ.png"
            alt="1iQ Logo"
            className="navigation__logo-image absolute inset-0 h-full w-auto"
            style={{
              opacity: isLogoOnBrightSection ? 1 : 0,
              transition: "opacity 0.8s ease",
            }}
          />
          <img
            src="/assets/1iQ-White.png"
            alt="1iQ Logo White"
            className="navigation__logo-image absolute inset-0 h-full w-auto"
            style={{
              opacity: isLogoOnBrightSection ? 0 : 1,
              transition: "opacity 0.8s ease",
            }}
          />
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div className="navigation__menu absolute top-5 right-4 md:right-10">
        {/* Hamburger Menu Button - Right */}
        {/* <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="navigation__menu-button text-white hover:text-gray-300 transition-colors focus:outline-none"
          aria-label="Menu"
        >
          <svg
            className="navigation__menu-icon w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button> */}

        <div className="navigation__actions">
          <div className="navigation__profile-icon" onClick={() => navigate('https://app.1iq.ai/')}>
            <img src="/assets/person-svgrepo-com.svg" alt="Profile" />
          </div>

          <button
            className="navigation__request-btn"
            onClick={() => navigate('/schedule')}
          >
            Request a Demo
          </button>

          <Hamnav />
        </div>
      </div>
      {/* Side Menu Component */}
      {/* <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} /> */}
    </nav>
  );
};

export default Navigation;
