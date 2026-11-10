import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skyline from "./Skyline";
import Exposure from "./Exposure";
import { BOOK, SIGN_IN, Logo, useSeen, useTyped, PhoneCard, HoldCard, SignOffCard, PayAppCard, ViewerCard } from "./parts";
import "./home2026.css";

/**
 * 1iq.ai home page (Nov 2026 rebuild). One story, "a week on your project", in the product's own
 * look: warm stone, royal blue, Manrope, and the wireframe towers from the app's sign-in page.
 * Plan: "1iQ Website Rebuild Plan" doc. No dashes in the copy.
 */

const BRIEFING = "Harbor Lofts will finish Aug 3, 7 days late, because rough plumbing is 5 days overdue. Each further day costs about $276.";

const SiteNav = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="h26-nav">
      <div className="h26-wrap h26-nav__in">
        <a href="#top" className="h26-nav__logo" aria-label="1iQ home"><Logo height={26} /></a>
        <nav className={`h26-nav__links${open ? " is-open" : ""}`} aria-label="Main">
          <a href="#week" onClick={close}>How it works</a>
          <a href="#estimate" onClick={close}>Estimate</a>
          <a href="#lenders" onClick={close}>For lenders and investors</a>
          <a href={SIGN_IN} onClick={close}>Sign in</a>
          <Link to={BOOK} className="h26-btn h26-btn--primary h26-btn--sm" onClick={close}>Book a briefing</Link>
        </nav>
        <button type="button" className="h26-nav__menu" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
};

const Hero = () => {
  const [ref, seen] = useSeen(0.2);
  const typed = useTyped(BRIEFING, seen);
  return (
    <section className="h26-hero" id="top" ref={ref}>
      <Skyline />
      <div className="h26-wrap h26-hero__in">
        <p className="h26-eyebrow">Development intelligence</p>
        <h1 className="h26-h1">Know where your project stands before your GC tells you.</h1>
        <p className="h26-lead">1iQ turns every task your field team starts, flags and finishes into a plain answer on finish date, cost and risk. Built for developers, family offices and private equity.</p>
        <div className="h26-ctas">
          <Link to={BOOK} className="h26-btn h26-btn--primary">Book a 30 minute briefing</Link>
          <a href="#estimate" className="h26-btn h26-btn--ghost">Estimate your exposure</a>
        </div>
        <div className="h26-card h26-briefing" aria-label={`1iQ briefing, example project: ${BRIEFING}`}>
          <div className="h26-briefing__label"><span className="h26-dot" />1iQ briefing · example project · updated this morning</div>
          <p className="h26-briefing__text" aria-hidden="true">
            {/* the whole sentence holds the space, so nothing moves while it types */}
            <span className="h26-briefing__ghost">{BRIEFING}</span>
            <span className="h26-briefing__typed">{typed}<span className="h26-caret" /></span>
          </p>
        </div>
      </div>
    </section>
  );
};

const Reveal = ({ as: Tag = "div", className = "", children, ...rest }) => {
  const [ref, seen] = useSeen(0.2);
  return <Tag ref={ref} className={`h26-reveal${seen ? " is-in" : ""} ${className}`} {...rest}>{children}</Tag>;
};

