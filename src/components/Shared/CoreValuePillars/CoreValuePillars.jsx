import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CoreValuePillars.scss';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    title: 'Schedules That Update Themselves',
    summary: 'When something changes on site, 1iQ updates the schedule automatically. 332 hours of manual entry, returned.'
  },
  {
    title: 'Reports That Write Themselves',
    summary: '1iQ reads every dashboard and writes the weekly summary automatically. 182 hours of reporting time, returned.'
  },
  {
    title: 'Every Answer. Already There.',
    summary: '1iQ has read every document, email, and log on the project. Stop hunting. Just ask.'
  }
];

const CoreValuePillars = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const slidesWrapperRef = useRef(null);
  const slidesRef = useRef([]);
  const progressRef = useRef(null);
  const activeSlideRef = useRef(0);
  const formattedPillarCount = String(pillars.length).padStart(2, '0');

  const updateSlideWrapperHeight = (precomputedSlides) => {
    const slides = precomputedSlides ?? slidesRef.current.filter(Boolean);
    if (!slides.length || !slidesWrapperRef.current) return;

    const tallestSlide = slides.reduce((max, slide) => Math.max(max, slide.scrollHeight), 0);
    slidesWrapperRef.current.style.height = `${tallestSlide}px`;
  };

  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    const raf = isBrowser ? window.requestAnimationFrame : (cb) => cb();

    const handleResize = () => {
      raf(() => updateSlideWrapperHeight());
    };

    updateSlideWrapperHeight();

    if (isBrowser) {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }

    return undefined;
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const slides = slidesRef.current.filter(Boolean);
      if (!slides.length || !sectionRef.current) return;

      updateSlideWrapperHeight(slides);

      gsap.from(titleRef.current, {
        opacity: 0,
        y: 32,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      gsap.set(slides, { autoAlpha: 0, y: 30 });
      gsap.set(slides[0], { autoAlpha: 1, y: 0 });
      if (progressRef.current) {
        const isMobile = window.innerWidth < 640;
        const property = isMobile ? 'width' : 'height';
        gsap.set(progressRef.current, { [property]: '0%' });
      }
      activeSlideRef.current = 0;

      const getScrollDistance = () => {
        const baseHeight = slidesWrapperRef.current
          ? slidesWrapperRef.current.offsetHeight
          : window.innerHeight * 0.6;
        return baseHeight * Math.max(slides.length - 1, 1);
      };

      const totalSteps = Math.max(slides.length - 1, 1);

      const animateToSlide = (nextIndex) => {
        const currentIndex = activeSlideRef.current;
        if (nextIndex === currentIndex) return;

        const direction = nextIndex > currentIndex ? 1 : -1;
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[nextIndex];
        if (!currentSlide || !nextSlide) return;

        gsap.killTweensOf([currentSlide, nextSlide]);

        const tl = gsap.timeline();
        tl.to(currentSlide, {
          autoAlpha: 0,
          y: -30 * direction,
          duration: 0.35,
          ease: 'power2.out'
        }).fromTo(
          nextSlide,
          { autoAlpha: 0, y: 40 * direction },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out'
          },
          0
        );

        activeSlideRef.current = nextIndex;
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        anticipatePin: 1,
        scrub: false,
        onUpdate: (self) => {
          const rawProgress = self.progress;

          if (progressRef.current) {
            const isMobile = window.innerWidth < 640;
            const property = isMobile ? 'width' : 'height';

            gsap.to(progressRef.current, {
              [property]: `${rawProgress * 100}%`,
              duration: 0.12,
              ease: 'power1.out'
            });
          }

          if (slides.length <= 1) return;

          const nextIndex = Math.min(
            slides.length - 1,
            Math.max(0, Math.round(rawProgress * totalSteps))
          );

          if (nextIndex !== activeSlideRef.current) {
            animateToSlide(nextIndex);
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="core-pillars relative">
      <div className="core-pillars__container max-w-6xl mx-auto px-6 md:px-10 flex flex-col gap-12 mt-12 md:mt-3">
        <div ref={titleRef} className="core-pillars__header flex flex-col gap-4 md:gap-6">
          <h2 className="core-pillars__title text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">
            How 1iQ Gives the Time Back
          </h2>
          <p className="core-pillars__subtitle text-lg md:text-xl text-neutral-600 font-normal max-w-xl">
            Three things every development team spends too much time on. Three things 1iQ handles automatically.
          </p>
        </div>

        <div className="core-pillars__content flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="core-pillars__meta md:w-1/4">
            <div className="core-pillars__counter text-sm uppercase tracking-widest text-neutral-500 mb-6">
              {formattedPillarCount} pillars
            </div>
            <div className="core-pillars__progress relative h-32 md:h-48 w-1 bg-neutral-800/10">
              <span ref={progressRef} className="core-pillars__progress-bar absolute bottom-0 left-0 w-full h-full bg-black" />
            </div>
          </div>
          <div className="core-pillars__slides relative flex-1" ref={slidesWrapperRef}>
            {pillars.map((pillar, index) => (
              <article
                key={pillar.title}
                ref={(el) => {
                  slidesRef.current[index] = el;
                }}
                className="core-pillars__slide pillar-slide bg-white"
              >
                <div className="flex flex-col h-full">
                  <p className="pillar-slide__label text-sm uppercase tracking-[0.2em] text-neutral-500 mb-4 md:mb-6">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="pillar-slide__title text-xl md:text-2xl lg:text-3xl font-semibold text-black mb-3 md:mb-4">
                    {pillar.title}
                  </h3>
                  <p className="pillar-slide__summary text-sm md:text-base lg:text-lg text-neutral-700 mb-6 md:mb-8">
                    {pillar.summary}
                  </p>

                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValuePillars;
