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
    FaPlay
} from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import PortalButton from "../../components/Shared/PortalButton/PortalButton";
import "./CoreField.scss";
import '../../components/Shared/CardDetails/CardDetails';
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
            title: "AI-Powered Coordination",
            description: "Advanced algorithms optimize resource allocation and predict potential bottlenecks before they impact project timelines.",
            icon: <FaBrain className="text-3xl" />
        },
        {
            title: "Real-Time Analytics",
            description: "Comprehensive dashboards provide instant visibility into project performance, resource utilization, and progress metrics.",
            icon: <FaChartLine className="text-3xl" />
        },
        {
            title: "Intelligent Automation",
            description: "Automated workflows reduce manual overhead while ensuring critical tasks are completed on schedule and within budget.",
            icon: <FaRobot className="text-3xl" />
        },
        {
            title: "Real-Time Scheduling",
            description: "Dynamic scheduling that adapts to real-time conditions and automatically optimizes resource allocation across multiple job sites.",
            icon: <FaCalendarAlt className="text-3xl" />
        },
        {
            title: "Team Communication",
            description: "Seamless communication tools that keep field teams connected with real-time updates, messaging, and status reporting.",
            icon: <FaUsers className="text-3xl" />
        },
        {
            title: "Predictive Insights",
            description: "Machine learning models analyze historical data to forecast project outcomes and recommend optimization strategies.",
            icon: <FaLightbulb className="text-3xl" />
        }
    ];

    // Field operations capabilities data
    const fieldCapabilities = [
        {
            title: "Resource Management",
            subtitle: "Intelligent resource tracking and allocation",
            description: "Intelligent resource tracking and allocation ensures the right equipment and personnel are available when and where needed.",
            icon: <FaBox className="text-3xl" />
        },
        {
            title: "Progress Tracking",
            subtitle: "Comprehensive progress monitoring",
            description: "Comprehensive progress monitoring with real-time updates, milestone tracking, and automated reporting capabilities.",
            icon: <FaClipboardCheck className="text-3xl" />
        },
        {
            title: "Live Updates",
            subtitle: "Real-time status changes",
            description: "Real-time status changes and instant notifications keep everyone informed and updated.",
            icon: <FaArrowRight className="text-3xl" />
        },
        {
            title: "Performance Metrics",
            subtitle: "Real-time productivity tracking",
            description: "Track productivity and efficiency in real-time to gain actionable insights into your field operations.",
            icon: <FaChartLine className="text-3xl" />
        },
        {
            title: "Field Control",
            subtitle: "Manage operations from the field",
            description: "Manage operations, teams, and equipment directly from the field, ensuring seamless execution.",
            icon: <FaBrain className="text-3xl" />
        },
        {
            title: "Task Management",
            subtitle: "Assign and track jobs on the go",
            description: "Assign, track, and complete jobs on the go, providing flexibility for your mobile workforce.",
            icon: <FaClipboardCheck className="text-3xl" />
        },
        {
            title: "Cross-Platform Coordination",
            subtitle: "Seamless desktop and mobile sync",
            description: "Seamless coordination across desktop and mobile devices ensures a unified experience for the entire team.",
            icon: <FaUsers className="text-3xl" />
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const sections = [capabilitiesRef.current, fieldOpsRef.current].filter(Boolean);

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
                const capabilityCards = capabilitiesRef.current.querySelectorAll(".capability__card");
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
            const fieldMockupPrimary = document.querySelector(".field__mockup-primary");
            const fieldMockupMobile = document.querySelector(".field__mockup-mobile");

            if (fieldMockupPrimary && fieldMockupMobile) {
                gsap.set([fieldMockupPrimary, fieldMockupMobile], { autoAlpha: 0, scale: 0.95, y: 30 });
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
            <section
                className="hero__section relative w-full bg-white py-12 md:py-32"
            >
                <div className="container mx-auto px-8">
                    <div className="hero__content text-center max-w-4xl mx-auto">
                        <h1 className="hero__title text-black text-4xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tight mb-8">
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
                            cards={coreCapabilities.map(capability => ({
                                cardTitle: capability.title,
                                cardText: capability.description
                            }))}
                        >

                            {/* Images */}
                            <ImageStack
                                images={[
                                    { src: "/assets/img/1iq_app_screenshots/1iq_core.jpeg", alt: "1iQ Core Interface" },

                                ]}
                                width="100%"
                            />
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
                        <CardDetailsOnly sectionTitle="1iQ Field" cardText="Streamline field operations with real-time coordination, intelligent scheduling, and seamless communication between teams. From dispatch to completion, ensure every operation runs smoothly and efficiently." ></CardDetailsOnly>

                        <div className="field__header text-center max-w-4xl mx-auto mb-16">
                            {/* <h2 className="field__title text-black text-4xl md:text-5xl font-bold leading-none tracking-tight mb-8">
                                1iQ Field
                            </h2>
                            <p className="field__description text-black/80 text-xl md:text-2xl leading-relaxed font-light mb-12">
                                Streamline field operations with real-time coordination, intelligent scheduling, and seamless communication between teams. From dispatch to completion, ensure every operation runs smoothly and efficiently.
                            </p> */}

                            {/* Field Operations Mockup Showcase */}
                            <div className="field__mockup-showcase mb-12">
                                <div className="field__mockup-container max-w-6xl mx-auto">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                        {/* Field Operations Desktop */}
                                        <div className="field__mockup-primary">
                                            <div className="relative">
                                                <img
                                                    src="/assets/img/mockups/LaptopMock_1.png"
                                                    alt="1iQ Field Operations Dashboard"
                                                    className="w-full h-auto rounded-lg"
                                                />

                                            </div>
                                        </div>

                                        {/* Field Operations Mobile */}
                                        <div className="field__mockup-mobile">
                                            <div className="relative max-w-sm mx-auto">
                                                <img
                                                    src="/assets/img/mockups/MobileMock_1.png"
                                                    alt="1iQ Field Mobile App"
                                                    className="w-full h-auto rounded-2xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Field Feature Cards */}
                        {/* <div className="field__grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {fieldCapabilities.map((capability, index) => (
                                <div key={index} className="field__card bg-[#f0f2e9] text-black border-2 border-black p-8 hover:bg-white hover:text-black transition-all duration-300">
                                    <div className="field__icon mb-4">
                                        {capability.icon}
                                    </div>
                                    <h3 className="field__title text-xl font-bold mb-4 leading-tight hover:text-black">
                                        {capability.title}
                                    </h3>
                                    <p className="field__description text-base leading-relaxed mb-0 hover:text-black hover:opacity-80 transition-colors duration-300">
                                        {capability.description}
                                    </p>
                                </div>
                            ))}
                        </div> */}
                        {
                            fieldCapabilities.map((capability, index) => (
                                <>
                                    <AccordionRow
                                        key={index}
                                        item={{
                                            number: index + 1,
                                            title: capability.title,
                                            subtitle: capability.subtitle,
                                            description: capability.description
                                        }}
                                    />
                                </>
                            ))
                        }
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