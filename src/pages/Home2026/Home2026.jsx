import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import markup from "./site/markup.html?raw";
import "./site/site.css";
import faq from "./site/faq.ld.json";

/**
 * 1iq.ai home page (Nov 2026), in the style of terminal-industries.com with the 1iQ app's own colours and fonts.
 * The page is the approved mock: its markup lives in ./site/markup.html and its behaviour (3D tower, scroll story,
 * agent cards, calculator, booking form) in ./site/init.js, loaded after first paint so three.js never blocks it.
 * Links that start with "/" go through the router; everything else (anchors, the app sign in) behaves normally.
 */
const Home2026 = () => {
  const root = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = root.current;
    let cleanup = () => {};
    let cancelled = false;
    import("./site/init.js").then((m) => {
      if (!cancelled) cleanup = m.init(el);
    });
    const onClick = (e) => {
      const a = e.target.closest("a[href^='/']");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
      e.preventDefault();
      navigate(a.getAttribute("href"));
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
  }, [navigate]);

  return <div className="s26" ref={root} dangerouslySetInnerHTML={{ __html: markup }} />;
};

export default Home2026;
