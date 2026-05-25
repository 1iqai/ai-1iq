import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeedbackSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const slidesRef = useRef([]);
  const progressRef = useRef(null);
  const activeSlideRef = useRef(0);

  // Sample testimonials data
  const testimonials = [
    {
      quote: "We manage dozens of activations across the country at any given time. With 1iQ, we finally have a scheduling and tasking system that keeps our entire operations team synced in real time. What used to take hours to coordinate now takes minutes—and we've never had this level of visibility before.",
      author: "Marcus Chen",
      role: "Operations Director",
      company: "Red Bull North America"
    },
    {
      quote: "1iQ completely transformed how we manage field operations. It replaced three platforms and our manual Excel process overnight. We now have real-time updates from job sites, instant schedule adjustments, and a live dashboard that keeps us on top of costs and crews. This is the future of construction coordination.",
      author: "David Mitchell",
      role: "Development Manager",
      company: "Halifax Construction & Development"
    },
    {
      quote: "As a fast-growing company, staying organized was starting to feel impossible. 1iQ gave us a system that scales with us. We've cut reporting time in half, caught issues before they became costly, and improved visibility across all projects. Most importantly—it's directly contributed to increased revenue and better client confidence.",
      author: "Jennifer Williams",
      role: "CEO",
      company: "JTW Services Inc"
    },
    {
      quote: "For a fleet-based business, timing is everything. 1iQ helped us streamline dispatching, track every service in real time, and reduce idle hours. Our team runs smoother, and our clients notice the difference. It's like having a real-time operations manager in your pocket.",
      author: "Robert Taylor",
      role: "Fleet Manager",
      company: "Drew's Limo Services"
    },
    {
      quote: "Our projects span rural and urban communities—and communication used to be a challenge. With 1iQ, our teams now operate with full transparency. From resource allocation to task tracking, everything runs smoother. It's helped us stay accountable and scale impact without adding admin overhead.",
      author: "Sarah Anderson",
      role: "Program Director",
      company: "The Watering Hope Foundation"
    }
  ];
  const formattedVoiceCount = String(testimonials.length).padStart(2, '0');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const slides = slidesRef.current.filter(Boolean);
      if (!slides.length || !sectionRef.current) return;

      gsap.from(titleRef.current, {
        opacity: 0,
        y: 32,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.set(slides, { autoAlpha: 0, y: 30 });
      gsap.set(slides[0], { autoAlpha: 1, y: 0 });
      if (progressRef.current) {
        gsap.set(progressRef.current, { height: '0%' });
      }
      activeSlideRef.current = 0;

      const getScrollDistance = () => {
        const distancePerSlide = window.innerHeight * 0.55;
        return distancePerSlide * Math.max(slides.length - 1, 1);
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
          ease: 'power2.out',
        }).fromTo(
          nextSlide,
          { autoAlpha: 0, y: 40 * direction },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
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
            gsap.to(progressRef.current, {
              height: `${rawProgress * 100}%`,
              duration: 0.12,
              ease: 'power1.out',
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
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="feedback-section relative">
      <div className="feedback-section__container max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28 flex flex-col gap-16">
        <div ref={titleRef} className="feedback-section__header flex flex-col gap-6">
          <p className="feedback-section__eyebrow uppercase tracking-[0.3em] text-xs text-neutral-500">
            Feedback Pulse
          </p>
          <h2 className="feedback-section__title text-3xl md:text-4xl lg:text-5xl font-semibold text-black leading-tight">
            Trusted by industry leaders to keep ambitious builds on track.
          </h2>
          <p className="feedback-section__subtitle text-base text-neutral-600 max-w-xl">
            Scroll gently to cycle through live feedback pulled from our most demanding partners.
          </p>
        </div>

        <div className="feedback-section__content flex flex-col md:flex-row gap-12">
          <div className="feedback-section__meta md:w-1/4">
            <div className="feedback-section__counter text-sm uppercase tracking-widest text-neutral-500 mb-6">
              {formattedVoiceCount} voices
            </div>
            <div className="feedback-section__progress relative h-48 w-1 bg-neutral-800/10">
              <span ref={progressRef} className="feedback-section__progress-bar absolute bottom-0 left-0 w-full bg-black"></span>
            </div>
          </div>
          <div className="feedback-section__slides relative flex-1">
            {testimonials.map((testimonial, index) => (
              <article
                key={testimonial.author}
                ref={(el) => {
                  slidesRef.current[index] = el;
                }}
                className="feedback-slide"
              >
                <p className="feedback-slide__quote text-s md:text-m lg:text-3xl font-medium leading-tight text-black mb-10">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="feedback-slide__person flex flex-col gap-1 text-sm tracking-wide uppercase text-neutral-600">
                  <span className="feedback-slide__person-name text-black font-semibold">
                    {testimonial.author}
                  </span>
                  <span>{testimonial.role}</span>
                  <span>{testimonial.company}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;