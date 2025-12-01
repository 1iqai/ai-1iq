import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy = () => {
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const policiesRef = useRef([]);

    const policiesData = [
        {
            title: "1. Information Collection",
            content: "We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, phone number, and company information."
        },
        {
            title: "2. Use of Information",
            content: "We use the information we collect to provide, maintain, and improve our services, to process your transactions, to send you technical notices and support messages, and to communicate with you about products, services, offers, and events."
        },
        {
            title: "3. Data Sharing",
            content: "We do not share your personal information with third parties except as described in this policy. We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf."
        },
        {
            title: "4. Data Security",
            content: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. We use industry-standard encryption and security protocols."
        },
        {
            title: "5. User Rights",
            content: "You have the right to access, correct, or delete your personal information. You may also object to the processing of your personal information or request that we restrict the processing of your personal information."
        },
        {
            title: "6. Cookies and Tracking",
            content: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
        },
        {
            title: "7. Third-Party Links",
            content: "Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit."
        },
        {
            title: "8. Contact Us",
            content: "If you have any questions about this Privacy Policy, please contact us at privacy@1iq.ai."
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate policy items
            policiesRef.current.forEach((el, index) => {
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
                title="Privacy Policy"
                text="Last Updated: November 19, 2025"
            />

            {/* Content Section */}
            <section className="policies-section relative w-full">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="grid grid-cols-1 gap-16 pb-12">
                        {policiesData.map((policy, index) => (
                            <div
                                key={index}
                                ref={el => policiesRef.current[index] = el}
                                className="policy-item grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 border-t border-gray-200 pt-12 hover:border-black transition-colors duration-300 group"
                            >
                                <div className="md:col-span-4">
                                    <h2 className="text-2xl md:text-3xl font-bold text-black group-hover:translate-x-2 transition-transform duration-300">
                                        {policy.title}
                                    </h2>
                                </div>
                                <div className="md:col-span-8">
                                    <p className="text-lg md:text-xl text-neutral-600 leading-relaxed font-light">
                                        {policy.content}
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

export default PrivacyPolicy;
