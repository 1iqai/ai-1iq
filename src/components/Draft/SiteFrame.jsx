import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * The home page's own banner and footer, rebuilt for the React pages so the whole site shares one frame.
 *
 * The home page is a hand written markup.html with its own header, so every other page used to carry a
 * different one: a different nav, two buttons instead of three and no Ask box. Nothing looked broken on
 * any single page, but moving between them felt like crossing between two websites.
 *
 * Everything here mirrors src/pages/Home2026/site/markup.html, class for class, so both are styled by the
 * same rules in site.css. The only deliberate differences are the ones a subpage forces: section links are
 * prefixed with "/" so they return to the home page, and the logo is the dark one on its own, because the
 * light-to-dark flip is driven by the home page's scroll script, which does not run here.
 *
 * Keep this in step with markup.html. If the nav changes in one, change it in the other.
 */

/** Matches the home page banner. A chevron means the link scrolls that page; these all leave, so none has one. */
const NAV = [
  ["/#platform", "Platform"],
  ["/#ways", "Solutions"],
  ["/#agents", "Agents"],
  ["/pricing", "Pricing"],
];

/** The field app's store listings. Checked live before they went on the site. */
export const APP_STORE = "https://apps.apple.com/us/app/id6755146159";
export const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.oneiq";

const ASK_QUESTIONS = [
  "When will Harbor Lofts finish?",
  "What is late this week?",
  "What does a lost day cost?",
  "Which draws are waiting?",
];

/**
 * The Ask box. On the home page this is theatre: the placeholder types a question out, and asking anything
 * returns the same line about booking a briefing. No request is made. Rebuilt here so the banner is the
 * banner everywhere, rather than the home page getting a feature the rest of the site lacks.
 */
const Ask = () => {
  const [placeholder, setPlaceholder] = useState("Ask 1iQ");
  const [answer, setAnswer] = useState("");
  const [value, setValue] = useState("");
  const box = useRef(null);
  const live = useRef({ qi: 0, qn: 0, hold: 0, focused: false });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const t = setInterval(() => {
      const s = live.current;
      if (s.focused || s.typed) return;
      if (s.hold > 0) { s.hold -= 1; return; }
      const q = ASK_QUESTIONS[s.qi];
      s.qn += 1;
      setPlaceholder(`Ask 1iQ · ${q.slice(0, s.qn)}`);
      if (s.qn >= q.length) { s.hold = 28; s.qn = 0; s.qi = (s.qi + 1) % ASK_QUESTIONS.length; }
    }, 60);
    return () => clearInterval(t);
  }, []);

  // clicking anywhere else puts the answer away, as it does on the home page
  useEffect(() => {
    if (!answer) return undefined;
    const away = (e) => { if (box.current && !box.current.contains(e.target)) setAnswer(""); };
    document.addEventListener("click", away);
    return () => document.removeEventListener("click", away);
  }, [answer]);

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim() || ASK_QUESTIONS[live.current.qi];
    setAnswer(q);
  };

  return (
    <form className="ask" role="search" aria-label="Ask 1iQ" onSubmit={submit} ref={box}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M7 0l1.6 5.4L14 7l-5.4 1.6L7 14l-1.6-5.4L0 7l5.4-1.6z" /></svg>
      <input
        type="text"
        placeholder={placeholder}
        aria-label="Ask 1iQ a question"
        autoComplete="off"
        value={value}
        onChange={(e) => { setValue(e.target.value); live.current.typed = !!e.target.value; }}
        onFocus={() => { live.current.focused = true; }}
        onBlur={() => { live.current.focused = false; }}
      />
      <span className="ask__go" aria-hidden="true">→</span>
      <div className={`ask__answer${answer ? " is-on" : ""}`} role="status">
        {answer && <><span className="label">Ask 1iQ</span>On your projects, 1iQ answers questions like <b>{answer}</b> from live site data. Book a briefing to see it on one of yours.</>}
      </div>
    </form>
  );
};

export const SiteHeader = ({ pathname }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className={`banner is-light${open ? " is-open" : ""}`}>
      <Link to="/" className="logo" aria-label="1iQ home">
        <span className="logo__flip"><img className="logo__img logo__img--dark" style={{ position: "static", opacity: 1 }} src="/assets/img/home/logo-dark.png" alt="1iQ" /></span>
      </Link>
      <nav className="banner__links" aria-label="Main">
        {NAV.map(([to, label]) => (
          <Link key={to} to={to} className="nochev" aria-current={pathname === to ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
      <Ask />
      <div className="banner__ctas">
        <Link to="/schedule" className="pill pill--blue">Book<br />a briefing</Link>
        <a href="https://app.1iq.ai/login" className="pill pill--white">Sign<br />in</a>
        <Link to="/schedule" className="pill pill--grey">Contact<br />us</Link>
        <button type="button" className="pill pill--white menu" aria-expanded={open} aria-controls="site-drawer" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Menu"}</button>
      </div>
      <nav className="drawer" id="site-drawer" aria-label="Menu">
        <Link to="/">Home</Link>
        {NAV.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
        <Link to="/services">Services</Link>
        <Link to="/construction-schedule-review">Schedule review</Link>
        <Link to="/#estimate">Estimate</Link>
        <Link to="/#faq">FAQ</Link>
        <a href="https://app.1iq.ai/login">Sign in</a>
      </nav>
    </header>
  );
};

export const SiteFooter = () => (
  <footer className="footer">
    <div className="wrap footer__in">
      <div>
        <div className="logo logo--foot"><img className="logo__img" src="/assets/img/home/logo-dark.png" alt="1iQ" /></div>
        <p className="small" style={{ marginTop: 14, maxWidth: 320 }}>Development intelligence for real estate developers, family offices and private equity.</p>
      </div>
      <div><h4>Platform</h4><nav>
        <Link to="/platform">Platform</Link>
        <Link to="/developer">For developers</Link>
        <Link to="/construction-schedule-review">Schedule review</Link>
        <Link to="/preconstruction-scheduling">Preconstruction scheduling</Link>
        <Link to="/services">Services</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/#estimate">Estimate</Link>
        <Link to="/#faq">FAQ</Link>
      </nav>
      <div className="pr-stores pr-stores--sm" style={{ marginTop: 16 }}>
        <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="pr-store pr-store--apple" aria-label="Download 1iQ on the App Store">
          <img src="/assets/img/stores/app-store.svg" alt="Download on the App Store" width="120" height="40" />
        </a>
        <a href={GOOGLE_PLAY} target="_blank" rel="noopener noreferrer" className="pr-store pr-store--play" aria-label="Get 1iQ on Google Play">
          <img src="/assets/img/stores/google-play.png" alt="Get it on Google Play" width="155" height="60" />
        </a>
      </div></div>
      <div><h4>Company</h4><nav>
        <Link to="/schedule">Book a briefing</Link>
        <Link to="/learn-more">Resources</Link>
        <a href="https://app.1iq.ai/login">Sign in</a>
        <Link to="/terms-of-use">Terms</Link>
        <Link to="/privacy-policy">Privacy</Link>
        <Link to="/refund-policy">Refunds</Link>
      </nav></div>
      <div><h4>Reach us</h4><nav>
        <a href="mailto:admin@1iq.ai">admin@1iq.ai</a>
        <span style={{ color: "#B3AFA7" }}>312 W. 2nd St, #1931<br />Casper, WY 82601</span>
        <span className="p-social">
          <a href="https://www.linkedin.com/company/1iq-ai/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://x.com/1iQaiApp" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://www.instagram.com/1iq.ai/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </span>
      </nav></div>
    </div>
  </footer>
);
