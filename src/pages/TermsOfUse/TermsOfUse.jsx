import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);

const TermsOfUse = () => {
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const termsRef = useRef([]);

    const termsData = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing and using the 1iQ platform (\"Service\"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services."
        },
        {
            title: "2. Description of Service",
            content: "1iQ provides a comprehensive construction management platform integrating project intelligence, field coordination, and operational orchestration. You are responsible for obtaining access to the Service and that access may involve third party fees (such as Internet service provider or airtime charges)."
        },
        {
            title: "3. User Account",
            content: "To access certain features of the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete."
        },
        {
            title: "4. Privacy Policy",
            content: "Your use of the Service is also subject to our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices."
        },
        {
            title: "5. Intellectual Property",
            content: "The Service and its original content, features, and functionality are and will remain the exclusive property of 1iQ and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries."
        },
        {
            title: "6. Termination",
            content: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
        },
        {
            title: "7. Changes to Terms",
            content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect."
        },
        {
            title: "8. Contact Us",
            content: "If you have any questions about these Terms, please contact us at support@1iq.ai."
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate terms items
            termsRef.current.forEach((el, index) => {
                gsap.from(el, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    },
                    delay: index * 0.05
                });
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRef} className="app relative w-full overflow-x-hidden bg-white">
            {/* Navigation Component */}
            <Navigation heroRef={heroRef} />

            {/* Common Header Section */}
            <CommonHeader
                ref={heroRef}
                title="Terms of Use"
                text="Last Updated: November 19, 2025"
            />

            {/* Content Section */}
            <section className="terms-section relative w-full">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="grid grid-cols-1 gap-16 pb-12">
                        {termsData.map((term, index) => (
                            <div
                                key={index}
                                ref={el => termsRef.current[index] = el}
                                className="term-item grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 border-t border-gray-200 pt-12 hover:border-black transition-colors duration-300 group"
                            >
                                <div className="md:col-span-4">
                                    <h2 className="text-2xl md:text-3xl font-bold text-black group-hover:translate-x-2 transition-transform duration-300">
                                        {term.title}
                                    </h2>
                                </div>
                                <div className="md:col-span-8">
                                    <p className="text-lg md:text-xl text-neutral-600 leading-relaxed font-light">
                                        {term.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default TermsOfUse;
