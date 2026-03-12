import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Hamnav.scss";
import { FiCodesandbox, FiLayers, FiMap, FiShield, FiArrowUpRight } from "react-icons/fi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";

const Hamnav = () => {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    setActive(!active);
  };

  const handleLogoClick = (e) => {
    e.stopPropagation();
    setActive(false);
    if (location.pathname === '/') {
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
      // Small timeout to ensure navigation happens before scroll if needed, 
      // but usually instant scroll is fine. 
      // For Lenis, we might need to wait for mount? 
      // Actually, if we navigate, the new page mounts and ScrollToTop component handles it?
      // But ScrollToTop uses window.scrollTo(0,0).
      // We should update ScrollToTop as well if we want it to work with Lenis.
      // For now, let's just try to scroll.
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  const handleNavigation = (path, sectionId) => {
    setActive(false);

    if (sectionId) {
      const sectionHashPath = `${path}#${sectionId}`;
      const shouldReplace = location.pathname === path && location.hash === `#${sectionId}`;
      navigate(sectionHashPath, { replace: shouldReplace });
      requestAnimationFrame(() => {
        const target = document.getElementById(sectionId);
        if (!target) {
          return;
        }

        if (window.lenis) {
          window.lenis.scrollTo(target);
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      return;
    }

    navigate(path);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <div className={`hamnav-blur ${active ? "active" : ""}`} onClick={handleClick}></div>
      <div className={`hamnav cursor-pointer ${active ? "active" : ""}`} onClick={handleClick}>
        <div className="company-name" onClick={handleLogoClick}>
          <span>1iQ</span>
        </div>
        <div className="toggle">
          <button id="nav-toggle">
            <span></span>
            {/* <span></span>
          <span></span> */}
          </button>
        </div>
      </div>
      <div className={`menu-overlay ${active ? "active" : ""}`} id="menu-overlay">
        <div className="menu-container">
          {/* Left Column */}
          <div className="menu-links">
            <div className="section-title">
              <h4>Navigation</h4>
            </div>
            <div className="nav-links-vertical">
              <a
                className={`main-link ${location.pathname === '/' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}
              >
                Home
              </a>
              <a
                className="main-link portal-link"
                href="https://app.1iq.ai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActive(false)}
              >
                1iQ Client Portal <GoArrowRight className="UpRightArrow" />
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div className="menu-links-wide">
            <div className="section-title">
              <h4>Our Businesses</h4>
            </div>

            <div className="business-block cursor-pointer" onClick={() => handleNavigation('/platform')}>
              <div className="business-icon border-black border-2 bg-white rounded-lg">
                <FiLayers size={22} className="text-black" />
              </div>
              <div className="business-info">
                <h3>1iQ Platform</h3>
                <p>Project Intelligence | Operational Orchestration</p>
              </div>
              <div className="business-arrow">
                <GoArrowRight />
              </div>
            </div>

            <div className="nav-links-vertical secondary-links">
              <a
                className={`main-link ${location.pathname === '/get-started' || location.pathname === '/schedule' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); handleNavigation('/schedule'); }}
              >
                Get Started
              </a>
              <a
                className={`main-link ${location.pathname === '/learn-more' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); handleNavigation('/learn-more'); }}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hamnav;
