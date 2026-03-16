import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaBrain,
  FaChartLine,
  FaMicrochip,
  FaShieldAlt,
  FaSatellite,
  FaNetworkWired,
  FaEye,
  FaLock,
  FaCog,
  FaPlay,
} from "react-icons/fa";
import CardDetails from "../../components/Shared/CardDetails/CardDetails";
import CardDetailsV2 from "../../components/Shared/CardDetailsV2/CardDetailsV2";
import CardDetailsOnly from "../../components/Shared/CardDetailsOnly/CardDetailsOnly";
import CardDetailsOnlyV2 from "../../components/Shared/CardDetailsOnlyV2/CardDetailsOnlyV2";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import PortalButton from "../../components/Shared/PortalButton/PortalButton";
import AccordionRow from "../../components/Shared/AccordionRow/AccordionRow";
import ImageStack from "../../components/Shared/ImageStack/ImageStack";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Intelligence = () => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const capabilitiesRef = useRef(null);
  const applicationsRef = useRef(null);

  // Key features data
  const keyFeatures = [
    {
      title: "Your Weekly Report. Written Before You Wake Up.",
      description: (
        "1iQ Intel reads every dashboard and writes the weekly summary automatically — saving 182 hours a year, per PM."
      ),
      icon: <FaChartLine className="text-3xl" />,
    },
    {
      title: "Time Recovered Is Money Recovered.",
      description: (
        "Across scheduling, reporting, and admin automation, the expected recovery is $71,397 per PM, per year."
      ),
      icon: <FaMicrochip className="text-3xl" />,
    },
    {
      title: "Capacity You Already Have.",
      description: (
        "With reporting automated, each PM gains capacity for one more project a year — $350k in new gross profit, no new hires."
      ),
      icon: <FaBrain className="text-3xl" />,
    },
    {
      title: "One Source of Truth.",
      description: "One AI driven system replaces every disconnected tool — every team, task, budget, and document connected live.",
      icon: <FaShieldAlt className="text-3xl" />,
    },
  ];

  // Advanced capabilities data
  const advancedCapabilities = [
    {
      title: "The Schedule That Runs Itself",
      description: (
        "When something changes on site, 1iQ Gantt updates the full schedule automatically — 5 minutes, not 5 days."
      ),
      subtitle: (
        <span className="text-black font-bold tracking-tight">Save <span className="font-bold">332 Hours</span> Annually on Scheduling</span>
      ),
      icon: <FaSatellite className="text-3xl" />,
    },
    {
      title: "When Plans Change, 1iQ Adjusts.",
      description:
        "1iQ Gantt continuously adjusts timelines and resources based on live site data — keeping projects on track when plans change.",
      subtitle: "Predictive Delays and Scheduling",
      icon: <FaNetworkWired className="text-3xl" />,
    },
  ];

  // Applications data
  const intelligenceApplications = [
    {
      title: "The Math Is Simple.",
      description: (
        <>
          For a team of five project managers, the net benefit is <strong className="text-2xl font-black text-black tracking-tight">$2.1M</strong> in Year 1. That's{" "}
          <strong className="text-black font-bold">4,156 hours</strong> recovered, $71,397 in direct savings per PM, and <strong className="text-2xl font-black text-black tracking-tight">$25 million</strong> in new project capacity. From a tool that was already in your budget.
        </>
      ),
      icon: <FaEye className="text-3xl" />,
    },
    {
      title: "Already In Your Budget. Ready Day One.",
      description:
        "1iQ is structured as a 2.5% project soft cost, already in your budget. Out of pocket cost is $1,000 per PM, per year.",
      icon: <FaCog className="text-3xl" />,
    },
    {
      title: "Every Decision. Documented.",
      description:
        "Every change, decision, and communication logged, searchable, and audit-ready.",
      icon: <FaLock className="text-3xl" />,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = [
        featuresRef.current,
        capabilitiesRef.current,
        applicationsRef.current,
      ].filter(Boolean);

      sections.forEach((section) => {
        gsap.set(section, { autoAlpha: 0, y: 60 });
        gsap.to(section, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            once: true,
          },
        });
      });

      if (featuresRef.current) {
        const featureCards =
          featuresRef.current.querySelectorAll(".feature__card");
        if (featureCards.length) {
          gsap.set(featureCards, { autoAlpha: 0, y: 40 });
          gsap.to(featureCards, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 92%",
              once: true,
            },
          });
        }
      }

      if (capabilitiesRef.current) {
        const capabilityCards =
          capabilitiesRef.current.querySelectorAll(".capability__card");
        if (capabilityCards.length) {
          gsap.set(capabilityCards, { autoAlpha: 0, y: 35 });
          gsap.to(capabilityCards, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: capabilitiesRef.current,
              start: "top 95%",
              once: true,
            },
          });
        }
      }

      if (applicationsRef.current) {
        const applicationCards =
          applicationsRef.current.querySelectorAll(".application__card");
        if (applicationCards.length) {
          gsap.set(applicationCards, { autoAlpha: 0, y: 35 });
          gsap.to(applicationCards, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: applicationsRef.current,
              start: "top 95%",
              once: true,
            },
          });
        }
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* <div ref={pageRef} className="app relative w-full overflow-x-hidden">*/}
      {/* Navigation Component */}
      {/* <Navigation heroRef={heroRef} /> */}

      {/* Common Header Section - Black Background */}
      {/* <CommonHeader
                ref={heroRef}
                title="1iQ Intelligence"
                text="Advanced AI Powered Analytics"
            /> */}

      {/* Hero Section - White Background */}
      {/* <section
                className="hero__section relative w-full bg-white py-12 md:py-32"
            >
                <div className="container mx-auto px-8">
                    <div className="hero__content text-center max-w-4xl mx-auto">
                        <h1 className="hero__title text-black text-4xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tight mb-8">
                            Advanced AI Powered Analytics
                        </h1>

                        <p className="hero__description text-black/80 text-xl md:text-2xl leading-relaxed font-light mb-12 max-w-3xl mx-auto">
                            Harness the power of artificial intelligence and machine learning to transform your construction projects into intelligent, self optimizing operations that predict, adapt, and evolve in real time.
                        </p>

                        {/* Hero Image */}
      {/* <div className="hero__image mt-16">
                            <div className="border-2 border-black rounded-lg overflow-hidden">
                                <video
                                    src="/assets/video/intel_1.mp4"
                                    alt="1iQ Intelligence Platform"
                                    className="w-full h-auto"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            </div>
                        </div>
                    </div>
                </div> */}
      {/* </section> */}

      {/* Key Features Section - Light Gray Background */}
      <section
        id="intelligence"
        ref={featuresRef}
        className="features__section relative w-full bg-gray-50 py-24 md:py-32"
      >
        <div className="container mx-auto px-8">
          <div className="features__content">
            {/* <div className="features__header text-center max-w-3xl mx-auto mb-16">
                            <h2 className="features__title text-black text-4xl md:text-5xl font-bold leading-none tracking-tight mb-6">
                                Key Intelligence Features
                            </h2>
                            <p className="features__subtitle text-black/80 text-xl md:text-2xl leading-relaxed font-light">
                                Cutting-edge AI capabilities that redefine project management
                            </p>
                        </div> */}

            {/* Feature Cards Grid */}
            {/* <div className="features__grid grid grid-cols-1 md:grid-cols-2 gap-8">
                            {keyFeatures.map((feature, index) => (
                                <div key={index} className="feature__card bg-white border-2 border-black p-8 hover:bg-[#f0f2e9] transition-all duration-300">
                                    <div className="feature__icon mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="feature__title text-xl font-bold mb-4 leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="feature__description text-base leading-relaxed mb-0 hover:opacity-90 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div> */}
            <CardDetails
              sectionTitle="1iQ Intel"
              cards={keyFeatures.map((feature) => ({
                cardTitle: feature.title,
                cardText: feature.description,
              }))}
            >
              <div className="transform transition-transform duration-700 hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-500/20 rounded-xl overflow-hidden border border-neutral-200">
                <img
                  src="/assets/img/1iq_app_screenshots/1iq_intel_new.jpeg"
                  alt="1iQ Intel Interface"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
            </CardDetails>
            <div className="flex justify-center mt-12">
              <PortalButton
                label="Launch Free Trial"
                redirectTo="https://app.1iq.ai"
                showDivider={false}
                className="bg-black text-white px-10 py-4 font-bold text-xl rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Capabilities Section - White Background */}
      <section
        ref={capabilitiesRef}
        className="capabilities__section relative w-full bg-white py-24 md:py-32"
      >
        <div className="container mx-auto px-8">
          <div className="capabilities__content">
            {/* <div className="capabilities__header text-center max-w-4xl mx-auto mb-16">
                            <h2 className="capabilities__title text-black text-4xl md:text-5xl font-bold leading-none tracking-tight mb-8">
                                Advanced Capabilities
                            </h2>
                            <p className="capabilities__description text-black/80 text-xl md:text-2xl leading-relaxed font-light mb-12">
                                Our intelligence platform combines cutting-edge machine learning with industry-specific knowledge to deliver insights that were previously impossible. From predictive analytics to automated decision-making, experience the future of construction management.
                            </p>
                        </div> */}
            <CardDetails
              sectionTitle="1iQ Gantt"
              cards={[
                {
                  cardTitle: "The Schedule That Runs Itself",
                  cardText: "When something changes on site, 1iQ Gantt updates the full schedule automatically — 5 minutes, not 5 days.",
                },
                ...advancedCapabilities.map(capability => ({
                  cardTitle: capability.title === "AI Schedule Generator" ? "5-Minute Schedule Updates" : capability.title,
                  cardText: capability.description
                }))
              ]}
            >
              <div className="transform transition-transform duration-700 hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-500/20 rounded-xl overflow-hidden border border-neutral-200">
                <img
                  src="/assets/img/1iq_app_screenshots/1iq_grant.jpeg"
                  alt="1iQ Gantt Interface"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
            </CardDetails>
            <div className="flex justify-center mt-12">
              <PortalButton
                label="Launch Free Trial"
                redirectTo="https://app.1iq.ai"
                showDivider={false}
                className="bg-black text-white px-10 py-4 font-bold text-xl rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section - Light Gray Background */}
      <section
        ref={applicationsRef}
        className="applications__section relative w-full bg-gray-50 py-24 md:py-32"
      >
        <div className="container mx-auto px-8">
          <div className="applications__content">
            {/* <div className="applications__header text-center max-w-3xl mx-auto mb-16">
                            <h2 className="applications__title text-black text-4xl md:text-5xl font-bold leading-none tracking-tight mb-6">
                                Real-World Applications
                            </h2>
                            <p className="applications__subtitle text-black/80 text-xl md:text-2xl leading-relaxed font-light">
                                Transform your operations with intelligent automation
                            </p>
                        </div> */}

            {/* Application Cards Grid */}
            {/* <div className="applications__grid grid grid-cols-1 md:grid-cols-3 gap-8">
                            {intelligenceApplications.map((application, index) => (
                                <div key={index} className="application__card bg-white border-2 border-black p-8 hover:bg-[#f0f2e9] transition-all duration-300">
                                    <div className="application__icon mb-4">
                                        {application.icon}
                                    </div>
                                    <h3 className="application__title text-xl font-bold mb-4 leading-tight">
                                        {application.title}
                                    </h3>
                                    <p className="application__description text-base leading-relaxed mb-0 hover:opacity-90 transition-colors duration-300">
                                        {application.description}
                                    </p>
                                </div>
                            ))}
                        </div> */}
            <CardDetailsV2
              sectionTitle="The Bottom Line"
              cards={intelligenceApplications.map((application) => ({
                cardTitle: application.title,
                cardText: application.description,
              }))}
              image="/assets/img/1iq_app_screenshots/1iq_ai.jpeg"
            >
              {/* <ImageStack
                                isMobile={true}
                                images={[
                                    { src: "/assets/img/1iq_app_screenshots/1iq_mobile_1.jpeg", alt: "1iQ Mobile Interface 1" },
                                    { src: "/assets/img/1iq_app_screenshots/1iq_mobile_2.jpeg", alt: "1iQ Mobile Interface 2" }
                                ]}
                            /> */}
            </CardDetailsV2>

            <div className="flex justify-center mt-24 mb-16">
              <PortalButton
                label="Maximize Your ROI Today"
                redirectTo="/schedule"
                className="bg-black text-white px-12 py-5 font-bold text-2xl rounded-full hover:bg-gray-800 transition-colors shadow-2xl shadow-black/20 hover:scale-105"
                showDivider={false}
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Intelligence;