const Gap = () => (
  <section className="h26-section">
    <div className="h26-wrap">
      <Reveal as="h2" className="h26-h2 h26-narrow">Most owners steer by a report that is two weeks old.</Reveal>
      <div className="h26-grid3">
        {[
          ["Late", "GC reports reach you two to four weeks after the work they describe."],
          ["Filtered", "Every update passes through someone with a reason to soften it."],
          ["Scattered", "Budget in a spreadsheet, schedule in another tool, field notes in email."],
        ].map(([t, d], i) => (
          <Reveal key={t} className="h26-card h26-gapcard" style={{ transitionDelay: `${i * 90}ms` }}>
            <div className="h26-gapcard__t">{t}</div>
            <p>{d}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const BEATS = [
  { day: "Monday", title: "The field reports itself.", text: "The crew taps Start on their phone. 1iQ knows before anyone writes a report, and each person gets one morning alert with what is theirs today.", card: <PhoneCard />, floors: [0, 5] },
  { day: "Wednesday", title: "A problem shows up the day it happens.", text: "A High issue puts the task on hold. Site Watch flags rain on the critical path. You see the new finish date and what each lost day costs, the same morning.", card: <HoldCard />, floors: [5, 10] },
  { day: "Friday", title: "Nothing counts until the PM signs off.", text: "Finished work goes to Check work. The field lead checks it, the PM signs it off. Every task ends with the PM.", card: <SignOffCard />, floors: [10, 14] },
  { day: "Month end", title: "The pay application builds itself.", text: "The draw is built from signed off work and lands in the owner's inbox as a PDF, line by line.", card: <PayAppCard />, floors: [14, 18] },
  { day: "Every day", title: "Your lender sees what you see.", text: "Give a lender or investor a Viewer seat: read only, no draws, the same live truth you see.", card: <ViewerCard />, floors: [18, 22], id: "lenders" },
];
const FLOORS = 22;

const Beat = ({ b, i, onSeen }) => {
  const [ref, seen] = useSeen(0.45);
  useEffect(() => { if (seen) onSeen(i); }, [seen, i, onSeen]);
  return (
    <article ref={ref} id={b.id} className={`h26-beat h26-reveal${seen ? " is-in" : ""}`}>
      <div className="h26-beat__copy">
        <p className="h26-eyebrow">{b.day}</p>
        <h3 className="h26-h3">{b.title}</h3>
        <p className="h26-body">{b.text}</p>
      </div>
      <div className="h26-beat__card">{b.card}</div>
    </article>
  );
};

/** A slim tower beside the story: each beat lights its band of floors as it scrolls in. */
const RisingTower = ({ lit }) => (
  <div className="h26-rise" aria-hidden="true">
    <div className="h26-rise__crane" />
    <div className="h26-rise__tower">
      {Array.from({ length: FLOORS }, (_, f) => FLOORS - 1 - f).map((f) => {
        const beat = BEATS.findIndex((b) => f >= b.floors[0] && f < b.floors[1]);
        return <span key={f} className={`h26-rise__floor${beat <= lit ? " is-lit" : ""}${beat === lit ? " is-now" : ""}`} />;
      })}
    </div>
    <div className="h26-rise__days">
      {BEATS.map((b, i) => <span key={b.day} className={i <= lit ? "is-lit" : ""}>{b.day}</span>)}
    </div>
  </div>
);

const Week = () => {
  const [lit, setLit] = useState(-1);
  const onSeen = (i) => setLit((v) => Math.max(v, i));
  return (
    <section className="h26-section h26-week" id="week">
      <div className="h26-wrap">
        <Reveal className="h26-narrow">
          <p className="h26-eyebrow">How it works</p>
          <h2 className="h26-h2">A week on your project with 1iQ.</h2>
        </Reveal>
        <div className="h26-week__grid">
          <RisingTower lit={lit} />
          <div className="h26-week__beats">
            {BEATS.map((b, i) => <Beat key={b.day} b={b} i={i} onSeen={onSeen} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

const Feasibility = () => (
  <section className="h26-section">
    <div className="h26-wrap h26-feas">
      <Reveal className="h26-feas__copy">
        <p className="h26-eyebrow">Before you commit capital</p>
        <h2 className="h26-h2">Feasibility in minutes, not months.</h2>
        <p className="h26-body">1iQ builds the schedule, trade sequence and risk picture for a site in any market before you commit capital, and updates it as you change the plan.</p>
      </Reveal>
      <Reveal className="h26-card h26-compare" aria-label="Consultant study compared with 1iQ">
        <div className="h26-compare__head"><span /><span>Consultant study</span><span className="h26-blue">1iQ</span></div>
        {[
          ["Cost", "$50,000 to $200,000", "Part of your plan"],
          ["Time", "8 to 12 weeks", "Minutes"],
          ["Basis", "One consultant's opinion", "Calibrated to your market"],
          ["After it's done", "A static PDF", "Updates as the plan changes"],
        ].map(([k, a, b]) => (
          <div className="h26-compare__row" key={k}><span className="h26-label">{k}</span><span>{a}</span><span className="h26-strong">{b}</span></div>
        ))}
      </Reveal>
    </div>
  </section>
);

const Estimate = () => (
  <section className="h26-section h26-band" id="estimate">
    <div className="h26-wrap">
      <Reveal className="h26-narrow">
        <p className="h26-eyebrow">Estimate your exposure</p>
        <h2 className="h26-h2">What is a slip worth on your next project?</h2>
        <p className="h26-body">Set the basics. The estimate uses typical delays and overruns for your asset class, and every figure adds up.</p>
      </Reveal>
      <Exposure />
    </div>
  </section>
);

const Proof = () => (
  <section className="h26-section">
    <div className="h26-wrap h26-proof">
      <Reveal className="h26-proof__line">
        <p className="h26-eyebrow">In use today</p>
        <p className="h26-h3">Running on Halifax Construction &amp; Development projects in Southern California.</p>
      </Reveal>
      <div className="h26-grid4">
        {[
          ["Syncs with Procore", "Tasks and updates flow both ways. No double entry."],
          ["Works in any country", "Local working days, weather, news and costs for each site, from Los Angeles to Salvador."],
          ["One app for the field", "iPhone and Android. Big buttons: Start, Report issue, Finish."],
          ["A seat for everyone", "Owner, PM, field lead, crew, and read only Viewer for lenders."],
        ].map(([t, d], i) => (
          <Reveal key={t} className="h26-fit" style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="h26-strong">{t}</div>
            <p className="h26-small h26-muted">{d}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Close = () => (
  <section className="h26-close">
    <div className="h26-wrap h26-close__in">
      <h2 className="h26-h2">See your own project in 1iQ.</h2>
      <p className="h26-body">A 30 minute briefing on one of your projects. No commitment.</p>
      <Link to={BOOK} className="h26-btn h26-btn--primary">Book a briefing</Link>
    </div>
  </section>
);

const SiteFooter = () => (
  <footer className="h26-footer">
    <div className="h26-wrap h26-footer__in">
      <div className="h26-footer__brand">
        <Logo height={24} />
        <p className="h26-small h26-muted">Development intelligence for real estate developers, family offices and private equity.</p>
      </div>
      <nav className="h26-footer__links" aria-label="Footer">
        <Link to="/platform">Platform</Link>
        <Link to={BOOK}>Book a briefing</Link>
        <a href={SIGN_IN}>Sign in</a>
        <Link to="/terms-of-use">Terms</Link>
        <Link to="/privacy-policy">Privacy</Link>
      </nav>
      <div className="h26-small h26-muted h26-footer__addr">
        <span className="h26-select">admin@1iq.ai</span><br />312 W. 2nd St, #1931, Casper, WY 82601
      </div>
    </div>
  </footer>
);

const Home2026 = () => {
  // the page's own background (the rest of the site is dark)
  useEffect(() => {
    document.body.classList.add("h26-body-bg");
    return () => document.body.classList.remove("h26-body-bg");
  }, []);
  return (
    <div className="h26">
      <SiteNav />
      <main>
        <Hero />
        <Gap />
        <Week />
        <Feasibility />
        <Estimate />
        <Proof />
        <Close />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Home2026;
