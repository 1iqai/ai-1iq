import { useState, useEffect, useCallback } from "react";

// ─── Module data ──────────────────────────────────────────────────────────────
const MODULES = [
  {
    tag: "1iQ Core",
    imageSrc: "/assets/img/1iq_app_screenshots/1iq_core_new.jpeg",
    title: "Everything in One Place. Always Current.",
    description:
      "Budgets, schedules, team performance, milestones — all visible, all live. 1iQ Core is the central command layer that connects every document, decision, and data point across your project operation.",
    features: [
      "RFIs and submittals handled automatically — saves 208 hours per PM per year",
      "AI project chat answers any question about the job instantly",
      "Predictive risk alerts flag cost overruns before they escalate",
      "Live dashboards replace the Friday report with real-time visibility",
    ],
    screenshotAlt: "1iQ Core — Central Command Dashboard",
  },
  {
    tag: "1iQ Field",
    imageSrc: "/assets/img/1iq_app_screenshots/1iq_field_mockup.png",
    title: "Field to Office. Zero Lag.",
    description:
      "What happens on site shouldn't take 48 hours to reach the office. 1iQ Field syncs real-time data from the field directly into the platform — so every decision gets made on today's information, not last week's.",
    features: [
      "Field teams report once — data flows automatically into schedules and dashboards",
      "Mobile sync keeps every trade updated without phone calls or follow-ups",
      "Automated progress tracking monitors milestones without chasing subs",
      "Live updates eliminate idle time between trades across all project phases",
    ],
    screenshotAlt: "1iQ Field — Mobile Field Sync Interface",
  },
  {
    tag: "1iQ Intel",
    imageSrc: "/assets/img/1iq_app_screenshots/1iq_intel_new.jpeg",
    title: "Your Weekly Report. Written Before You Wake Up.",
    description:
      "Every Monday, 1iQ Intel reads your dashboards and writes the executive summary — complete, accurate, ready to send. What used to take half a day takes nothing. Saves 182 hours a year, per PM.",
    features: [
      "Automated report summarization replaces manual PowerPoint and Excel work",
      "AI-powered analysis surfaces risks and opportunities across your portfolio",
      "Expected direct savings: $71,397 per PM per year in recovered time and costs",
      "One source of truth — replaces fragmented tools with a single live system",
    ],
    screenshotAlt: "1iQ Intel — Automated Reporting Dashboard",
  },
  {
    tag: "1iQ Gantt",
    imageSrc: "/assets/img/1iq_app_screenshots/1iq_grant.jpeg",
    title: "The Schedule That Runs Itself.",
    description:
      "Field data flows directly into 1iQ Gantt. When something changes on site, the schedule reflects it automatically — complete and accurate in 5 minutes, not rebuilt over days.",
    features: [
      "Drops scheduling time from 336 hours a year down to 4",
      "Predictive delay detection flags critical path risks before they hit",
      "Dynamic timeline adjustments based on live field data — no manual input",
      "5-minute schedule updates replace days of manual P6 and MS Project entry",
    ],
    screenshotAlt: "1iQ Gantt — AI Schedule Generator",
  },
];

// ─── Screenshot placeholder ───────────────────────────────────────────────────
function ScreenshotPlaceholder({ alt, src }) {
  return (
    <div className="ps-screenshot">
      <div className="ps-screenshot__browser">
        <div className="ps-screenshot__bar">
          <span className="ps-screenshot__dot" />
          <span className="ps-screenshot__dot" />
          <span className="ps-screenshot__dot" />
          <div className="ps-screenshot__url" />
        </div>
        <div className="ps-screenshot__content">
          {src ? (
            <img src={src} alt={alt} className="ps-screenshot__img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div className="ps-screenshot__placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p>Screenshot coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PlatformSlider() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("right");

  const goTo = useCallback(
    (index) => {
      if (index === active || animating) return;
      setDirection(index > active ? "right" : "left");
      setAnimating(true);
      setTimeout(() => {
        setActive(index);
        setAnimating(false);
      }, 200);
    },
    [active, animating]
  );

  const prev = () => goTo(active === 0 ? MODULES.length - 1 : active - 1);
  const next = () => goTo(active === MODULES.length - 1 ? 0 : active + 1);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, animating]);

  const module = MODULES[active];

  return (
    <section className="platform-slider">
      <div className="platform-slider__inner">

        {/* Section header */}
        <div className="platform-slider__header">
          <p className="platform-slider__eyebrow">THE PLATFORM</p>
          <h2 className="platform-slider__title">One Platform. Four Capabilities.</h2>
          <p className="platform-slider__subtitle">
            Adopt together or roll out by need. Most teams start with Core and Intel,
            then add Field and Gantt as adoption grows.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="platform-slider__tabs" role="tablist">
          {MODULES.map((m, i) => (
            <button
              key={m.tag}
              role="tab"
              aria-selected={i === active}
              className={`ps-tab ${i === active ? "ps-tab--active" : ""}`}
              onClick={() => goTo(i)}
            >
              {m.tag}
            </button>
          ))}
        </div>

        {/* Slide */}
        <div
          className={`platform-slider__slide ${animating ? `platform-slider__slide--exit-${direction}` : "platform-slider__slide--enter"}`}
        >
          {/* Left: copy */}
          <div className="ps-copy">
            <span className="ps-copy__tag">{module.tag}</span>
            <h3 className="ps-copy__title">{module.title}</h3>
            <p className="ps-copy__desc">{module.description}</p>
            <ul className="ps-copy__features">
              {module.features.map((f, i) => (
                <li key={i} className="ps-copy__feature">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ps-copy__check">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="https://calendly.com/ck-1iq/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="ps-copy__cta"
            >
              Book a Demo
            </a>
          </div>

          {/* Right: screenshot */}
          <ScreenshotPlaceholder alt={module.screenshotAlt} src={module.imageSrc} />
        </div>

        {/* Navigation controls */}
        <div className="platform-slider__controls">
          <button className="ps-arrow ps-arrow--prev" onClick={prev} aria-label="Previous module">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div className="ps-dots">
            {MODULES.map((m, i) => (
              <button
                key={i}
                className={`ps-dot ${i === active ? "ps-dot--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to ${m.tag}`}
              />
            ))}
          </div>

          <button className="ps-arrow ps-arrow--next" onClick={next} aria-label="Next module">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
