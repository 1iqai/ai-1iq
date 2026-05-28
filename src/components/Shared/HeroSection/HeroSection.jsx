import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import PortalButton from "../PortalButton/PortalButton";
import "./HeroSection.scss";

gsap.registerPlugin(ScrollTrigger);

const STAGGER = 0.02;
const cn = (...classes) => classes.filter(Boolean).join(" ");

const TextRoll = ({ children, className, center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative inline-block overflow-hidden", className)}
      style={{
        lineHeight: 1.1,
        paddingBottom: "0.08em",
      }}
    >
      <span className="block">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                ease: [0.16, 1, 0.3, 1],
                duration: 0.6,
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </span>
      <span className="absolute inset-0 block">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                ease: [0.16, 1, 0.3, 1],
                duration: 0.6,
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </span>
    </motion.span>
  );
};

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

      <div ref={overlayRef} className="hero__overlay" />

      <div className="hero__content">
        <div ref={blockRef} className="hero__block">

          <h1 className="hero__title">
            <span className="hero__title-line">
              {"Real-Time Intelligence".split(" ").map((word, i) => (
                <span key={i} className="inline-block" style={{ whiteSpace: "nowrap", marginRight: "0.26em" }}>
                  <TextRoll center>{word}</TextRoll>
                </span>
              ))}
            </span>
            <span className="hero__title-line hero__title-line--connector">
              {"for".split(" ").map((word, i) => (
                <span key={i} className="inline-block" style={{ whiteSpace: "nowrap", marginRight: "0.26em" }}>
                  <TextRoll center>{word}</TextRoll>
                </span>
              ))}
            </span>
            <span className="hero__title-line">
              {"Real Estate Development".split(" ").map((word, i) => (
                <span key={i} className="inline-block" style={{ whiteSpace: "nowrap", marginRight: "0.26em" }}>
                  <TextRoll center>{word}</TextRoll>
                </span>
              ))}
            </span>
          </h1>

          <p className="hero__sub">
            1iQ gives developers and investors live visibility into project risk, capital exposure, and execution performance, without depending on consultants or filtered reports.
          </p>

          <PortalButton
            label="RUN A FREE FEASIBILITY ANALYSIS"
            redirectTo="/schedule"
            className="hero-portal-btn"
          />

        </div>
      </div>

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
