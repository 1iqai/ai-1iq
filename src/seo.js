// What search engines, AI assistants and link previews are told about each page: its title, its description
// and its structured data. Used twice: when the site is built (scripts/prerender.mjs writes it into each
// page's HTML) and in the browser when someone moves between pages (applySeo).
import homeFaq from "./pages/Home2026/site/faq.ld.json";
import { REVIEW_FAQ, PRECON_FAQ } from "./content/scheduleFaqs";

export const SITE = "https://www.1iq.ai";

const faqLd = (rows) => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: rows.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
const crumbs = (name, path) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [{ "@type": "ListItem", position: 1, name: "1iQ", item: SITE + "/" }, { "@type": "ListItem", position: 2, name, item: SITE + path }],
});
const ORG = {
  "@context": "https://schema.org", "@type": "Organization", name: "1iQ", legalName: "1iQ LLC", url: SITE + "/", logo: SITE + "/og-image.png",
  description: "1iQ is a development intelligence platform for real estate developers, investors and family offices, with construction scheduling, schedule review and live project tracking.",
  founder: { "@type": "Person", name: "Chimi Kadiya", jobTitle: "Founder and CEO" },
  sameAs: ["https://www.linkedin.com/company/1iq-ai/", "https://x.com/1iQaiApp", "https://www.instagram.com/1iq.ai/"],
};
const APP = {
  "@context": "https://schema.org", "@type": "SoftwareApplication", name: "1iQ", applicationCategory: "BusinessApplication", operatingSystem: "Web, iOS, Android", url: SITE + "/",
  description: "Construction scheduling, schedule review and live project tracking for real estate development. 1iQ reads Primavera P6, Microsoft Project and Excel schedules, checks them, and tracks planned against actual progress.",
  featureList: ["Construction schedule review", "DCMA 14 point schedule assessment", "Primavera P6, Microsoft Project and Excel import", "Planned against actual tracking", "Forecast finish date", "Owner and investor reporting"],
};
const article = (headline, description, path) => ({
  "@context": "https://schema.org", "@type": "Article", headline, description, mainEntityOfPage: SITE + path,
  author: { "@type": "Person", name: "Chimi Kadiya", jobTitle: "Founder of 1iQ, construction program and project manager" },
  publisher: { "@type": "Organization", name: "1iQ", logo: { "@type": "ImageObject", url: SITE + "/og-image.png" } },
  datePublished: "2026-11-13", dateModified: "2026-11-13",
});

export const SEO = {
  "/": {
    title: "1iQ: Development Intelligence for Real Estate Developers and Investors",
    description: "See project risk, capital exposure and execution performance as they happen. 1iQ is the development intelligence platform for real estate developers, investors and family offices.",
    ld: [ORG, APP, homeFaq],
  },
  "/construction-schedule-review": {
    title: "Construction Schedule Review: Test a Schedule Before You Sign | 1iQ",
    description: "How developers and owners review a contractor's construction schedule before signing: what to check, what to negotiate, and a free schedule scorecard for P6, Microsoft Project and Excel files.",
    ld: [article("How to review a contractor's construction schedule before you sign", "What developers and owners should check in a construction schedule before it becomes the baseline, and what to negotiate with the result.", "/construction-schedule-review"), faqLd(REVIEW_FAQ), crumbs("Construction schedule review", "/construction-schedule-review")],
  },
  "/preconstruction-scheduling": {
    title: "Preconstruction Scheduling: Check Your Bid Schedule | 1iQ",
    description: "How contractors build a bid schedule that holds up in review: what owners look for, the DCMA 14 point checks, and a free scorecard for P6, Microsoft Project and Excel schedules.",
    ld: [article("Preconstruction scheduling: a bid schedule that holds up", "What owners look for in a contractor's bid schedule and how to check yours before you submit it.", "/preconstruction-scheduling"), faqLd(PRECON_FAQ), crumbs("Preconstruction scheduling", "/preconstruction-scheduling")],
  },
  "/platform": {
    title: "The 1iQ Platform: Core, Field, Intel and Gantt | 1iQ",
    description: "One platform, four parts. 1iQ connects field operations to capital decisions with live dashboards, construction scheduling, risk alerts and investor reporting, on top of the tools you already use.",
    ld: [crumbs("Platform", "/platform")],
  },
  "/developer": {
    title: "For Real Estate Developers: See What Is Really Happening on Site | 1iQ",
    description: "For developers, family offices and private equity. 1iQ covers feasibility before you build, live oversight while you build and investor grade reporting, with an estimate of your capital exposure.",
    ld: [crumbs("For developers", "/developer")],
  },
  "/schedule": {
    title: "Book a Development Intelligence Briefing | 1iQ",
    description: "Book a private 30 minute briefing to see 1iQ on a real development project, built around your asset class and capital challenge.",
    ld: [crumbs("Book a briefing", "/schedule")],
  },
  "/learn-more": {
    title: "Resources for Engineers and Partners | 1iQ",
    description: "Technical documentation, partnership options and construction industry news from 1iQ.",
    ld: [crumbs("Resources", "/learn-more")],
  },
  "/partnership-inquiry": { title: "Partnership Inquiry | 1iQ", description: "Join the 1iQ partner ecosystem: technology, referral, reseller and consulting partnerships.", ld: [] },
  "/builder-application": { title: "Builder Inquiry | 1iQ", description: "Tell 1iQ about your project and join the developer program.", ld: [] },
  "/get-started": { title: "Developer Access | 1iQ", description: "Three ways to connect with 1iQ: a technical demo, a strategic partnership or the developer program.", ld: [] },
  "/terms-of-use": { title: "Terms of Use | 1iQ", description: "The terms that apply to using 1iQ's website and services.", ld: [] },
  "/privacy-policy": { title: "Privacy Policy | 1iQ", description: "How 1iQ collects, uses and protects information.", ld: [] },
};

export const cleanPath = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";

/** In the browser: bring the page's title, description, canonical link and structured data in line with the page shown. */
export function applySeo(pathname) {
  const path = cleanPath(pathname);
  const seo = SEO[path];
  if (!seo) return;
  document.title = seo.title;
  const set = (sel, attr, value) => { const el = document.head.querySelector(sel); if (el) el.setAttribute(attr, value); };
  set('meta[name="description"]', "content", seo.description);
  set('meta[property="og:title"]', "content", seo.title);
  set('meta[property="og:description"]', "content", seo.description);
  set('meta[property="og:url"]', "content", SITE + path);
  set('link[rel="canonical"]', "href", SITE + path);
  document.head.querySelectorAll("script.seo-ld").forEach((n) => n.remove());
  seo.ld.forEach((data) => {
    const s = document.createElement("script");
    s.type = "application/ld+json"; s.className = "seo-ld"; s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  });
}
