import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const MODULES = [
  {
    tag: "1iQ Core",
    imageSrc: "/assets/img/1iq_app_screenshots/1iq_core_new.jpeg",
    title: "Everything in one place. Always current.",
    description:
      "Budgets, schedules, team performance and milestones are all visible and live. 1iQ Core is the central command layer that connects every document, decision and data point across your project operation.",
    features: [
      "RFIs and submittals handled automatically, saving 208 hours per team member per year",
      "AI project chat answers any question about the job instantly",
      "Risk alerts flag cost overruns before they escalate",
      "Live dashboards replace the Friday report",
    ],
    screenshotAlt: "1iQ Core: central command dashboard",
  },
  {
    tag: "1iQ Field",
    imageSrc: "/assets/img/1iq_app_screenshots/1iq_field_mockup.png",
    title: "Field to office. Zero lag.",
    description:
      "What happens on site should not take 48 hours to reach the office. 1iQ Field brings live data from the field straight into the platform, so every decision is made on today's information, not last week's.",
    features: [
      "Field teams report once and the data flows into schedules and dashboards",
      "Every trade stays updated without phone calls or follow ups",
      "Progress is tracked against milestones without chasing subs",
      "Live updates cut idle time between trades across every phase",
    ],
    screenshotAlt: "1iQ Field: mobile field view",
  },
  {
    tag: "1iQ Intel",
    imageSrc: "/assets/img/1iq_app_screenshots/1iq_intel_new.jpeg",
    title: "Your weekly report. Written before you wake up.",
    description:
      "Every Monday, 1iQ Intel reads your dashboards and writes the executive summary: complete, accurate and ready to send. What used to take half a day takes nothing. It saves 182 hours a year for each project lead.",
    features: [
      "Report summaries replace manual PowerPoint and Excel work",
      "Analysis surfaces risks and opportunities across your portfolio",
      "Expected direct savings: $71,397 per project lead per year in recovered time and costs",
      "One source of truth replaces scattered tools with a single live system",
    ],
    screenshotAlt: "1iQ Intel: reporting dashboard",
  },
  {
    tag: "1iQ Gantt",
    imageSrc: "/assets/img/1iq_app_screenshots/1iq_grant.jpeg",
    title: "The schedule that keeps itself current.",
    description:
      "Field data flows straight into 1iQ Gantt. When something changes on site, 1iQ works out the new dates in 5 minutes and your PM approves them, instead of rebuilding the schedule over days.",
    features: [
      "Scheduling time drops from 336 hours a year to 4",
      "Delay detection flags critical path risks before they hit",
      "Date changes are worked out from live field data, ready for your PM to approve",
      "A 5 minute update replaces days of manual entry in P6 and MS Project",
    ],
    screenshotAlt: "1iQ Gantt: schedule view",
  },
];

/** Platform page, sheet P3: the four parts of 1iQ, one at a time. Arrow keys and swipes move between them. */
export default function PlatformSlider() {
  const [active, setActive] = useState(0);
  const box = useRef(null);
  const step = (d) => setActive((a) => (a + d + MODULES.length) % MODULES.length);

  useEffect(() => {
    const el = box.current;
    let x0 = null;
    const start = (e) => { x0 = e.changedTouches[0].clientX; };
    const end = (e) => {
      if (x0 === null) return;
      const d = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(d) >= 40) step(d < 0 ? 1 : -1);
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => { el.removeEventListener("touchstart", start); el.removeEventListener("touchend", end); };
  }, []);

  const onKey = (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  };

  const m = MODULES[active];

  return (
    <section className="d-sec" id="parts">
      <div className="sheetbar"><div className="wrap"><span>Sheet P3 · The four parts</span><span>Adopt together or by need</span></div></div>
      <div className="wrap">
        <div className="p-head reveal">
          <div className="ruler" />
          <h2 className="h2">One platform. Four capabilities.</h2>
          <p className="d-p">Adopt them together or roll out by need. Most teams start with Core and Intel, then add Field and Gantt as adoption grows.</p>
        </div>

        <div className="p-parts reveal" ref={box}>
          <div className="p-parts__tabs" role="tablist" aria-label="Parts of the platform" onKeyDown={onKey}>
            {MODULES.map((x, i) => (
              <button key={x.tag} type="button" role="tab" id={`part-tab-${i}`} aria-controls="part-panel" aria-selected={i === active} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)}>{x.tag}</button>
            ))}
          </div>
          <div className="p-part" role="tabpanel" id="part-panel" aria-labelledby={`part-tab-${active}`}>
            <div className="p-part__copy" key={m.tag}>
              <span className="k">{m.tag}</span>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <ul className="p-list">{m.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <Link to="/schedule" className="pill pill--blue">Book a demo</Link>
            </div>
            <div className="p-part__shot">
              <div className="p-frame" key={m.tag}>
                <div className="p-frame__bar"><span className="k">{m.tag}</span><span className="k">{String(active + 1).padStart(2, "0")} of 04</span></div>
                <img src={m.imageSrc} alt={m.screenshotAlt} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
          <div className="p-parts__foot">
            <span className="k">{String(active + 1).padStart(2, "0")} / 04 · {m.tag}</span>
            <div className="p-arrows">
              <button type="button" onClick={() => step(-1)} aria-label="Previous part">←</button>
              <button type="button" onClick={() => step(1)} aria-label="Next part">→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
