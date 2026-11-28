import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { SiteHeader, SiteFooter } from "./SiteFrame";
import "../../pages/Home2026/site/site.css";
import "../../pages/Home2026/site/site-draft.css";
import "./draft-pages.css";

/**
 * The frame every page except the home page sits in: the same banner, paper and footer as the home page (Nov 2026).
 * It reuses the home page's styles (everything under .s26) and adds page pieces from draft-pages.css (under .s26.dp).
 */
export const DraftPage = ({ children }) => {
  const root = useRef(null);
  const { pathname } = useLocation();

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
      <SiteHeader pathname={pathname} />

      <main>{children}</main>

      <SiteFooter />
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

/** The closing band with one button. `href` sends it off the site (the app), `to` stays on it. */
export const CloseBand = ({ label, title, text, to = "/schedule", href, cta = "Book a briefing" }) => (
  <section className="p-close">
    <div className="wrap reveal">
      {label && <span className="k">{label}</span>}
      <h2 className="h2">{title}</h2>
      {text && <p className="d-p">{text}</p>}
      {href
        ? <a href={href} className="pill pill--blue pill--lg">{cta}</a>
        : <Link to={to} className="pill pill--blue pill--lg">{cta}</Link>}
    </div>
  </section>
);

export default DraftPage;
