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
      title: 'Schedules That Stop Breaking',
      description: "Your PMs shouldn't be rebuilding the schedule every time a sub misses a day. 1iQ updates it automatically from live field data, saving 332 hours a year of manual P6 and MS Project entry.",
    },
    {
      icon: <FaSyncAlt className="w-10 h-10" />,
      title: 'Reports That Write Themselves',
      description: "The Monday morning status report shouldn't take all of Sunday night. 1iQ reads every dashboard and writes the summary, saving 182 hours a year that used to disappear into Excel and PowerPoint.",
    },
    {
      icon: <FaRobot className="w-10 h-10" />,
      title: 'Every Answer. Instantly.',
      description: 'How many hours does your team spend hunting through email threads to find a decision from six weeks ago? 1iQ has read every data point on the project. Just ask it. Saves 109 hours of pure lookup time per year.',
    },
    {
      icon: <FaShieldAlt className="w-10 h-10" />,
      title: 'The Admin That Runs Itself',
      description: 'RFIs, submittals, daily logs, data entry. The invisible tax that eats 208 hours of every PM\'s year. 1iQ handles it automatically so your team can focus on what actually needs a human.',
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
            What 1iQ Returns to Every PM
          </h2>
          <p className="header-subtitle features-section__subtitle">
            Right now, your best PMs are spending more time on admin than they are running jobs. 1iQ changes that, returning 831 hours, 21 weeks, and 40% of their year back to the work that actually moves projects forward.
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