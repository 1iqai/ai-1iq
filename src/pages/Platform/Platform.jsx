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
import PlatformSlider from "../../components/PlatformSlider";
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

      {/* ── How the Platform Works ── */}
      <section className="how-it-works">
        <div className="how-it-works__inner">

          <div className="how-it-works__header">
            <p className="how-it-works__eyebrow">THE SYSTEM</p>
            <h2 className="how-it-works__title">How the Platform Works</h2>
            <p className="how-it-works__subtitle">
              Four layers. One continuous loop. From the moment something happens on site to the moment your team acts on it.
            </p>
          </div>

          <div className="how-it-works__flow">

            {/* Step 1 */}
            <div className="hiw-step">
              <div className="hiw-step__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="hiw-step__number">01</div>
              <h3 className="hiw-step__title">Field Activity</h3>
              <p className="hiw-step__desc">
                Subcontractors, PMs, and site teams work as normal. 1iQ observes — no new workflows, no behavior change required.
              </p>
            </div>

            {/* Connector */}
            <div className="hiw-connector">
              <div className="hiw-connector__line" />
              <svg className="hiw-connector__arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 0L12 12H0L6 0Z" transform="rotate(90 6 6)"/>
              </svg>
            </div>

            {/* Step 2 */}
            <div className="hiw-step">
              <div className="hiw-step__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
              </div>
              <div className="hiw-step__number">02</div>
              <h3 className="hiw-step__title">Passive Data Capture</h3>
              <p className="hiw-step__desc">
                1iQ automatically converts jobsite activity into structured project data. No manual entry. No chasing subs for updates.
              </p>
            </div>

            {/* Connector */}
            <div className="hiw-connector">
              <div className="hiw-connector__line" />
              <svg className="hiw-connector__arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 0L12 12H0L6 0Z" transform="rotate(90 6 6)"/>
              </svg>
            </div>

            {/* Step 3 */}
            <div className="hiw-step hiw-step--accent">
              <div className="hiw-step__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div className="hiw-step__number">03</div>
              <h3 className="hiw-step__title">1iQ AI Engine</h3>
              <p className="hiw-step__desc">
                Machine learning analyzes schedules, production rates, and risk signals. Delays are flagged before they happen.
              </p>
              <span className="hiw-step__badge">The Intelligence Layer</span>
            </div>

            {/* Connector */}
            <div className="hiw-connector">
              <div className="hiw-connector__line" />
              <svg className="hiw-connector__arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 0L12 12H0L6 0Z" transform="rotate(90 6 6)"/>
              </svg>
            </div>

            {/* Step 4 */}
            <div className="hiw-step">
              <div className="hiw-step__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div className="hiw-step__number">04</div>
              <h3 className="hiw-step__title">Live Project Intelligence</h3>
              <p className="hiw-step__desc">
                Executives and PMs see every project in real time. Schedules, budgets, risks, and contractor performance — all in one place.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ADDITION 2 — Sub-Product Architecture Explanation */}
      <section className="platform-architecture">
        <div className="platform-architecture__inner">
          <p className="platform-architecture__eyebrow">THE PLATFORM</p>
          <h2 className="platform-architecture__title">One Platform. Four Capabilities.</h2>
          <p className="platform-architecture__intro">
            1iQ is designed to be adopted together or rolled out by need. Most teams start with Core and Intel, then add Field and Gantt as adoption grows. All four are available from day one.
          </p>
          <div className="platform-architecture__grid">
            <div className="platform-architecture__module">
              <span className="platform-architecture__module-tag">1iQ Core</span>
              <p className="platform-architecture__module-desc">The central command layer. Document management, workflow automation, and real-time project visibility.</p>
            </div>
            <div className="platform-architecture__module">
              <span className="platform-architecture__module-tag">1iQ Field</span>
              <p className="platform-architecture__module-desc">The field-to-office connection. Real-time data capture and mobile sync — without chasing subcontractors.</p>
            </div>
            <div className="platform-architecture__module">
              <span className="platform-architecture__module-tag">1iQ Intel</span>
              <p className="platform-architecture__module-desc">The reporting engine. Automated summaries, dashboards, and AI-powered analysis — replacing manual PowerPoint and Excel work.</p>
            </div>
            <div className="platform-architecture__module">
              <span className="platform-architecture__module-tag">1iQ Gantt</span>
              <p className="platform-architecture__module-desc">The scheduling brain. AI-generated schedules that update in 5 minutes instead of 5 days.</p>
            </div>
          </div>
        </div>
      </section>

      <PlatformSlider />

      {/* ── The Intelligence Layer ── */}
      <section className="intelligence-layer">
        <div className="intelligence-layer__inner">

          <div className="intelligence-layer__left">
            <p className="intelligence-layer__eyebrow">WHERE 1iQ FITS</p>
            <h2 className="intelligence-layer__title">
              The Layer Your<br />Stack Was Missing
            </h2>
            <p className="intelligence-layer__body">
              Your team already uses tools for scheduling, field reporting, and project management. 1iQ doesn't replace them — it sits above them, reading everything and turning fragmented activity into structured intelligence.
            </p>
            <p className="intelligence-layer__body">
              Most construction software captures data. 1iQ understands it.
            </p>
            <a href="https://calendly.com/ck-1iq/30min" target="_blank" rel="noopener noreferrer" className="intelligence-layer__cta">
              See How It Connects
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div className="intelligence-layer__right">

            {/* 1iQ at the top */}
            <div className="il-platform">
              <div className="il-platform__badge">
                <span className="il-platform__dot" />
                1iQ Platform
              </div>
              <p className="il-platform__label">Intelligence Layer</p>
              <div className="il-platform__lines">
                <div className="il-platform__line" />
                <div className="il-platform__line" />
                <div className="il-platform__line" />
                <div className="il-platform__line" />
              </div>
            </div>

            {/* Tools below */}
            <div className="il-tools">
              <div className="il-tool">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Scheduling Tools</span>
                <span className="il-tool__example">MS Project, P6</span>
              </div>
              <div className="il-tool">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <span>Project Management</span>
                <span className="il-tool__example">Procore, Autodesk</span>
              </div>
              <div className="il-tool">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
                <span>Field Reporting</span>
                <span className="il-tool__example">Daily logs, RFIs</span>
              </div>
              <div className="il-tool">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Communication</span>
                <span className="il-tool__example">Email, Teams, Slack</span>
              </div>
            </div>

          </div>
        </div>
      </section>

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
