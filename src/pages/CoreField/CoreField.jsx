import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaBrain,
  FaChartLine,
  FaRobot,
  FaCalendarAlt,
  FaUsers,
  FaLightbulb,
  FaBox,
  FaClipboardCheck,
  FaArrowRight,
  FaPlay,
  FaShieldAlt,
} from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import PortalButton from "../../components/Shared/PortalButton/PortalButton";
import "./CoreField.scss";
import "../../components/Shared/CardDetails/CardDetails";
import CardDetails from "../../components/Shared/CardDetails/CardDetails";
import CardDetailsOnly from "../../components/Shared/CardDetailsOnly/CardDetailsOnly";
import AccordionRow from "../../components/Shared/AccordionRow/AccordionRow";
import ImageStack from "../../components/Shared/ImageStack/ImageStack";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const CoreField = () => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const capabilitiesRef = useRef(null);
  const fieldOpsRef = useRef(null);

  // Core platform capabilities data
  const coreCapabilities = [
    {
      title: "Document Management Streamlined",
      description: (
        <>
          Automate data entry, RFIs, submittals, and daily logs to save you up to{" "}
          <strong className="text-2xl font-black text-black tracking-tight">208 hours</strong> a year, perfectly freeing up your PMs.
        </>
      ),
      icon: <FaClipboardCheck className="text-3xl" />,
    },
    {
      title: "Instant Lookups & Analysis",
      description: (
        <>
          Stop digging through emails and Procore docs. Our AI project chat tool instantly retrieves answers, saving{" "}
          <strong className="text-2xl font-black text-black tracking-tight">109 hours</strong> per year.
        </>
      ),
      icon: <FaBrain className="text-3xl" />,
    },
    {
      title: "Intelligent Workflow Automation",
      description:
        "Centralize fragmented tools into one platform so every handoff, update, and dependency is always automatically in sync.",
      icon: <FaRobot className="text-3xl" />,
    },
    {
      title: "Real-Time Central Command",
      description:
        "Get comprehensive, real-time visibility into project performance, budgets, and metrics to eliminate lag in decision-making.",
      icon: <FaChartLine className="text-3xl" />,
    },
    {
      title: "Live Project Communication",
      description:
        "Seamlessly interact directly with your project data. Just ask the AI—it has read every document, drawing, and correspondence.",
      icon: <FaUsers className="text-3xl" />,
    },
    {
      title: "Predictive Risk Reduction",
      description:
        "Catch cost overruns and prevent schedule delays with live alerts before they ever become severe blockers in the field.",
      icon: <FaShieldAlt className="text-3xl" />,
    },
  ];

  // Field operations capabilities data
  const fieldCapabilities = [
    {
      title: "Effortless Data Capture",
      subtitle: "Automated reporting from the jobsite",
      description:
        "Eliminate manual data entry. Field data flows automatically directly into the platform, ensuring zero lag between site work and decision-making.",
      icon: <FaBox className="text-3xl" />,
    },
    {
      title: "Continuous Mobile Sync",
      subtitle: "Equip every field team instantly",
      description:
        "Provide field teams with instant mobile reporting tools that seamlessly sync with the central command dashboard.",
      icon: <FaUsers className="text-3xl" />,
    },
    {
      title: "Live Actionable Updates",
      subtitle: "Real-time status changes",
      description:
        "Eliminate idle time and miscommunication between trades, maintaining continuous momentum across all project phases.",
      icon: <FaArrowRight className="text-3xl" />,
    },
    {
      title: "Automated Progress Tracking",
      subtitle: "Comprehensive progress monitoring",
      description:
        "Monitor milestones and automatically generate progress reports without needing to chase down subcontractors for updates.",
      icon: <FaClipboardCheck className="text-3xl" />,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = [capabilitiesRef.current, fieldOpsRef.current].filter(
        Boolean,
      );

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

      // Platform Showcase Animations
      const platformShowcase = document.querySelector(".platform__showcase");
      const primaryDashboard = document.querySelector(".primary-dashboard");
      const devicePreview = document.querySelector(".device-preview");

      if (platformShowcase) {
        const elements = [primaryDashboard, devicePreview];

        elements.forEach((element, index) => {
          if (element) {
            gsap.set(element, { autoAlpha: 0, y: 50 });
            gsap.to(element, {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              delay: index * 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 85%",
                once: true,
              },
            });
          }
        });
      }

      if (capabilitiesRef.current) {
        const capabilityCards =
          capabilitiesRef.current.querySelectorAll(".capability__card");
        if (capabilityCards.length) {
          gsap.set(capabilityCards, { autoAlpha: 0, y: 40 });
          gsap.to(capabilityCards, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: capabilitiesRef.current,
              start: "top 92%",
              once: true,
            },
          });
        }
      }

      // Field Mockup Animations
      const fieldMockupPrimary = document.querySelector(
        ".field__mockup-primary",
      );
      const fieldMockupMobile = document.querySelector(".field__mockup-mobile");

      if (fieldMockupPrimary && fieldMockupMobile) {
        gsap.set([fieldMockupPrimary, fieldMockupMobile], {
          autoAlpha: 0,
          scale: 0.95,
          y: 30,
        });
        gsap.to([fieldMockupPrimary, fieldMockupMobile], {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: fieldMockupPrimary,
            start: "top 85%",
            once: true,
          },
        });
      }

      if (fieldOpsRef.current) {
        const fieldCards = fieldOpsRef.current.querySelectorAll(".field__card");
        if (fieldCards.length) {
          gsap.set(fieldCards, { autoAlpha: 0, y: 35 });
          gsap.to(fieldCards, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: fieldOpsRef.current,
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
      {/* <div ref={pageRef} className="app relative w-full overflow-x-hidden"> */}
      {/* Navigation Component */}
      {/* <Navigation heroRef={heroRef} /> */}

      {/* Common Header Section - Black Background */}
      {/* <CommonHeader
                ref={heroRef}
                title="1iQ Core & Field"
                text="Central Command Intelligence"
            /> */}

      {/* Hero Section - White Background */}
      <section className="hero__section relative w-full bg-white py-5 md:py-15">
        <div className="container mx-auto px-8">
          <div className="hero__content text-center max-w-4xl mx-auto">
            <h1 className="hero__title text-black text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none tracking-tight mb-8">
              Central Command Intelligence
            </h1>

            {/* Hero Buttons */}
            <div className="hero__buttons flex flex-col sm:flex-row gap-6 justify-center">
              <PortalButton
                label="Get Started"
                redirectTo="/get-started"
                showDivider={true}
                fullWidth
                className="hero__portal-btn"
                icon={<FaArrowRight />}
              />
              <PortalButton
                label="Schedule Demo"
                redirectTo="/schedule"
                showDivider={true}
                fullWidth
                className="hero__portal-btn"
                icon={<FaPlay />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities Section - Light Gray Background */}
      <section
        id="core"
        ref={capabilitiesRef}
        className="capabilities__section relative w-full bg-gray-50 py-24 md:py-32"
      >
        <div className="container mx-auto px-8">
          <div className="capabilities__content">
            {/* <div className="capabilities__header text-center max-w-3xl mx-auto mb-16">
                            <h2 className="capabilities__title text-black text-4xl md:text-5xl font-bold leading-none tracking-tight mb-6">
                                1iQ Core
                            </h2>
                            <p className="capabilities__subtitle text-black/80 text-xl md:text-2xl leading-relaxed font-light">
                                Powerful features for comprehensive project and field operations management
                            </p>
                        </div> */}

            {/* Feature Cards Grid */}
            {/* <div className="capabilities__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> */}
            {/* {coreCapabilities.map((capability, index) => (
                                // <div key={index} className="capability__card bg-white border-2 border-black p-8 hover:bg-[#f0f2e9] transition-all duration-300">
                                //     <div className="capability__icon mb-4">
                                //         {capability.icon}
                                //     </div>
                                //     <h3 className="capability__title text-xl font-bold mb-4 leading-tight">
                                //         {capability.title}
                                //     </h3>
                                //     <p className="capability__description text-base leading-relaxed mb-0 hover:opacity-90 transition-colors duration-300">
                                //         {capability.description}
                                //     </p>
                                // </div>
                                  
                            ))} */}

            {/* </div> */}
            <CardDetails
              sectionTitle="1iQ Core"
              cards={coreCapabilities.map((capability) => ({
                cardTitle: capability.title,
                cardText: capability.description,
              }))}
            >
              {/* Images */}
              <div className="transform transition-transform duration-700 hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-500/20 rounded-xl overflow-hidden mt-8 border border-neutral-200">
                <ImageStack
                  images={[
                    {
                      src: "/assets/img/1iq_app_screenshots/1iq_core_new.jpeg",
                      alt: "1iQ Core Interface",
                    },
                  ]}
                  height="100%"
                  width="100%"
                />
              </div>
              {/* <ImageStack
                                isMobile={true}
                                images={[
                                    { src: "/assets/img/1iq_app_screenshots/1iq_mobile_1.jpeg", alt: "1iQ AI Mobile" },
                                    { src: "/assets/img/1iq_app_screenshots/1iq_mobile_2.jpeg", alt: "1iQ AI Mobile" }
                                ]}
                                height="30%"
                                width="33%"
                            /> */}
            </CardDetails>
            <div className="flex justify-center mt-12">
              <PortalButton
                label="Contact to Sales"
                redirectTo="/contact-us"
                showDivider={true}
                className="cta-portal-btn"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Field Operations Section - White Background */}
      <section
        id="field"
        ref={fieldOpsRef}
        className="field__section relative w-full bg-white py-24 md:py-32"
      >
        <div className="container mx-auto px-8">
          <div className="field__content">
            <CardDetails
              sectionTitle="1iQ Field"
              cards={[
                {
                  cardTitle: "Streamline the Field",
                  cardText: "Streamline field operations with real-time coordination, intelligent scheduling, and seamless communication between teams. From dispatch to completion, ensure every operation runs smoothly and efficiently."
                },
                ...fieldCapabilities.map(capability => ({
                  cardTitle: capability.title,
                  cardText: capability.description
                }))
              ]}
            >
              <div className="transform transition-transform duration-700 hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-500/20 rounded-xl overflow-hidden border border-neutral-200">
                <img
                  src="assets/img/1iq_app_screenshots/1iq_field_mockup.png"
                  alt="1iQ Field Operations Dashboard"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
            </CardDetails>
            <div className="flex justify-center mt-12">
              <PortalButton
                label="Contact to Sales"
                redirectTo="/contact-us"
                showDivider={true}
                className="cta-portal-btn"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
      {/* </div> */}
    </>
  );
};

export default CoreField;
