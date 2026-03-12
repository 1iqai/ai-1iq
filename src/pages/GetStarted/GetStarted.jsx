import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import { FaCalendarAlt, FaEnvelope, FaHandshake, FaTools, FaArrowRight } from "react-icons/fa";

const GetStarted = () => {
    const heroRef = useRef(null);
    const containerRef = useRef(null);

    const cards = [
        {
            title: "Schedule Demo",
            description: "See 1iQ in action. Book a personalized demo with our product experts.",
            icon: <FaCalendarAlt className="text-5xl mb-6" />,
            link: "/schedule",
            theme: "dark"
        },
        {
            title: "Contact Sales",
            description: "Ready to transform your operations? Let's discuss pricing and implementation.",
            icon: <FaEnvelope className="text-5xl mb-6" />,
            link: "/contact-us",
            theme: "light"
        },
        {
            title: "Partnership Inquiry",
            description: "Join our partner ecosystem. Let's grow and innovate together.",
            icon: <FaHandshake className="text-5xl mb-6" />,
            link: "/partnership-inquiry",
            theme: "light"
        },
        {
            title: "Builder Application",
            description: "Building the future? Apply for our builder program and access exclusive tools.",
            icon: <FaTools className="text-5xl mb-6" />,
            link: "/builder-application",
            theme: "light"
        }
    ];

    useEffect(() => {
        // Disable scroll snap for this page
        document.documentElement.style.scrollSnapType = "none";

        const ctx = gsap.context(() => {
            // Initial staggered entry animation
            gsap.fromTo(".get-started-card",
                {
                    y: 100,
                    opacity: 0,
                    scale: 0.9
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power4.out",
                    delay: 0.2,
                    clearProps: "transform" // Only clear transform to avoid layout issues, keep opacity
                }
            );
        }, containerRef);

        return () => {
            ctx.revert();
            // Re-enable scroll snap when leaving
            document.documentElement.style.scrollSnapType = "y mandatory";
        };
    }, []);

    const handleMouseEnter = (e, color) => {
        const card = e.currentTarget;
        const icon = card.querySelector('.card-icon');
        const arrow = card.querySelector('.card-arrow');

        gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        });

        gsap.to(icon, {
            scale: 1.2,
            rotate: 5,
            duration: 0.4,
            ease: "back.out(1.7)"
        });

        gsap.to(arrow, {
            x: 5,
            opacity: 1,
            duration: 0.3
        });
    };

    const handleMouseLeave = (e) => {
        const card = e.currentTarget;
        const icon = card.querySelector('.card-icon');
        const arrow = card.querySelector('.card-arrow');

        gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            boxShadow: "none"
        });

        gsap.to(icon, {
            scale: 1,
            rotate: 0,
            duration: 0.4,
            ease: "power2.out"
        });

        gsap.to(arrow, {
            x: 0,
            duration: 0.3
        });
    };

    return (
        <div className="app relative w-full min-h-screen flex flex-col bg-white">
            <Navigation heroRef={heroRef} />

            <CommonHeader
                ref={heroRef}
                title="Get Started"
                text="Choose your path to intelligent construction management."
            />

            <main ref={containerRef} className="flex-grow w-full py-6 md:py-12 md:py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                        {cards.map((card, index) => (
                            <Link
                                to={card.link}
                                key={index}
                                onMouseEnter={(e) => handleMouseEnter(e, card.theme)}
                                onMouseLeave={handleMouseLeave}
                                className={`get-started-card group relative flex flex-col justify-between p-6 md:p-8 lg:p-10 border-2 border-black transition-colors duration-300 min-h-[300px] md:min-h-[400px]
                                    ${card.theme === 'dark'
                                        ? 'bg-[#f0f2e9] text-black hover:bg-white'
                                        : 'bg-white text-black hover:bg-[#f0f2e9]'
                                    }`}
                            >
                                <div>
                                    <div className="card-icon mb-4 md:mb-6 origin-left inline-block">
                                        {React.cloneElement(card.icon, { className: "text-4xl md:text-5xl" })}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 leading-tight">
                                        {card.title}
                                    </h3>
                                    <p className="text-base md:text-lg leading-relaxed opacity-90 text-gray-600">
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-6 md:mt-10 flex items-center gap-3 text-sm md:text-base font-bold uppercase tracking-wider">
                                    <span>Get Started</span>
                                    <FaArrowRight className="card-arrow transform transition-transform duration-300" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GetStarted;
