import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaRobot, FaChartBar, FaSyncAlt, FaShieldAlt, FaMobileAlt, FaLink } from 'react-icons/fa';
import PortalButton from '../PortalButton/PortalButton';
gsap.registerPlugin(ScrollTrigger);

// Reusable Feature Card Component - Brutalist Design
const FeatureCard = ({ icon, title, description, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        delay: index * 0.1, // Stagger effect
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <section
      ref={cardRef}
      className="feature-card group bg-white p-8 border border-black hover:bg-[#f0f2e9] hover:text-black transition-colors duration-300 cursor-pointer"
    >
      {/* Icon */}
      <div className="feature-card__icon mb-6">
        <span className="feature-card__icon-symbol text-3xl group-hover:text-black">{icon}</span>
      </div>

      {/* Title */}
      <h3 className="feature-card__title text-lg font-bold text-black group-hover:text-black mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="feature-card__description text-black group-hover:text-black text-sm leading-relaxed font-normal">
        {description}
      </p>
    </section>
  );
};

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  // Features data
  const features = [
    {
      icon: <FaChartBar className="w-10 h-10" />,
      title: 'Scheduling Time Recovered',
      description: 'Replaces MS Project and P6 manual entry. Save 332 hours previously spent building and updating schedules.',
    },
    {
      icon: <FaSyncAlt className="w-10 h-10" />,
      title: 'Reporting Automated',
      description: 'Replaces Excel and PowerPoint manual compiling. Save 182 hours building dashboards and status reports.',
    },
    {
      icon: <FaRobot className="w-10 h-10" />,
      title: 'Instant Lookups & Analysis',
      description: 'Stop digging through emails and Procore docs. AI search saves 109 hours of pure lookup time.',
    },
    {
      icon: <FaShieldAlt className="w-10 h-10" />,
      title: 'Admin & Doc Mgmt Streamlined',
      description: 'Automate data entry, RFIs, submittals, and daily logs. Save 208 hours a year on pure admin.',
    },
    {
      icon: <FaMobileAlt className="w-10 h-10" />,
      title: 'Direct Cost Savings',
      description: 'At $68/hr fully loaded, the recovered time and delay avoidance unlocks $71,397 per PM in expected savings.',
    },
    {
      icon: <FaLink className="w-10 h-10" />,
      title: 'Massive Revenue Uplift',
      description: 'By offloading paperwork, each PM can take on 1 extra project per year. A $5M budget at 7% margin equals $350k in new gross profit.',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="features-section relative pb-24 bg-white pt-24 px-6"
    >
      <div className="features-section__container max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={titleRef} className="features-section__header text-center mb-8 md:mb-16">
          <h2 className="header-title features-section__title mb-4">
            The Bottom Line Savings
          </h2>
          <p className="header-subtitle features-section__subtitle">
            Each PM gets back 831 hours—that's 21 weeks or 40% of their year returned to field leadership.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-section__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              index={index}
            />
          ))}
        </div>

        {/* Home Page Features CTA */}
        <div className="flex justify-center mt-16 pb-8">
          <PortalButton
            label="Speak to the Team"
            redirectTo="/schedule"
            showDivider={false}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;