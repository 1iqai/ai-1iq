import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import markup from "./site/markup.html?raw";
import "./site/site.css";
import "./site/site-draft.css";
import faq from "./site/faq.ld.json";

/**
 * 1iq.ai home page (Nov 2026), drawn like the 1iQ app: paper, hairlines, mono labels and numbered sheets.
 * Its markup lives in ./site/markup.html, its look in site.css plus site-draft.css, and its behaviour (the high rise
 * and its scroll story, Decide now, agent cards, calculator, booking form) in ./site/init.js, loaded after first paint.
 * Links that start with "/" go through the router; everything else (anchors, the app sign in) behaves normally.
 */
const Home2026 = () => {
  const root = useRef(null);
  const navigate = useNavigate();
  // keep the latest navigate in a ref: its identity changes with the URL, and re-running the effect would tear the page down
  const nav = useRef(navigate);
  nav.current = navigate;

  useEffect(() => {
    const el = root.current;
    let cleanup = () => {};
    let cancelled = false;
    import("./site/init.js").then((m) => {
      if (cancelled) return;
      cleanup = m.init(el);
      // arriving from another page with a section in the address (/#estimate): go to it once the page is laid out
      const id = window.location.hash.slice(1);
      const target = id && el.querySelector("#" + CSS.escape(id));
      if (target) setTimeout(() => { if (!cancelled) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: "auto" }); }, 350);
    });
    const onClick = (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      // in page anchors (#top, #contact, ...) scroll here without touching the URL, so the router never re-renders the page
      const hash = e.target.closest("a[href^='#']");
      if (hash) {
        e.preventDefault();
        const id = hash.getAttribute("href").slice(1);
        const target = id === "top" ? null : el.querySelector("#" + CSS.escape(id));
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const top = target ? target.getBoundingClientRect().top + window.scrollY : 0;
        window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
        return;
      }
      const a = e.target.closest("a[href^='/']");
      if (!a || a.target === "_blank") return;
      e.preventDefault();
      nav.current(a.getAttribute("href"));
    };
    el.addEventListener("click", onClick);
    // FAQ structured data, so search engines can show the questions and answers
    const ld = document.createElement("script");
    ld.type = "application/ld+json"; ld.id = "faq-ld"; ld.textContent = JSON.stringify(faq);
    document.head.appendChild(ld);
    return () => {
      ld.remove();
      cancelled = true;
      el.removeEventListener("click", onClick);
      cleanup();
    };
  }, []);

  return <div className="s26" ref={root} dangerouslySetInnerHTML={{ __html: markup }} />;
};

export default Home2026;
