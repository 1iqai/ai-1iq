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
    FaPlay
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
            title: "Neural Network Processing",
            description: "Advanced deep learning algorithms analyze millions of data points in real-time to identify patterns and predict optimal solutions.",
            icon: <FaBrain className="text-3xl" />
        },
        {
            title: "Predictive Analytics Engine",
            description: "Machine learning models forecast project outcomes, resource requirements, and potential bottlenecks with remarkable accuracy.",
            icon: <FaChartLine className="text-3xl" />
        },
        {
            title: "Smart Automation",
            description: "Intelligent workflows automatically adapt to changing conditions, optimizing resource allocation and task scheduling.",
            icon: <FaMicrochip className="text-3xl" />
        },
        {
            title: "Advanced Security",
            description: "Military-grade encryption and security protocols protect sensitive project data and ensure compliance with industry standards.",
            icon: <FaShieldAlt className="text-3xl" />
        }
    ];

    // Advanced capabilities data
    const advancedCapabilities = [
        {
            title: "Real-Time Monitoring",
            description: "Continuous surveillance of project metrics with instant alerts and automated response protocols.",
            subtitle: "Real-Time Monitoring with Immediate Action",
            icon: <FaSatellite className="text-3xl" />
        },
        {
            title: "Distributed Intelligence",
            description: "Edge computing capabilities ensure seamless operation even in remote or disconnected environments.",
            subtitle: "Seamless Operation in Remote Environments",
            icon: <FaNetworkWired className="text-3xl" />
        }
    ];

    // Applications data
    const intelligenceApplications = [
        {
            title: "Risk Assessment",
            description: "AI-powered risk identification and mitigation strategies that adapt to evolving project conditions.",
            icon: <FaEye className="text-3xl" />
        },
        {
            title: "Quality Control",
            description: "Automated quality assurance with intelligent defect detection and continuous improvement recommendations.",
            icon: <FaCog className="text-3xl" />
        },
        {
            title: "Data Protection",
            description: "Secure data management with blockchain-enabled tracking and immutable audit trails.",
            icon: <FaLock className="text-3xl" />
        }
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

    return (
        <>
            {/* <div ref={pageRef} className="app relative w-full overflow-x-hidden">*/}
            {/* Navigation Component */}
            {/* <Navigation heroRef={heroRef} /> */}

            {/* Common Header Section - Black Background */}
            {/* <CommonHeader
                ref={heroRef}
                title="1iQ Intelligence"
                text="Advanced AI-Powered Analytics"
            /> */}

            {/* Hero Section - White Background */}
            {/* <section
                className="hero__section relative w-full bg-white py-12 md:py-32"
            >
                <div className="container mx-auto px-8">
                    <div className="hero__content text-center max-w-4xl mx-auto">
                        <h1 className="hero__title text-black text-4xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tight mb-8">
                            Advanced AI-Powered Analytics
                        </h1>

                        <p className="hero__description text-black/80 text-xl md:text-2xl leading-relaxed font-light mb-12 max-w-3xl mx-auto">
                            Harness the power of artificial intelligence and machine learning to transform your construction projects into intelligent, self-optimizing operations that predict, adapt, and evolve in real-time.
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
                            cards={keyFeatures.map(feature => ({
                                cardTitle: feature.title,
                                cardText: feature.description
                            }))}
                        >
                            <ImageStack
                                images={[
                                    { src: "/assets/img/1iq_app_screenshots/1iq_intel.jpeg", alt: "1iQ Intel Interface" },
                                ]}
                            />
                        </CardDetails>
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
                        <CardDetailsOnlyV2
                            sectionTitle="Advanced Capabilities"
                            cardText="Our intelligence platform combines cutting-edge machine learning with industry-specific knowledge to deliver insights that were previously impossible. From predictive analytics to automated decision-making, experience the future of construction management."
                            image="/assets/img/1iq_app_screenshots/1iq_grant.jpeg"
                        />

                        {/* Capabilities Cards */}
                        {/* <div className="capabilities__grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                        </div> */}
                        {
                            advancedCapabilities.map((capability, index) => (
                                <AccordionRow key={index} item={{
                                    number: index + 1,
                                    title: capability.title,
                                    subtitle: capability.subtitle,
                                    description: capability.description
                                }} />
                            ))
                        }
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
                            sectionTitle="Real-World Applications"
                            cards={intelligenceApplications.map(application => ({
                                cardTitle: application.title,
                                cardText: application.description
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
                    </div>
                </div>
            </section>

            {/* Footer */}
            {/* <Footer /> */}
            {/* </div> */}
        </>
    );
};

export default Intelligence;