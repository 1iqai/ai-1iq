import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Shared/Footer/Footer";
import PortalButton from "../../components/Shared/PortalButton/PortalButton";
import "./Pricing.scss";

gsap.registerPlugin(ScrollTrigger);

/* ─── Tier Data ─── */
const tiers = [
  {
    id: "free",
    name: "Free Schedule",
    tagline: "See 1iQ in action — zero commitment",
    price: "$0",
    period: "forever",
    trial: null,
    cta: { label: "Generate Free Schedule", href: "https://app.1iq.ai/free-schedule" },
    features: [
      "1 AI-generated schedule",
      "Basic risk overview",
      "CSV export",
      "No credit card required",
    ],
    highlight: false,
  },
  {
    id: "tier1",
    name: "Pro",
    tagline: "For builders managing active projects",
    price: "$19.99",
    period: "/mo",
    trial: "7-day free trial",
    cta: { label: "Start 7-Day Free Trial", href: "https://app.1iq.ai/signup?plan=tier1" },
    features: [
      "Unlimited AI schedules",
      "Crew & resource modeling",
      "Execution risk analysis",
      "Real-time field sync",
      "CSV & PDF exports",
      "Email support",
    ],
    highlight: false,
  },
  {
    id: "tier2",
    name: "Enterprise",
    tagline: "Full-spectrum intelligence for scaling capital",
    price: "$49.99",
    period: "/mo",
    trial: "14-day free trial",
    cta: { label: "Start 14-Day Free Trial", href: "https://app.1iq.ai/signup?plan=tier2" },
    features: [
      "Everything in Pro",
      "Predictive conflict resolution",
      "Automated investor reporting",
      "Portfolio-level dashboards",
      "GC mandate integration",
      "Multi-project analytics",
      "Priority support",
      "Custom integrations",
    ],
    highlight: true,
    badge: "Best Value",
  },
];

