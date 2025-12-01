import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./IndustriesBanner.scss";

const INDUSTRIES = [
  "Commercial Construction",
  "Industrial & Infrastructure",
  "Real Estate Development",
  "Public Sector & Smart Cities",
  "Healthcare Facilities",
  "Energy & Utilities",
  "Transportation & Rail", 
  "Data Centers & Tech Campuses",
];



gsap.registerPlugin(ScrollTrigger);

const IndustriesBanner = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const labelRef = useRef(null);
  const trackRef = useRef(null);
  const marqueeTween = useRef(null);
  const repeatedIndustries = useMemo(
    () => [...INDUSTRIES, ...INDUSTRIES],
    []
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return undefined;
    }

    const createMarquee = () => {
      const loopWidth = track.scrollWidth / 2;
      if (!loopWidth) {
        return;
      }

      gsap.set(track, { x: -loopWidth });

      marqueeTween.current = gsap.to(track, {
        x: 0,
        duration: 34,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (value) => {
            const numericValue = parseFloat(value);
            if (Number.isNaN(numericValue)) {
              return value;
            }

            if (numericValue >= 0) {
              return `${numericValue - loopWidth}px`;
            }

            return `${numericValue}px`;
          },
        },
      });
    };

    createMarquee();

    const handleResize = () => {
      marqueeTween.current?.kill();
      createMarquee();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      marqueeTween.current?.kill();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.from(innerRef.current, {
        y: 60,
        autoAlpha: 0,
        duration: 1.2,
      })
        .from(
          labelRef.current,
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.8,
          },
          "-=0.9"
        )
        .from(
          trackRef.current,
          {
            y: 24,
            autoAlpha: 0,
            duration: 1,
          },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="industries-banner">
      <div ref={innerRef} className="industries-banner__inner">
        <span ref={labelRef} className="industries-banner__label">Industries Served</span>
        <div className="industries-banner__viewport">
          <div className="industries-banner__track" ref={trackRef}>
            {repeatedIndustries.map((industry, index) => (
              <div className="industries-banner__item" key={`${industry}-${index}`}>
                <span className="industries-banner__text">{industry}</span>
                <span className="industries-banner__separator" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesBanner;
