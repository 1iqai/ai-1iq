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
          <div className="menu-links">
            <div className="section-title">
              <h4>Navigation</h4>
            </div>
            <div className="link-animation-one">
              <a
                className={`link ${location.pathname === '/' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}
              >
                <span>Home</span>
                <span>Home</span>
              </a>
              <a className="link outside-link" href="https://app.1iq.ai" target="_blank" rel="noopener noreferrer" onClick={() => setActive(false)}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  1iQ Client Portal <GoArrowRight className="UpRightArrow" />
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  1iQ Client Portal <GoArrowRight className="UpRightArrow" />
                </span>
              </a>
            </div>

          </div>
          <div className="menu-links-wide">
            <div className="section-title">
              <h4>Our Businesses</h4>
            </div>
            <div className="wide-link-wrapper">
              <div className="wide-item cursor-pointer" onClick={() => handleNavigation('/platform')}>
                <div>
                  <FiLayers size={52} className="icon" />
                </div>
                <div className="title">
                  <p>1iQ Platform</p>
                </div>
                <div className="wide-description">
                  <p>Project Intelligence | Operational Orchestration</p>
                </div>
                <div>
                  <IoIosArrowRoundForward className="right-icon" />
                </div>
              </div>
            </div>

            <div className="link-animation-two" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
              <a
                className={`link ${location.pathname === '/get-started' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); handleNavigation('/get-started'); }}
              >
                <span>Get Started</span>
                <span>Get Started</span>
              </a>
              <a
                className={`link ${location.pathname === '/learn-more' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); handleNavigation('/learn-more'); }}
              >
                <span>Learn More</span>
                <span>Learn More</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hamnav;