/* ─── Feature Comparison Data ─── */
const comparisonRows = [
  { feature: "AI Schedule Generation", free: "1 schedule", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Risk Analysis", free: "Basic", pro: "Advanced", enterprise: "Predictive" },
  { feature: "Crew Modeling", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "Real-Time Field Sync", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "Investor Reporting", free: "—", pro: "—", enterprise: "Automated" },
  { feature: "Portfolio Dashboards", free: "—", pro: "—", enterprise: "✓" },
  { feature: "GC Mandate Integration", free: "—", pro: "—", enterprise: "✓" },
  { feature: "Exports", free: "CSV", pro: "CSV & PDF", enterprise: "CSV, PDF & API" },
  { feature: "Support", free: "Community", pro: "Email", enterprise: "Priority" },
];

/* ─── FAQ Data ─── */
const faqs = [
  {
    q: "How does the free trial work?",
    a: "Start your trial instantly — no credit card required upfront. You'll get full access to all features in your chosen tier. We'll ask for payment details before your trial ends so there's no interruption to your workflow.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Absolutely. Upgrade or downgrade at any time from your account settings. Changes take effect at the start of your next billing cycle, and you'll receive prorated credit for any unused time.",
  },
  {
    q: "What happens after my free schedule?",
    a: "Your generated schedule is yours to keep forever. If you want to create more schedules, unlock crew modeling, or access real-time field sync, upgrade to Pro or Enterprise.",
  },
  {
    q: "Is there an annual discount?",
    a: "Yes — annual plans save you 20% compared to monthly billing. Contact our team or toggle to annual billing during checkout to see discounted pricing.",
  },
  {
    q: "Do you offer custom enterprise pricing?",
    a: "For organizations managing 3+ simultaneous projects or requiring custom integrations, we offer tailored Portfolio Retainer packages. Schedule a call and we'll build a plan around your portfolio.",
  },
];

/* ─── Component ─── */
const Pricing = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const pageRef = useRef(null);
  const cardsRef = useRef(null);
  const compRef = useRef(null);
  const faqRef = useRef(null);
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "annual"
  const [openFaq, setOpenFaq] = useState(null);

  const getPrice = (tier) => {
    if (tier.price === "$0" || tier.price === "Custom") return tier.price;
    const monthly = parseFloat(tier.price.replace("$", ""));
    if (billingCycle === "annual") {
      return `$${(monthly * 0.8).toFixed(2)}`;
    }
    return tier.price;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger-in pricing cards
      if (cardsRef.current) {
        gsap.from(cardsRef.current.querySelectorAll(".pricing-card"), {
          y: 60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
        });
      }

      // Comparison table fade
      if (compRef.current) {
        gsap.from(compRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: compRef.current,
            start: "top 85%",
          },
        });
      }

      // FAQ stagger
      if (faqRef.current) {
        gsap.from(faqRef.current.querySelectorAll(".pricing-faq__item"), {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top 85%",
          },
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="app relative w-full overflow-x-hidden">
      <Navigation heroRef={heroRef} />

      {/* ── Hero ── */}
      <section ref={heroRef} className="pricing-hero">
        <div className="pricing-hero__bg" aria-hidden="true" />
        <div className="pricing-hero__glow pricing-hero__glow--left" aria-hidden="true" />
        <div className="pricing-hero__glow pricing-hero__glow--right" aria-hidden="true" />

        <div className="pricing-hero__content">
          <div className="pricing-hero__inner">
            <p className="pricing-hero__eyebrow">Pricing</p>
            <h1 className="pricing-hero__title">
              Transparent Pricing.<br />Built for Builders.
            </h1>
            <p className="pricing-hero__sub">
              Start free. Scale when you're ready. No hidden fees, no per-seat charges, no consultant markups.
            </p>
          </div>
        </div>
      </section>

      {/* ── Billing Toggle ── */}
      <section className="pricing-toggle-section">
        <div className="pricing-toggle">
          <button
            className={`pricing-toggle__btn ${billingCycle === "monthly" ? "pricing-toggle__btn--active" : ""}`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`pricing-toggle__btn ${billingCycle === "annual" ? "pricing-toggle__btn--active" : ""}`}
            onClick={() => setBillingCycle("annual")}
          >
            Annual
            <span className="pricing-toggle__badge">Save 20%</span>
          </button>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="pricing-cards-section">
        <div className="pricing-cards__inner" ref={cardsRef}>
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`pricing-card ${tier.highlight ? "pricing-card--highlight" : ""}`}
            >
              {tier.badge && <div className="pricing-card__badge">{tier.badge}</div>}

              <div className="pricing-card__header">
                <h3 className="pricing-card__name">{tier.name}</h3>
                <p className="pricing-card__tagline">{tier.tagline}</p>
              </div>

              <div className="pricing-card__price-block">
                <span className="pricing-card__price">{getPrice(tier)}</span>
                {tier.period && <span className="pricing-card__period">{billingCycle === "annual" && tier.price !== "$0" ? "/mo (billed annually)" : tier.period}</span>}
              </div>

              {tier.trial && (
                <p className="pricing-card__trial">{tier.trial}</p>
              )}

              <a
                href={tier.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`pricing-card__cta ${tier.highlight ? "pricing-card__cta--primary" : ""}`}
              >
                {tier.cta.label}
              </a>

              <div className="pricing-card__divider" />

              <ul className="pricing-card__features">
                {tier.features.map((f, i) => (
                  <li key={i} className="pricing-card__feature">
                    <svg className="pricing-card__check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Comparison Table ── */}
      <section className="pricing-comparison" data-nav-theme="bright">
        <div className="pricing-comparison__inner" ref={compRef}>
          <h2 className="pricing-comparison__title">Compare Plans</h2>
          <p className="pricing-comparison__sub">Every feature, side by side.</p>

          <div className="pricing-comparison__table-wrap">
            <table className="pricing-comparison__table">
              <thead>
                <tr>
                  <th className="pricing-comparison__th pricing-comparison__th--feature">Feature</th>
                  <th className="pricing-comparison__th">Free</th>
                  <th className="pricing-comparison__th pricing-comparison__th--highlight">Pro</th>
                  <th className="pricing-comparison__th">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="pricing-comparison__row">
                    <td className="pricing-comparison__td pricing-comparison__td--feature">{row.feature}</td>
                    <td className="pricing-comparison__td">{row.free}</td>
                    <td className="pricing-comparison__td pricing-comparison__td--highlight">{row.pro}</td>
                    <td className="pricing-comparison__td">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="pricing-faq">
        <div className="pricing-faq__inner" ref={faqRef}>
          <h2 className="pricing-faq__title">Frequently Asked Questions</h2>
          <p className="pricing-faq__sub">Everything you need to know about billing, trials, and plans.</p>

          <div className="pricing-faq__list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`pricing-faq__item ${openFaq === i ? "pricing-faq__item--open" : ""}`}
              >
                <button
                  className="pricing-faq__question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.q}</span>
                  <svg
                    className="pricing-faq__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="pricing-faq__answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="pricing-bottom-cta">
        <div className="pricing-bottom-cta__inner">
          <h2 className="pricing-bottom-cta__title">Ready to Protect Your Capital?</h2>
          <p className="pricing-bottom-cta__sub">
            Join construction teams using 1iQ to eliminate schedule risk before it becomes a capital problem.
          </p>
          <div className="pricing-bottom-cta__actions">
            <PortalButton
              label="Schedule a Product Tour"
              redirectTo="/schedule"
              className="pricing-bottom-cta__btn"
              showDivider={false}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
