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
            "title": "1. Who we are",
            "content": [
                "1iQ LLC, a Wyoming limited liability company (\"1iQ\", \"we\", \"us\"), provides the 1iQ platform: the web app at app.1iq.ai, the 1iQ mobile apps and this website (together, the \"Service\").",
                "This policy explains what information we collect, why we collect it, who we share it with and the choices you have. Questions go to admin@1iq.ai."
            ]
        },
        {
            "title": "2. Your company's data",
            "content": [
                "When a company uses 1iQ, that company controls the project information its people put into the Service: schedules, budgets, tasks, issues, comments, photos and files. We process that information on the company's behalf and under our agreement with it.",
                "If you use 1iQ through your employer, or because you were invited to a project, you can send questions about that project information to that company. We will help them answer you."
            ]
        },
        {
            "title": "3. What we collect",
            "content": [
                "Account information: your name, email address, phone number if you give one, company, role and profile photo.",
                "Project information that you or your team enter: project names and site addresses, schedules, budgets, change orders, draws, tasks and their progress, issues, comments, photos and files.",
                "Field activity: when a task is started, finished, checked or corrected in the mobile app, the time and who did it. The mobile app does not track your location. A project's location is the site address entered for the project.",
                "Connected services: if your company connects Procore, the schedule and budget information 1iQ reads from Procore and the access tokens needed to do so, which we store encrypted.",
                "Device and usage information: push notification tokens for your devices, browser and device type, log data such as IP address, pages visited, actions and times, and product analytics about how features are used.",
                "Messages you send us, such as support requests and contact or partnership forms."
            ]
        },
        {
            "title": "4. How we use it",
            "content": [
                "To provide and run the Service: schedules, forecasts, Site Watch alerts, budgets and draws, reports, notifications and the 1iQ assistant.",
                "To keep accounts and data secure: sign in, two step sign in, bot checks, rate limits and detecting misuse.",
                "To support you, to tell you about the Service, security and changes to these policies, and to improve the Service using aggregated usage information.",
                "To meet legal obligations.",
                "We do not sell personal information, and we do not share it for advertising."
            ]
        },
        {
            "title": "5. AI features",
            "content": [
                "The 1iQ assistant, the schedule generator, reports and other AI features send the project information needed for a request to our AI provider, Anthropic, to produce the answer. Under Anthropic's commercial terms, that information is not used to train its models. Anthropic may keep it for a limited period for safety and abuse monitoring.",
                "We do not use your company's data to train AI models. AI features suggest; they do not change a schedule unless a person approves the change."
            ]
        },
        {
            "title": "6. Public data services",
            "content": [
                "To show weather, site hazards, cost escalation and local news for a project, 1iQ sends the project's location (city or site address) to public data services such as MET Norway, NASA POWER, OpenStreetMap, the US Census geocoder, USGS, FEMA, ThinkHazard!, the World Bank and the IMF. We send the location only, not your name or your project details."
            ]
        },
        {
            "title": "7. Who we share it with",
            "content": [
                "Your company and the people on your projects, according to the roles your company gives them. For example, an owner given viewer access sees what the project manager shares.",
                "Service providers that run parts of the Service for us, who may use the information only to provide their service to us: Amazon Web Services (United States) for hosting, file storage, sign in and email; MongoDB Atlas (United States) for the database; Anthropic (United States) for AI features; Google Firebase (United States) for mobile push notifications; Cloudflare (United States) for bot checks at sign in; Amplitude (United States) for product analytics; Twilio SendGrid (United States) for email; and Procore (United States) only when your company connects it.",
                "Others when the law requires it, to protect the rights and safety of our users or the public, or as part of a merger, acquisition or sale of our business, in which case we will tell affected customers."
            ]
        },
        {
            "title": "8. Where it is stored and how we protect it",
            "content": [
                "We store data in the United States. If you use 1iQ from another country, your information is transferred to and processed in the United States.",
                "Data is encrypted in transit (TLS 1.2 or higher) and at rest. Each company's data is kept separate from other companies', access follows each person's role, administrators can use two step sign in, and the database is backed up every night to encrypted storage.",
                "No system is perfectly secure. If a breach affects your information, we will notify the affected customers as the law requires."
            ]
        },
        {
            "title": "9. How long we keep it",
            "content": [
                "We keep account and project information while your company's account is active. When a company closes its account or asks us to, we delete its project information within 90 days, except copies in backups, which expire on their own within 35 days, and anything the law requires us to keep.",
                "Log data is kept for a limited period for security and troubleshooting."
            ]
        },
        {
            "title": "10. Your choices and rights",
            "content": [
                "You can update your profile in the Service at any time, and you can delete your account from the mobile app or by writing to us. You can ask us for a copy of your personal information, or ask us to correct or delete it, by writing to admin@1iq.ai. For project information your company controls, we will work with your company to respond. We will confirm your identity before acting on a request.",
                "California residents have the right to know what personal information we collect and how we use and share it, and to request access, correction and deletion. We do not sell or share personal information for advertising and do not use sensitive personal information beyond providing the Service. We will not treat you differently for using these rights. You may use an authorized agent.",
                "If you are in the European Economic Area, the United Kingdom or Brazil, you also have rights under the GDPR, the UK GDPR or the LGPD, including the right to object and to complain to your data protection authority. We rely on our contract with your company, our legitimate interest in running and securing the Service, your consent where we ask for it, and legal obligations.",
                "We answer requests within 45 days, or sooner where the law requires."
            ]
        },
        {
            "title": "11. Cookies",
            "content": [
                "We use essential cookies to keep you signed in securely; the Service does not work without them. We use product analytics to understand which features are used. We do not use advertising cookies. You can control cookies in your browser settings."
            ]
        },
        {
            "title": "12. Children",
            "content": [
                "The Service is for businesses and is not directed to children under 16. We do not knowingly collect their personal information."
            ]
        },
        {
            "title": "13. Changes to this policy",
            "content": [
                "We will post any change on this page with a new date. If a change is significant, we will tell customers by email or in the Service before it takes effect."
            ]
        },
        {
            "title": "14. Contact us",
            "content": [
                "1iQ LLC, admin@1iq.ai"
            ]
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
        <div ref={pageRef} className="app relative w-full overflow-x-hidden bg-[#070707] text-white bg-mesh-grid">
            {/* Navigation Component */}
            <Navigation heroRef={heroRef} />

            {/* Common Header Section */}
            <CommonHeader
                ref={heroRef}
                title="Privacy Policy"
                text="Last updated: November 11, 2026"
            />

            {/* Content Section */}
            <section className="policies-section relative w-full py-12">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="grid grid-cols-1 gap-16 pb-12">
                        {policiesData.map((policy, index) => (
                            <div
                                key={index}
                                ref={el => policiesRef.current[index] = el}
                                className="policy-item grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 border-t border-[rgba(255,255,255,0.08)] pt-12 hover:border-white transition-colors duration-300 group"
                            >
                                <div className="md:col-span-4">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white font-space-grotesk group-hover:translate-x-2 transition-transform duration-300">
                                        {policy.title}
                                    </h2>
                                </div>
                                <div className="md:col-span-8">
                                    {(policy.content || []).map((para, i) => (
                                        <p key={i} className="text-lg md:text-xl text-neutral-400 leading-relaxed font-light mb-5 last:mb-0">
                                            {para}
                                        </p>
                                    ))}
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
