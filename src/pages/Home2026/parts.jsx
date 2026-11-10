import { useEffect, useRef, useState } from "react";

export const BOOK = "/schedule";
export const SIGN_IN = "https://app.1iq.ai/login";

/** The 1iQ logo: dark on stone, white on charcoal. */
export const Logo = ({ height = 28 }) => (
  <picture>
    <source srcSet="/1iQ-White.webp" media="(prefers-color-scheme: dark)" />
    <img src="/1iQ.webp" alt="1iQ" style={{ height, width: "auto", display: "block" }} />
  </picture>
);

/** Adds .is-in to the element the first time it scrolls into view (reveal and rising tower). */
export function useSeen(threshold = 0.35) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

/** Types the briefing sentence once, a few characters at a time; reduced motion shows it whole. */
export function useTyped(text, start = true, cps = 38) {
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (reduce || !start) return;
    let i = 0;
    const id = setInterval(() => { i += 1; setN(i); if (i >= text.length) clearInterval(id); }, 1000 / cps);
    return () => clearInterval(id);
  }, [text, start, cps, reduce]);
  return text.slice(0, n);
}

/* ------------------------------------------------------------------ product cards (drawn from the app) */

export const PhoneCard = () => (
  <div className="h26-phone" aria-label="1iQ field app on a phone">
    <div className="h26-phone__notch" />
    <div className="h26-push">
      <div className="h26-push__app"><span className="h26-dot" />1iQ</div>
      <div className="h26-push__title">Locker Rooms: today</div>
      <div className="h26-push__body">2 to start today, 1 sent back to fix.</div>
    </div>
    <div className="h26-task">
      <div className="h26-task__name">Tile, men's showers</div>
      <div className="h26-task__meta">Building 1 · Floor 1 · due Thu</div>
      <div className="h26-task__btns">
        <span className="h26-btn h26-btn--go">Start</span>
        <span className="h26-btn h26-btn--quiet">Report issue</span>
      </div>
    </div>
    <div className="h26-task h26-task--dim">
      <div className="h26-task__name">Partitions, women's room</div>
      <div className="h26-task__meta">Starts Wed</div>
    </div>
  </div>
);

export const HoldCard = () => (
  <div className="h26-card h26-stack" aria-label="An issue holds a task and the finish date moves">
    <div className="h26-row">
      <span className="h26-chip h26-chip--late">On hold · High</span>
      <span className="h26-muted">9:12 AM</span>
    </div>
    <div className="h26-strong">Shower drain slope is wrong</div>
    <div className="h26-muted">Tile, men's showers · photo attached by the field</div>
    <div className="h26-sep" />
    <div className="h26-row">
      <span className="h26-chip h26-chip--watch">Site Watch</span>
      <span className="h26-muted">Rain Thu and Fri on the critical path</span>
    </div>
    <div className="h26-sep" />
    <div className="h26-finish">
      <div><div className="h26-label">Planned finish</div><div className="h26-num">Jul 27</div></div>
      <div className="h26-arrow" aria-hidden="true">→</div>
      <div><div className="h26-label">Forecast</div><div className="h26-num h26-late">Aug 3</div></div>
      <div className="h26-finish__cost"><div className="h26-label">Each lost day</div><div className="h26-num">$276</div></div>
    </div>
  </div>
);

export const SignOffCard = () => (
  <div className="h26-card h26-stack" aria-label="Check work list with PM sign-off">
    <div className="h26-row"><span className="h26-strong">Check work</span><span className="h26-badge">3</span></div>
    {[
      ["Rough plumbing, men's room", "Checked by Eli, field lead", true],
      ["Demolition, women's room", "Checked by Eli, field lead", true],
      ["Electrical rough in", "Finished by Delta Electric", false],
    ].map(([name, who, lead]) => (
      <div className="h26-check" key={name}>
        <div>
          <div className="h26-strong h26-small">{name}</div>
          <div className={lead ? "h26-good h26-xs" : "h26-muted h26-xs"}>{who}</div>
        </div>
        <span className="h26-btn h26-btn--go h26-btn--sm">Sign off</span>
      </div>
    ))}
  </div>
);

export const PayAppCard = () => (
  <div className="h26-card h26-stack" aria-label="Pay application emailed as a PDF">
    <div className="h26-mail">
      <div className="h26-muted h26-xs">To: owner@developer.com</div>
      <div className="h26-strong">Harbor Lofts: Pay Application No. 2 ($34,325.00)</div>
      <div className="h26-muted h26-small">The full breakdown is attached as a PDF.</div>
    </div>
    <div className="h26-pdf">
      <div className="h26-pdf__icon">PDF</div>
      <div>
        <div className="h26-strong h26-small">Harbor_Lofts_Pay_Application_2.pdf</div>
        <div className="h26-muted h26-xs">Application for Payment · Continuation Sheet</div>
      </div>
    </div>
    <div className="h26-lines">
      {[["Mobilization", "100%"], ["Demolition and site prep", "82%"], ["General conditions", "17%"]].map(([n, p]) => (
        <div className="h26-line" key={n}>
          <span className="h26-small">{n}</span>
          <span className="h26-bar"><span style={{ width: p }} /></span>
          <span className="h26-small h26-num">{p}</span>
        </div>
      ))}
    </div>
  </div>
);

export const ViewerCard = () => (
  <div className="h26-card h26-stack" aria-label="Read-only Viewer seat for a lender">
    <div className="h26-row"><span className="h26-strong">Harbor Lofts</span><span className="h26-chip">Viewer · read only</span></div>
    <div className="h26-kpis">
      <div><div className="h26-label">Work done</div><div className="h26-num h26-big">62.5%</div></div>
      <div><div className="h26-label">Forecast finish</div><div className="h26-num h26-big h26-late">Aug 3</div></div>
      <div><div className="h26-label">Earned to date</div><div className="h26-num h26-big">$50,000</div></div>
    </div>
    <div className="h26-curve" aria-hidden="true">
      <svg viewBox="0 0 300 70" preserveAspectRatio="none">
        <path d="M0 66 L60 58 L110 46 L170 34 L230 22 L300 8" className="h26-curve__plan" />
        <path d="M0 66 L60 60 L110 52 L170 44 L230 40" className="h26-curve__actual" />
      </svg>
    </div>
    <div className="h26-muted h26-xs">Overview, Gantt, Site Watch and reports. No draws, nothing to change.</div>
  </div>
);
