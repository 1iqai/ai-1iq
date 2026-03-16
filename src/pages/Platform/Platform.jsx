import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
} from "react-icons/fa";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import CoreField from "../CoreField/CoreField";
import Intelligence from "../Intelligence/Intelligence";
import CardDetails from "../../components/Shared/CardDetails/CardDetails";
import PortalButton from "../../components/Shared/PortalButton/PortalButton";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Platform = () => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const capabilitiesRef = useRef(null);
  const applicationsRef = useRef(null);
  const location = useLocation();
  const lastScrollSignatureRef = useRef("");

  // Key features data
  const keyFeatures = [
    {
      title: "Neural Network Processing",
      description:
        "Advanced deep learning algorithms analyze millions of data points in real-time to identify patterns and predict optimal solutions.",
      icon: <FaBrain className="text-3xl" />,
    },
    {
      title: "Predictive Analytics Engine",
      description:
        "Machine learning models forecast project outcomes, resource requirements, and potential bottlenecks with remarkable accuracy.",
      icon: <FaChartLine className="text-3xl" />,
    },
    {
      title: "Smart Automation",
      description:
        "Intelligent workflows automatically adapt to changing conditions, optimizing resource allocation and task scheduling.",
      icon: <FaMicrochip className="text-3xl" />,
    },
    {
      title: "Advanced Security",
      description:
        "Military-grade encryption and security protocols protect sensitive project data and ensure compliance with industry standards.",
      icon: <FaShieldAlt className="text-3xl" />,
    },
  ];

  // Advanced capabilities data
  const advancedCapabilities = [
    {
      title: "Real-Time Monitoring",
      description: "Continuous surveillance of project metrics with instant alerts and automated response protocols.",
      icon: <FaSatellite className="text-3xl" />,
    },
    {
      title: "Distributed Intelligence",
      description: "Edge computing capabilities ensure seamless operation even in remote or disconnected environments.",
      icon: <FaNetworkWired className="text-3xl" />,
    },
  ];

  // Applications data
  const intelligenceApplications = [
    {
      title: "Risk Assessment",
      description:
        "AI-powered risk identification and mitigation strategies that adapt to evolving project conditions.",
      icon: <FaEye className="text-3xl" />,
    },
    {
      title: "Quality Control",
      description:
        "Automated quality assurance with intelligent defect detection and continuous improvement recommendations.",
      icon: <FaCog className="text-3xl" />,
    },
    {
      title: "Data Protection",
      description: "Secure data management with blockchain-enabled tracking and immutable audit trails.",
      icon: <FaLock className="text-3xl" />,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = [featuresRef.current, capabilitiesRef.current, applicationsRef.current].filter(Boolean);

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
        const featureCards = featuresRef.current.querySelectorAll(".feature__card");
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
        const capabilityCards = capabilitiesRef.current.querySelectorAll(".capability__card");
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
        const applicationCards = applicationsRef.current.querySelectorAll(".application__card");
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

  useEffect(() => {
    const stateTarget = location.state && location.state.scrollTo ? String(location.state.scrollTo) : "";
    const hashTarget = location.hash ? location.hash.substring(1) : "";
    const targetId = stateTarget || hashTarget;

    if (!targetId) {
      return;
    }

    const locationKey = location.key || "default";
    const signature = `${locationKey}-${targetId}`;

    if (lastScrollSignatureRef.current === signature) {
      return;
    }

    const attemptScroll = () => {
      const element = document.getElementById(targetId);
      if (!element) {
        return false;
      }

      if (window.lenis) {
        window.lenis.scrollTo(element);
      } else {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      lastScrollSignatureRef.current = signature;
      return true;
    };

    if (attemptScroll()) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const retryInterval = setInterval(() => {
      attempts += 1;
      if (attemptScroll() || attempts >= maxAttempts) {
        clearInterval(retryInterval);
      }
    }, 150);

    return () => clearInterval(retryInterval);
  }, [location]);

  return (
    <div ref={pageRef} className="app relative w-full overflow-x-hidden">
      {/* Navigation Component */}
      <Navigation heroRef={heroRef} />

      {/* Common Header Section - Black Background */}
      <CommonHeader
        ref={heroRef}
        title="The 1iQ Platform"
      />

      {/* Hero Section - White Background */}
      <section id="hero" className="hero__section relative w-full bg-white pt-8 pb-12 md:pt-12 md:pb-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="hero__content max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-black text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-8 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Reclaim What Matters.
            </h2>
            <p className="hero__description text-center md:text-justify text-black/80 text-xl md:text-2xl leading-relaxed font-light mb-12 w-full mt-0 md:mt-4">
              Every hour your PMs spend on admin is an hour they're not running the job. 1iQ is the AI platform built specifically for construction, automating the scheduling, reporting, and document work that's quietly consuming 30 weeks of every PM's year.
            </p>

            <div className="flex justify-center mt-8 mb-16">
              <PortalButton
                label="Launch Your Free Trial"
                redirectTo="https://app.1iq.ai"
                className="bg-black text-white px-10 py-4 font-bold text-xl rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
                showDivider={false}
              />
            </div>

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
            </div> */}
          </div>
        </div>
      </section>
      {/* <CardDetails
        sectionTitle="1iQ Capabilities"
        cards={[
          {
            cardText:
              "Advanced algorithms optimize resource allocation and predict potential bottlenecks before they impact project timelines.",
            cardTitle: "AI-Powered Coordination",
          },
          {
            cardText:
              "Advanced algorithms optimize resource allocation and predict potential bottlenecks before they impact project timelines.",
            cardTitle: "Real-Time Analytics",
          },
        ]}
      /> */}

      {/* One Platform. Four Capabilities. Overview Section */}
      <section className="relative w-full bg-white py-16 md:py-24 border-t border-gray-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-black text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
              One Platform. Four Capabilities.
            </h2>
            <p className="text-black/70 text-xl md:text-2xl leading-relaxed font-light mb-16 max-w-3xl mx-auto">
              1iQ is designed to be adopted together or rolled out by need. Most teams start with Core and Intel, then expand to Field and Gantt as adoption grows.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-gray-50 border-2 border-black p-8">
                <h3 className="text-black text-xl font-black tracking-tight mb-2">1iQ Core</h3>
                <p className="text-black/70 text-base font-light leading-relaxed">Central command: document management, workflow automation, real-time visibility.</p>
              </div>
              <div className="bg-gray-50 border-2 border-black p-8">
                <h3 className="text-black text-xl font-black tracking-tight mb-2">1iQ Field</h3>
                <p className="text-black/70 text-base font-light leading-relaxed">Field-to-office: real-time data capture, mobile sync, progress tracking.</p>
              </div>
              <div className="bg-gray-50 border-2 border-black p-8">
                <h3 className="text-black text-xl font-black tracking-tight mb-2">1iQ Intel</h3>
                <p className="text-black/70 text-base font-light leading-relaxed">Reporting engine: automated summaries, dashboards, AI-powered analysis.</p>
              </div>
              <div className="bg-gray-50 border-2 border-black p-8">
                <h3 className="text-black text-xl font-black tracking-tight mb-2">1iQ Gantt</h3>
                <p className="text-black/70 text-base font-light leading-relaxed">Scheduling brain: AI-generated schedules that update in 5 minutes, not 5 days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CoreField />

      <Intelligence />
      <Footer />

      {/* Key Features Section - Light Gray Background */}
      {/* <section
                ref={featuresRef}
                className="features__section relative w-full bg-gray-50 py-24 md:py-32"
            >
                <div className="container mx-auto px-8">
                    <div className="features__content">
                        <div className="features__header text-center max-w-3xl mx-auto mb-16">
                            <h2 className="features__title text-black text-4xl md:text-5xl font-bold leading-none tracking-tight mb-6">
                                Key Intelligence Features
                            </h2>
                            <p className="features__subtitle text-black/80 text-xl md:text-2xl leading-relaxed font-light">
                                Cutting-edge AI capabilities that redefine project management
                            </p>
                        </div>

                      
                        <div className="features__grid grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        </div>
                    </div>
                </div>
            </section> */}

      {/* Advanced Capabilities Section - White Background */}
      {/* <section
                ref={capabilitiesRef}
                className="capabilities__section relative w-full bg-white py-24 md:py-32"
            >
                <div className="container mx-auto px-8">
                    <div className="capabilities__content">
                        <div className="capabilities__header text-center max-w-4xl mx-auto mb-16">
                            <h2 className="capabilities__title text-black text-4xl md:text-5xl font-bold leading-none tracking-tight mb-8">
                                Advanced Capabilities
                            </h2>
                            <p className="capabilities__description text-black/80 text-xl md:text-2xl leading-relaxed font-light mb-12">
                                Our intelligence platform combines cutting-edge machine learning with industry-specific knowledge to deliver insights that were previously impossible. From predictive analytics to automated decision-making, experience the future of construction management.
                            </p>
                        </div>

                      
                        <div className="capabilities__grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {advancedCapabilities.map((capability, index) => (
                                <div key={index} className="capability__card bg-[#f0f2e9] text-black border-2 border-black p-8 hover:bg-white hover:text-black transition-all duration-300">
                                    <div className="capability__icon mb-4">
                                        {capability.icon}
                                    </div>
                                    <h3 className="capability__title text-xl font-bold mb-4 leading-tight hover:text-black">
                                        {capability.title}
                                    </h3>
                                    <p className="capability__description text-base leading-relaxed mb-0 hover:text-black hover:opacity-80 transition-colors duration-300">
                                        {capability.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section> */}

      {/* Applications Section - Light Gray Background */}
      {/* <section
                ref={applicationsRef}
                className="applications__section relative w-full bg-gray-50 py-24 md:py-32"
            >
                <div className="container mx-auto px-8">
                    <div className="applications__content">
                        <div className="applications__header text-center max-w-3xl mx-auto mb-16">
                            <h2 className="applications__title text-black text-4xl md:text-5xl font-bold leading-none tracking-tight mb-6">
                                Real-World Applications
                            </h2>
                            <p className="applications__subtitle text-black/80 text-xl md:text-2xl leading-relaxed font-light">
                                Transform your operations with intelligent automation
                            </p>
                        </div>

                
                        <div className="applications__grid grid grid-cols-1 md:grid-cols-3 gap-8">
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
                        </div>
                    </div>
                </div>
            </section> */}

      {/* Footer */}
    </div>
  );
};

export default Platform;
