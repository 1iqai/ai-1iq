import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import PortalButton from "../../components/Shared/PortalButton/PortalButton";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LearnMore = () => {
    const navigate = useNavigate();
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const missionRef = useRef(null);
    const ctaRef = useRef(null);
    const newsRef = useRef(null);

    // News data
    const [newsArticles, setNewsArticles] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.constructiondive.com%2Ffeeds%2Fnews');
                const data = await response.json();

                if (data.status === 'ok') {
                    const formattedNews = data.items.map(item => {
                        // Strip HTML tags and truncate description
                        const rawDescription = item.description || '';
                        const strippedDescription = rawDescription.replace(/<[^>]*>/g, '');
                        const description = strippedDescription.length > 100
                            ? strippedDescription.substring(0, 100) + '...'
                            : strippedDescription;

                        // Format date
                        const date = new Date(item.pubDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });

                        // Get image
                        const image = item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop';

                        return {
                            tag: 'Construction Dive',
                            title: item.title,
                            date: date,
                            description: description,
                            image: image,
                            link: item.link
                        };
                    });

                    // Ensure we only show multiples of 3 for the grid
                    const countToShow = formattedNews.length - (formattedNews.length % 3);
                    setNewsArticles(formattedNews.slice(0, countToShow));
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const sections = [missionRef.current, ctaRef.current].filter(Boolean);

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

            if (missionRef.current) {
                const opportunityCards = missionRef.current.querySelectorAll(".opportunity__card");
                if (opportunityCards.length) {
                    gsap.set(opportunityCards, { autoAlpha: 0, y: 40 });
                    gsap.to(opportunityCards, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: missionRef.current,
                            start: "top 92%",
                            once: true,
                        },
                    });
                }
            }
        }, pageRef);

        return () => ctx.revert();
    }, []);

    // Separate useEffect for news animations to handle async data
    useEffect(() => {
        if (newsArticles.length === 0) return;

        const ctx = gsap.context(() => {
            if (newsRef.current) {
                // Animate the section itself
                gsap.set(newsRef.current, { autoAlpha: 0, y: 60 });
                gsap.to(newsRef.current, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: newsRef.current,
                        start: "top 95%",
                        once: true,
                    },
                });

                // Animate cards
                const newsCards = newsRef.current.querySelectorAll(".news__card");
                if (newsCards.length) {
                    gsap.set(newsCards, { autoAlpha: 0, y: 35 });
                    gsap.to(newsCards, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: newsRef.current,
                            start: "top 95%",
                            once: true,
                        },
                    });
                }
            }
        }, newsRef);

        return () => ctx.revert();
    }, [newsArticles]);

    return (
        <div ref={pageRef} className="app relative w-full overflow-x-hidden">
            {/* Navigation Component */}
            <Navigation heroRef={heroRef} />

            {/* Common Header Section - Black Background */}
            <CommonHeader
                ref={heroRef}
                title="Developer Resources"
                text="Access technical documentation, industry insights, and integration opportunities for construction AI."
            />

            {/* Content Section - Dark dot grid background */}
            <section
                ref={contentRef}
                className="learn-more-content relative w-full bg-[#070707] text-white py-24 md:py-32 bg-dot-grid"
            >
                <div className="container mx-auto px-8">
                    <div ref={missionRef} className="text-center max-w-4xl mx-auto mb-24">
                        <h2 className="mission__title text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tight mb-12 font-space-grotesk">
                            Build The Future
                        </h2>

                        <div className="mission__content space-y-8">
                            <p className="mission__text text-neutral-400 text-xl md:text-2xl leading-relaxed font-light">
                                We're building the infrastructure layer that transforms fragmented construction data into intelligent, actionable systems at scale.
                            </p>

                            <div className="mission__opportunities grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
                                {/* Card 1: For Builders & Innovators */}
                                <div className="opportunity__card p-8 transition-all duration-300 flex justify-between flex-col h-full rounded-2xl" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                    <h3 className="opportunity__title text-2xl font-bold mb-3 text-white font-space-grotesk">For Developers & Engineers</h3>
                                    <p className="opportunity__subtitle text-lg mb-4 text-neutral-300 transition-colors duration-300">
                                        Building construction tech solutions? Exploring AI applications? Working on data infrastructure at scale?
                                    </p>
                                    <p className="opportunity__body text-base mb-6 text-neutral-400 leading-relaxed transition-colors duration-300">
                                        Join our developer ecosystem. Access early APIs, technical documentation, and collaborate with our engineering team.
                                    </p>
                                    <div className="mt-auto flex justify-center">
                                        <PortalButton
                                            label="Join Program"
                                            redirectTo="/builder-application"
                                            className="hero-portal-btn w-full"
                                            showDivider={false}
                                        />
                                    </div>
                                </div>

                                {/* Card 2: Career Opportunities */}
                                <div className="opportunity__card p-8 transition-all duration-300 flex justify-between flex-col h-full rounded-2xl" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                    <h3 className="opportunity__title text-2xl font-bold mb-3 text-white font-space-grotesk">Technical Partnerships</h3>
                                    <p className="opportunity__subtitle text-lg mb-4 text-neutral-300 transition-colors duration-300">
                                        Strategic integrations with construction software providers, data platforms, and AI infrastructure companies.
                                    </p>
                                    <p className="opportunity__body text-base mb-6 text-neutral-400 leading-relaxed transition-colors duration-300">
                                        Explore co-development opportunities, white-label solutions, and revenue-sharing partnerships.
                                    </p>
                                    <div className="mt-auto flex justify-center">
                                        <PortalButton
                                            label="Explore Partnerships"
                                            redirectTo="/partnership-inquiry"
                                            className="hero-portal-btn w-full"
                                            showDivider={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div ref={ctaRef} className="text-center max-w-2xl mx-auto mb-24">
                        <div className="cta__content space-y-6">
                            <h3 className="cta__title text-white text-3xl md:text-4xl font-bold leading-none font-space-grotesk">
                                Ready to Integrate?
                            </h3>

                            <p className="cta__text text-neutral-400 text-lg leading-relaxed">
                                Connect with our technical team to discuss API access, partnership opportunities, and implementation roadmaps.
                            </p>

                            <div className="cta__buttons flex flex-col sm:flex-row gap-6 justify-center">
                                <PortalButton
                                    label="Technical Demo"
                                    redirectTo="/schedule"
                                    showDivider={true}
                                    fullWidth
                                    className="cta__portal-btn"
                                />
                                <PortalButton
                                    label="Developer Program"
                                    redirectTo="/builder-application"
                                    showDivider={true}
                                    fullWidth
                                    className="cta__portal-btn"
                                />
                            </div>
                        </div>
                    </div>

                    {/* News Section */}
                    <div ref={newsRef} className="news__section mb-24">
                        <div className="border-t border-[rgba(255,255,255,0.08)] mb-12"></div>
                        {/* News Content */}
                        <div className="news__content">
                            <div className="news__controls mb-8">
                                <h3 className="news__headline text-2xl font-bold text-white font-space-grotesk">Latest Construction News</h3>
                            </div>

                            {/* News Articles Grid */}
                            <div className="news__articles grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {newsArticles.map((article, index) => (
                                    <article key={index} className="news__card p-6 transition-all duration-300 flex flex-col h-full rounded-2xl" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                        {/* Image */}
                                        <div className="mb-4 border border-[rgba(255,255,255,0.08)] overflow-hidden h-48 shrink-0 bg-gray-900 rounded-xl">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop';
                                                }}
                                            />
                                        </div>

                                        <div className="news__tag text-sm font-bold mb-3 uppercase tracking-wide text-[#0066ff] font-space-mono">
                                            {article.tag}
                                        </div>
                                        <h4 className="news__article-title text-lg font-bold mb-3 leading-tight text-white font-space-grotesk">
                                            {article.title}
                                        </h4>
                                        <div className="news__date text-sm mb-3 text-neutral-400">
                                            {article.date}
                                        </div>
                                        <p className="news__description text-sm leading-relaxed mb-4 text-neutral-400 flex-grow">
                                            {article.description}
                                        </p>
                                        <div className="mt-auto">
                                            <a
                                                href={article.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="news__read-more text-sm font-bold text-[#0066ff] hover:text-white underline hover:no-underline inline-block transition-colors"
                                            >
                                                Read More
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LearnMore;
