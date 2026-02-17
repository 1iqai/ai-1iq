import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PortalButton from "../PortalButton/PortalButton";
import "./BrandCarousel.scss";

const BRAND_LOGOS = [
    "/assets/img/brand_logos/Amazon_Logo.png",
    "/assets/img/brand_logos/Halifax_Logo.png",
    "/assets/img/brand_logos/JT_Services_Logo.png",
    "/assets/img/brand_logos/Kim_Kard_Logo.png",
    "/assets/img/brand_logos/Red_Bull_Logo.png",
    "/assets/img/brand_logos/Rick_Owens_Logo.png",
    "/assets/img/brand_logos/pngwing.com.png",
    "/assets/img/brand_logos/Superrior_Structures.jpg",
];

gsap.registerPlugin(ScrollTrigger);

const BrandCarousel = () => {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const trackRef = useRef(null);
    const marqueeTween = useRef(null);

    // Triple the items to ensure smooth looping even on wide screens
    const repeatedLogos = useMemo(
        () => [...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS],
        []
    );

    useEffect(() => {
        const track = trackRef.current;
        if (!track) {
            return undefined;
        }

        const createMarquee = () => {
            // Calculate the width of one set of items
            // We use 1/3 because we tripled the array
            const loopWidth = track.scrollWidth / 3;

            if (!loopWidth) {
                return;
            }

            gsap.set(track, { x: 0 });

            marqueeTween.current = gsap.to(track, {
                x: -loopWidth, // Move left by one full set width
                duration: 30, // Adjust speed as needed
                ease: "none",
                repeat: -1,
                modifiers: {
                    x: (value) => {
                        const numericValue = parseFloat(value);
                        if (Number.isNaN(numericValue)) {
                            return value;
                        }
                        // Wrap around logic
                        const progress = -numericValue % loopWidth;
                        return `${-progress}px`;
                    },
                },
            });
        };

        // Wait for images to load to get correct width
        // Simple timeout for now, but could use onLoad on images
        const timeoutId = setTimeout(createMarquee, 100);

        const handleResize = () => {
            marqueeTween.current?.kill();
            createMarquee();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            marqueeTween.current?.kill();
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    once: true,
                },
            });

            tl.from(headerRef.current, {
                y: 30,
                autoAlpha: 0,
                duration: 1,
            })
                .from(
                    trackRef.current,
                    {
                        y: 30,
                        autoAlpha: 0,
                        duration: 1,
                    },
                    "-=0.8"
                );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="brand-carousel pb-24 mb-24 pt-0 md:pt-8 mt-0">
            <div ref={headerRef} className="brand-carousel__header">
                <h2 className="header-title brand-carousel__heading">Trusted by Teams Across Industries</h2>
                <p className="header-subtitle brand-carousel__subheading">
                    From global brands to growing builders, 1iQ supports teams working on projects of every size.
                </p>
            </div>

            <div className="brand-carousel__viewport">
                <div className="brand-carousel__track" ref={trackRef}>
                    {repeatedLogos.map((logo, index) => (
                        <div className="brand-carousel__item" key={`${logo}-${index}`}>
                            <img src={logo} alt="Brand Logo" loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-10">
                <PortalButton
                    label="Speak to the team"

                    redirectTo="/contact-us"
                    showDivider={true}
                // className="cta__portal-btn"

                />
            </div>

        </section>
    );
};

export default BrandCarousel;
