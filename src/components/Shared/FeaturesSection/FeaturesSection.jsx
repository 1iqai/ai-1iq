import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaRobot, FaChartBar, FaSyncAlt, FaShieldAlt, FaMobileAlt, FaLink } from 'react-icons/fa';
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
      icon: <FaRobot className="w-10 h-10" />,
      title: 'AI-Powered Analytics',
      description: 'Leverage advanced machine learning algorithms to predict project outcomes, identify risks, and optimize resource allocation in real-time.',
    },
    {
      icon: <FaChartBar className="w-10 h-10" />,
      title: 'Real-Time Dashboards',
      description: 'Monitor all your construction projects from a single, intuitive dashboard with live updates and customizable metrics.',
    },
    {
      icon: <FaSyncAlt className="w-10 h-10" />,
      title: 'Automated Workflows',
      description: 'Streamline repetitive tasks with intelligent automation, freeing your team to focus on high-value activities.',
    },
    {
      icon: <FaShieldAlt className="w-10 h-10" />,
      title: 'Safety Monitoring',
      description: 'AI-driven safety analysis detects potential hazards and ensures compliance with industry regulations automatically.',
    },
    {
      icon: <FaMobileAlt className="w-10 h-10" />,
      title: 'Mobile Access',
      description: 'Access project data, approve changes, and communicate with your team from anywhere, on any device.',
    },
    {
      icon: <FaLink className="w-10 h-10" />,
      title: 'Seamless Integration',
      description: 'Connect with your existing tools and platforms through our robust API and pre-built integrations.',
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
            Powerful Features
          </h2>
          <p className="header-subtitle features-section__subtitle">
            Everything you need to manage construction projects efficiently and effectively
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
      </div>
    </section>
  );
};

export default FeaturesSection;