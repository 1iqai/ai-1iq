import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../pages/Home2026/site/site.css";
import "../../pages/Home2026/site/site-draft.css";
import "./draft-pages.css";

/**
 * The frame every page except the home page sits in: the same banner, paper and footer as the home page (Nov 2026).
 * It reuses the home page's styles (everything under .s26) and adds page pieces from draft-pages.css (under .s26.dp).
 */
const LINKS = [
  ["/platform", "Platform"],
  ["/developer", "For developers"],
  ["/construction-schedule-review", "Schedule review"],
  ["/#estimate", "Estimate"],
  ["/#faq", "FAQ"],
];

export const DraftPage = ({ children }) => {
  const root = useRef(null);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);

  // sections ease in as they come into view; with reduced motion they are simply there
  useEffect(() => {
    const el = root.current;
    const items = [...el.querySelectorAll(".reveal")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach((n) => n.classList.add("is-in"));
      return undefined;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <div className="s26 dp" ref={root}>
      <header className={`banner is-light${open ? " is-open" : ""}`}>
        <Link to="/" className="logo" aria-label="1iQ home"><span className="logo__flip"><img className="logo__img logo__img--dark" style={{ position: "static", opacity: 1 }} src="/assets/img/home/logo-dark.png" alt="1iQ" /></span></Link>
        <nav className="banner__links" aria-label="Main">
          {LINKS.map(([to, label]) => <Link key={to} to={to} className="nochev" aria-current={pathname === to ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="banner__ctas">
          <Link to="/schedule" className="pill pill--blue">Book<br />a briefing</Link>
          <a href="https://app.1iq.ai/login" className="pill pill--white">Sign<br />in</a>
          <button type="button" className="pill pill--white menu" aria-expanded={open} aria-controls="dp-drawer" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Menu"}</button>
        </div>
        <nav className="drawer" id="dp-drawer" aria-label="Menu">
          <Link to="/">Home</Link>
          {LINKS.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          <a href="https://app.1iq.ai/login">Sign in</a>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="wrap footer__in">
          <div><div className="logo logo--foot"><img className="logo__img" src="/assets/img/home/logo-dark.png" alt="1iQ" /></div><p className="small" style={{ marginTop: 14, maxWidth: 320 }}>Development intelligence for real estate developers, family offices and private equity.</p></div>
          <div><h4>Platform</h4><nav><Link to="/platform">Platform</Link><Link to="/developer">For developers</Link><Link to="/construction-schedule-review">Schedule review</Link><Link to="/preconstruction-scheduling">Preconstruction scheduling</Link><Link to="/#estimate">Estimate</Link><Link to="/#faq">FAQ</Link></nav></div>
          <div><h4>Company</h4><nav><Link to="/schedule">Book a briefing</Link><Link to="/learn-more">Resources</Link><a href="https://app.1iq.ai/login">Sign in</a><Link to="/terms-of-use">Terms</Link><Link to="/privacy-policy">Privacy</Link></nav></div>
          <div><h4>Reach us</h4><nav><a href="mailto:admin@1iq.ai">admin@1iq.ai</a><span style={{ color: "#B3AFA7" }}>312 W. 2nd St, #1931<br />Casper, WY 82601</span><span className="p-social"><a href="https://www.linkedin.com/company/1iq-ai/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://x.com/1iQaiApp" target="_blank" rel="noopener noreferrer">X</a><a href="https://www.instagram.com/1iq.ai/" target="_blank" rel="noopener noreferrer">Instagram</a></span></nav></div>
        </div>
      </footer>
    </div>
  );
};

/** The title block at the top of a page: sheet label, heading, a line of copy and the buttons. */
export const PageHero = ({ sheet, note, kicker, title, lead, children, narrow }) => (
  <section className={`p-hero${narrow ? " p-hero--narrow" : ""}`}>
    <div className="wrap">
      <div className="p-hero__bar"><span className="k">{sheet}</span>{note && <span className="k">{note}</span>}</div>
      {kicker && <span className="k p-hero__k">{kicker}</span>}
      <h1 className="h1">{title}</h1>
      {lead && <p className="p-hero__lead">{lead}</p>}
      {children && <div className="ctas">{children}</div>}
    </div>
  </section>
);

/** A numbered sheet: the bar across the top, then the content. */
export const Sheet = ({ no, name, note, tone, id, children, className = "" }) => (
  <section className={`d-sec${tone === "paper" ? " paper" : ""} ${className}`} id={id}>
    <div className="sheetbar"><div className="wrap"><span>Sheet {no} · {name}</span><span>{note}</span></div></div>
    <div className="wrap">{children}</div>
  </section>
);

/** The closing band with one button. */
export const CloseBand = ({ label, title, text, to = "/schedule", cta = "Book a briefing" }) => (
  <section className="p-close">
    <div className="wrap reveal">
      {label && <span className="k">{label}</span>}
      <h2 className="h2">{title}</h2>
      {text && <p className="d-p">{text}</p>}
      <Link to={to} className="pill pill--blue pill--lg">{cta}</Link>
    </div>
  </section>
);

export default DraftPage;
