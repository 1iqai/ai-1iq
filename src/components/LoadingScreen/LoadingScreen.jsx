import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import './LoadingScreen.scss';

gsap.registerPlugin(CSSPlugin);

const LoadingScreen = () => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const dotsRef = useRef([]);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Add null checks for all refs
    if (!containerRef.current || !logoRef.current || !textRef.current || dotsRef.current.length === 0) {
      return;
    }

    const tl = gsap.timeline();

    // Initial state - set content elements to invisible/scaled down
    // but keep the container fully visible to block background
    gsap.set(logoRef.current, {
      opacity: 0,
      scale: 0.5,
      rotation: -10,
      filter: 'blur(10px)'
    });
    gsap.set(textRef.current, {
      opacity: 0,
      y: 20,
      filter: 'blur(5px)'
    });
    gsap.set(dotsRef.current, {
      opacity: 0,
      scale: 0,
      rotation: 180
    });

    // Entrance animations - no need to fade in container since it's already visible
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: "back.out(1.7)"
    })
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")
      .to(dotsRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.5)"
      }, "-=0.3");

    // Continuous dots animation
    const dotsTimeline = gsap.timeline({ repeat: -1 });
    dotsTimeline.to(dotsRef.current, {
      scale: 1.3,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.inOut"
    })
      .to(dotsRef.current, {
        scale: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.inOut"
      });

    // Exit animation after 2.5 seconds
    const exitTimer = setTimeout(() => {
      // Add null checks in timeout as well
      if (!dotsRef.current.length || !textRef.current || !logoRef.current || !containerRef.current) {
        return;
      }

      gsap.to(dotsRef.current, {
        opacity: 0,
        scale: 0,
        rotation: -180,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.in(1.5)"
      });

      gsap.to(textRef.current, {
        opacity: 0,
        y: -20,
        filter: 'blur(5px)',
        duration: 0.8,
        ease: "power3.in",
        delay: 0.1
      });

      gsap.to(logoRef.current, {
        opacity: 0,
        scale: 0.5,
        rotation: 10,
        filter: 'blur(10px)',
        duration: 1,
        ease: "back.in(1.7)",
        delay: 0.2
      });

      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        delay: 0.5,
        onComplete: () => {
          setShouldRender(false);
        }
      });
    }, 2500);

    return () => {
      clearTimeout(exitTimer);
      tl.kill();
      dotsTimeline.kill();
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div ref={containerRef} className="loading-screen">
      <div className="loading-content">
        <div className="logo-container">
          {/* <div ref={logoRef} className="logo">1iQ</div> */}
          <img
            src="/assets/1iQ-White.png"
            alt="1iQ Logo"
            ref={logoRef}
            className="logo  h-40 w-70"
            style={{
              transformOrigin: "center center", // Keep image centered for rotation

              // transition: "filter 0.3s ease",
            }}
          />
        </div>
        <div ref={textRef} className="loading-text">Loading intelligence...</div>
        <div className="loading-dots">
          <span ref={el => dotsRef.current[0] = el}></span>
          <span ref={el => dotsRef.current[1] = el}></span>
          <span ref={el => dotsRef.current[2] = el}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;