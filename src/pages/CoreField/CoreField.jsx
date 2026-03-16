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
      title: "RFIs and Submittals. Handled.",
      description: "1iQ Core automates RFIs, submittals, daily logs, and data entry — saving 208 hours of your PM's year.",
      icon: <FaClipboardCheck className="text-3xl" />,
    },
    {
      title: "The Answer Is Already There. Just Ask.",
      description: "Ask 1iQ Core any question about the project — it has read every email, log, and change order. Saves 109 hours a year.",
      icon: <FaBrain className="text-3xl" />,
    },
    {
      title: "Handoffs That Don't Drop Balls",
      description: "Every task handoff and dependency updates automatically — no one needs to chase it.",
      icon: <FaRobot className="text-3xl" />,
    },
    {
      title: "Everything in One Place. Always Current.",
      description: "Budgets, schedules, performance, and milestones — all live, all in one place.",
      icon: <FaChartLine className="text-3xl" />,
    },
    {
      title: "Ask Your Project Anything",
      description: "1iQ Core reads every document on the job and flags risks before they become problems.",
      icon: <FaUsers className="text-3xl" />,
    },
    {
      title: "Know What's Coming Before It Costs You",
      description: "1iQ Core spots the patterns behind cost overruns and schedule delays early, before there's still time to act.",
      icon: <FaShieldAlt className="text-3xl" />,
    },
  ];

  // Field operations capabilities data
  const fieldCapabilities = [
    {
      title: "No More Manual Data Entry. Ever.",
      subtitle: "Automated reporting from the jobsite",
      description: "Field teams report once — that data flows automatically into schedules, dashboards, and reports with zero manual re-entry.",
      icon: <FaBox className="text-3xl" />,
    },
    {
      title: "Your Site in Your Pocket",
      subtitle: "Equip every field team instantly",
      description: "Daily logs, RFI submissions, and site updates sync to central command in real time from any device.",
      icon: <FaUsers className="text-3xl" />,
    },
    {
      title: "Every Trade. Always in Sync.",
      subtitle: "Real-time status changes",
      description: "Live updates to every trade eliminate idle time and miscommunication across all project phases.",
      icon: <FaArrowRight className="text-3xl" />,
    },
    {
      title: "Progress Reports That Chase Themselves",
      subtitle: "Comprehensive progress monitoring",
      description: "1iQ Field monitors milestones and generates progress reports automatically — no follow-up emails required.",
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

            <p className="hero__description text-center text-black/80 text-xl md:text-2xl leading-relaxed font-light mb-12 max-w-3xl mx-auto">
              1iQ unifies your entire project operation into a single AI powered command layer. Scheduling, reporting, field data, and document management all flow into one place, so your team makes faster decisions with complete information, not fragmented tools and email chains.
            </p>

            {/* Hero Buttons */}
            <div className="hero__buttons flex justify-center">
              <PortalButton
                label="Get Started"
                redirectTo="/get-started"
                showDivider={true}
                fullWidth={false}
                className="hero__portal-btn"
                icon={<FaArrowRight />}
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
                label="Launch Free Trial"
                redirectTo="https://app.1iq.ai"
                showDivider={false}
                className="bg-black text-white px-10 py-4 font-bold text-xl rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
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
                  cardTitle: "Field to Office. Zero Lag.",
                  cardText: "1iQ Field syncs live site data directly into the platform — every decision made on today's information, not last week's."
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
                label="Launch Free Trial"
                redirectTo="https://app.1iq.ai"
                showDivider={false}
                className="bg-black text-white px-10 py-4 font-bold text-xl rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
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
