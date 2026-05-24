import React from "react";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import "./GetStarted.scss";
import { useRef } from "react";

/* ── SVG Icons ── */
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const HandshakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 21l7.65-7.99.77-.78a5.4 5.4 0 0 0 0-7.65z"/>
  </svg>
);

const ToolsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const cards = [
  {
    id: "schedule-demo",
    icon: <CalendarIcon />,
    title: "Technical Demo",
    description: "Deep dive into 1iQ's AI architecture. Book a technical session with our engineering team.",
    cta: "BOOK DEMO →",
    href: "/schedule",
    external: false,
  },
  {
    id: "partnership-inquiry",
    icon: <HandshakeIcon />,
    title: "Strategic Partnership",
    description: "Explore integration opportunities. Build the future of construction intelligence with us.",
    cta: "EXPLORE PARTNERSHIP →",
    href: "/partnership-inquiry",
    external: false,
  },
  {
    id: "builder-application",
    icon: <ToolsIcon />,
    title: "Developer Program",
    description: "Join our early access program. Get SDK access, technical documentation, and dedicated support.",
    cta: "APPLY NOW →",
    href: "/builder-application",
    external: false,
  },
];

const GetStarted = () => {
  const heroRef = useRef(null);

  return (
    <div className="get-started-page">
      <Navigation heroRef={heroRef} />

      <CommonHeader
        ref={heroRef}
        title="Developer Access"
        text="Choose your integration path to 1iQ's AI infrastructure platform."
      />

      <main className="get-started-cards">
        {cards.map((card) =>
          card.external ? (
            <a
              key={card.id}
              id={card.id}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="gs-card"
            >
              <div className="gs-card__icon">{card.icon}</div>
              <h2 className="gs-card__title">{card.title}</h2>
              <p className="gs-card__desc">{card.description}</p>
              <span className="gs-card__cta">{card.cta}</span>
            </a>
          ) : (
            <a
              key={card.id}
              id={card.id}
              href={card.href}
              className="gs-card"
            >
              <div className="gs-card__icon">{card.icon}</div>
              <h2 className="gs-card__title">{card.title}</h2>
              <p className="gs-card__desc">{card.description}</p>
              <span className="gs-card__cta">{card.cta}</span>
            </a>
          )
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GetStarted;
