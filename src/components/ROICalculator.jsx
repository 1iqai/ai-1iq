import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MetalFx } from "metal-fx";
import "./ROICalculator.css";

// ─── Formatting helpers ───────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `$${Math.round(n / 1_000)}K`
    : `$${Math.round(n)}`;

// ─── Asset class risk profiles ────────────────────────────────────────────────
// Source: FMI Q4 2025 Construction Outlook & KPMG Global Construction Survey 2025
const ASSET_CLASSES = [
  { value: "multifamily",   label: "Multifamily",            avgDelayMonths: 2.8, overrunRate: 0.21 },
  { value: "hospitality",   label: "Hospitality",            avgDelayMonths: 4.6, overrunRate: 0.28 },
  { value: "industrial",    label: "Industrial & Logistics",  avgDelayMonths: 2.4, overrunRate: 0.18 },
  { value: "mixed-use",     label: "Mixed-Use",              avgDelayMonths: 3.5, overrunRate: 0.25 },
  { value: "data-center",   label: "Data Centers",           avgDelayMonths: 5.2, overrunRate: 0.32 },
  { value: "commercial",    label: "Commercial",             avgDelayMonths: 3.1, overrunRate: 0.22 },
  { value: "other",         label: "Other",                  avgDelayMonths: 3.3, overrunRate: 0.23 },
];

// ─── Geography risk tiers ─────────────────────────────────────────────────────
const getGeoTier = (location) => {
  if (!location || location.trim().length < 2) return 1;
  const l = location.toLowerCase();
  const tier1 = ["us", "usa", "united states", "uk", "united kingdom", "australia",
    "canada", "germany", "france", "netherlands", "singapore", "japan", "new zealand"];
  const tier2 = ["uae", "dubai", "abu dhabi", "brazil", "mexico", "spain", "italy",
    "south korea", "hong kong", "taiwan", "chile", "colombia", "saudi", "qatar"];
  const tier3 = ["india", "indonesia", "philippines", "vietnam", "thailand", "egypt",
    "nigeria", "kenya", "ghana", "pakistan", "bangladesh"];
  if (tier1.some((t) => l.includes(t))) return 1;
  if (tier2.some((t) => l.includes(t))) return 2;
  if (tier3.some((t) => l.includes(t))) return 3;
  return 2;
};

const GEO_RISK_MULTIPLIERS = { 1: 1.0, 2: 1.25, 3: 1.55 };
const GEO_RISK_LABELS = {
  1: { label: "Established Market", color: "#22c55e", desc: "Standard baseline risk assumptions applied." },
  2: { label: "High-Growth Market",  color: "#f59e0b", desc: "Elevated permitting and labor variance factored in." },
  3: { label: "Emerging Market",     color: "#ef4444", desc: "Enhanced supply chain and regulatory risk applied." },
};

// ─── Core calculation engine ──────────────────────────────────────────────────
function calcROI({ projectBudget, timelineMonths, assetClass,
  loanAmount, interestRate, monthlyTaxes, monthlyInsurance, monthlyOverhead, location }) {
  const asset = ASSET_CLASSES.find((a) => a.value === assetClass) || ASSET_CLASSES[0];
  const geoTier = getGeoTier(location);
  const geoMultiplier = GEO_RISK_MULTIPLIERS[geoTier];

  const monthlyLoanInterest = (loanAmount * (interestRate / 100)) / 12;
  const monthlyCarryingCost = monthlyLoanInterest + monthlyTaxes + monthlyInsurance + monthlyOverhead;
  const adjustedDelayMonths = asset.avgDelayMonths * geoMultiplier;
  const delayRiskExposure = monthlyCarryingCost * adjustedDelayMonths;
  const overrunExposure = projectBudget * asset.overrunRate * geoMultiplier;
  const earlyWarningValue = monthlyCarryingCost * 1.05;
  const feasibilitySavings = Math.min(projectBudget * 0.008, 180_000);
  const reportingSavings = 75_000;
  const totalProtection = delayRiskExposure + (overrunExposure * 0.15) + earlyWarningValue + feasibilitySavings + reportingSavings;

  return {
    monthlyCarryingCost: Math.round(monthlyCarryingCost),
    delayRiskExposure: Math.round(delayRiskExposure),
    overrunExposure: Math.round(overrunExposure),
    earlyWarningValue: Math.round(earlyWarningValue),
    feasibilitySavings: Math.round(feasibilitySavings),
    totalProtection: Math.round(totalProtection),
    adjustedDelayMonths: adjustedDelayMonths.toFixed(1),
    geoTier,
    assetLabel: asset.label,
  };
}

// ─── Slider component ─────────────────────────────────────────────────────────
function Slider({ label, sublabel, value, min, max, step, onChange, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="roi-slider">
      <div className="roi-slider__header">
        <div className="roi-slider__label-group">
          <span className="roi-slider__label">{label}</span>
          {sublabel && <span className="roi-slider__sublabel">{sublabel}</span>}
        </div>
        <span className="roi-slider__value">{format(value)}</span>
      </div>
      <div className="roi-slider__track">
        <div className="roi-slider__fill" style={{ width: `${pct}%` }} />
        <div className="roi-slider__knob" style={{ left: `${pct}%` }}>
          <span className="roi-slider__knob-grip" />
          <span className="roi-slider__knob-grip" />
          <span className="roi-slider__knob-grip" />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="roi-slider__input"
        />
      </div>
      <div className="roi-slider__range">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ROICalculator() {
  const navigate = useNavigate();
  const siblingRef = useRef(null);

  const [assetClass, setAssetClass] = useState("multifamily");
  const [location, setLocation] = useState("");
  const [projectBudget, setProjectBudget] = useState(20_000_000);
  const [timelineMonths, setTimelineMonths] = useState(18);
  const [showFinancing, setShowFinancing] = useState(false);
  const [loanAmount, setLoanAmount] = useState(14_000_000);
  const [interestRate, setInterestRate] = useState(8);
  const [monthlyTaxes, setMonthlyTaxes] = useState(8_000);
  const [monthlyInsurance, setMonthlyInsurance] = useState(6_000);
  const [monthlyOverhead, setMonthlyOverhead] = useState(15_000);

  const results = useMemo(
    () => calcROI({ projectBudget, timelineMonths, assetClass,
      loanAmount, interestRate, monthlyTaxes, monthlyInsurance, monthlyOverhead, location }),
    [projectBudget, timelineMonths, assetClass, loanAmount, interestRate,
      monthlyTaxes, monthlyInsurance, monthlyOverhead, location]
  );

  const geoInfo = GEO_RISK_LABELS[results.geoTier];
  const hasLocation = location.trim().length >= 2;
  const ctaQuestion = results.delayRiskExposure > results.overrunExposure
    ? "Your highest exposure is carrying cost during active construction. How does 1iQ give you early warning during this window?"
    : "Your highest exposure is budget overrun risk. How does 1iQ surface variance before it hits your ledger?";

  return (
    <section id="roi-calculator" className="roi-section">
      <div className="roi-section__header">
        <h2 className="roi-section__title">What is your capital exposure on this project?</h2>
        <p className="roi-section__subtitle">
          Enter your project constraints. See your real risk exposure — built on your numbers, not industry averages.
        </p>
      </div>

      <div className="roi-layout">

        {/* ── Left: Inputs ── */}
        <div className="roi-inputs">
          <p className="roi-inputs__label">YOUR PROJECT</p>

          <div className="roi-field">
            <label className="roi-field__label">Asset Class</label>
            <div className="roi-asset-grid">
              {ASSET_CLASSES.map((a) => (
                <button
                  key={a.value}
                  className={`roi-asset-btn${assetClass === a.value ? " roi-asset-btn--active" : ""}`}
                  onClick={() => setAssetClass(a.value)}
                  type="button"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="roi-field">
            <label className="roi-field__label">Project Location</label>
            <div className="roi-location-wrap">
              <input
                type="text"
                className="roi-location-input"
                placeholder="e.g. Los Angeles, CA · Dubai, UAE · São Paulo, Brazil"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {hasLocation && (
                <div className="roi-geo-badge" style={{ borderColor: geoInfo.color }}>
                  <span className="roi-geo-badge__dot" style={{ background: geoInfo.color }} />
                  <span className="roi-geo-badge__label" style={{ color: geoInfo.color }}>
                    {geoInfo.label}
                  </span>
                </div>
              )}
            </div>
            {hasLocation && <p className="roi-geo-desc">{geoInfo.desc}</p>}
          </div>

          <Slider
            label="Total Project Budget"
            value={projectBudget} min={5_000_000} max={200_000_000} step={5_000_000}
            onChange={setProjectBudget}
            format={(v) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(0)}M` : `$${v / 1_000}K`}
          />

          <Slider
            label="Construction Timeline" sublabel="months"
            value={timelineMonths} min={6} max={60} step={1}
            onChange={setTimelineMonths}
            format={(v) => `${v} months`}
          />

          <div className="roi-financing">
            <button
              className={`roi-financing__toggle${showFinancing ? " roi-financing__toggle--open" : ""}`}
              onClick={() => setShowFinancing(!showFinancing)}
              type="button"
            >
              <span className="roi-financing__toggle-icon">{showFinancing ? "−" : "+"}</span>
              <span className="roi-financing__toggle-label">
                {showFinancing ? "Hide financing details" : "Add your financing details for a precise estimate"}
              </span>
            </button>

            {showFinancing && (
              <div className="roi-financing__panel">
                <Slider
                  label="Construction Loan Amount"
                  value={loanAmount} min={1_000_000} max={150_000_000} step={1_000_000}
                  onChange={setLoanAmount}
                  format={(v) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(0)}M` : `$${v / 1_000}K`}
                />
                <Slider
                  label="Annual Interest Rate" sublabel="construction loan"
                  value={interestRate} min={4} max={15} step={0.25}
                  onChange={setInterestRate}
                  format={(v) => `${v.toFixed(2)}%`}
                />
                <Slider
                  label="Monthly Property Taxes"
                  value={monthlyTaxes} min={1_000} max={50_000} step={500}
                  onChange={setMonthlyTaxes}
                  format={(v) => `$${(v / 1_000).toFixed(0)}K`}
                />
                <Slider
                  label="Monthly Insurance" sublabel="builder's risk + general liability"
                  value={monthlyInsurance} min={1_000} max={30_000} step={500}
                  onChange={setMonthlyInsurance}
                  format={(v) => `$${(v / 1_000).toFixed(0)}K`}
                />
                <Slider
                  label="Monthly Operating Overhead" sublabel="staff, consultants, site costs"
                  value={monthlyOverhead} min={5_000} max={100_000} step={1_000}
                  onChange={setMonthlyOverhead}
                  format={(v) => `$${(v / 1_000).toFixed(0)}K`}
                />
                <div className="roi-carrying-cost">
                  <div className="roi-carrying-cost__row">
                    <span className="roi-carrying-cost__label">Your Monthly Carrying Cost</span>
                    <span className="roi-carrying-cost__value">{fmt(results.monthlyCarryingCost)}/mo</span>
                  </div>
                  <div className="roi-carrying-cost__breakdown">
                    <span>Loan interest: {fmt(Math.round((loanAmount * interestRate / 100) / 12))}/mo</span>
                    <span>Taxes: {fmt(monthlyTaxes)}/mo</span>
                    <span>Insurance: {fmt(monthlyInsurance)}/mo</span>
                    <span>Overhead: {fmt(monthlyOverhead)}/mo</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="roi-inputs__footnote">
            Risk profiles sourced from FMI Q4 2025 Construction Outlook, KPMG Global
            Construction Survey 2025, and CII Research Report 386.{" "}
            <a href="/platform" className="roi-inputs__link">See full methodology →</a>
          </p>
        </div>

        {/* ── Right: Results ── */}
        <div className="roi-results">

          <div className="roi-stat roi-stat--primary">
            <span className="roi-stat__number">{fmt(results.totalProtection)}</span>
            <p className="roi-stat__label">
              Total capital exposure on this {results.assetLabel.toLowerCase()} project
            </p>
          </div>

          <div className="roi-stat-grid">
            <div className="roi-stat roi-stat--secondary">
              <span className="roi-stat__number roi-stat__number--sm">{fmt(results.delayRiskExposure)}</span>
              <p className="roi-stat__label">
                Delay risk exposure
                <span className="roi-stat__source">
                  {results.adjustedDelayMonths} avg months slippage{hasLocation ? ` · ${location.split(",")[0]}` : ""}
                </span>
              </p>
            </div>
            <div className="roi-stat roi-stat--secondary">
              <span className="roi-stat__number roi-stat__number--sm">{fmt(results.overrunExposure)}</span>
              <p className="roi-stat__label">
                Budget overrun exposure
                <span className="roi-stat__source">
                  {Math.round((ASSET_CLASSES.find(a => a.value === assetClass)?.overrunRate || 0.23) *
                    (GEO_RISK_MULTIPLIERS[results.geoTier] || 1) * 100)}% rate · {results.assetLabel}
                </span>
              </p>
            </div>
            <div className="roi-stat roi-stat--secondary">
              <span className="roi-stat__number roi-stat__number--sm">{fmt(results.earlyWarningValue)}</span>
              <p className="roi-stat__label">
                Early warning value
                <span className="roi-stat__source">Avg 4.2 weeks earlier detection · CII 2025</span>
              </p>
            </div>
            <div className="roi-stat roi-stat--secondary">
              <span className="roi-stat__number roi-stat__number--sm">{fmt(results.feasibilitySavings)}</span>
              <p className="roi-stat__label">
                Feasibility intelligence savings
                <span className="roi-stat__source">vs $50K–$200K consultant study</span>
              </p>
            </div>
          </div>

          <div className={`roi-sensitivity roi-sensitivity--${results.geoTier === 1 ? "moderate" : results.geoTier === 2 ? "elevated" : "high"}`}>
            <div className="roi-sensitivity__header">
              <span className="roi-sensitivity__icon">
                {results.geoTier === 1 ? "◈" : results.geoTier === 2 ? "⚠" : "⚑"}
              </span>
              <span className="roi-sensitivity__title">
                {results.geoTier === 1 ? "MODERATE EXPOSURE" : results.geoTier === 2 ? "ELEVATED EXPOSURE" : "HIGH EXPOSURE"}
              </span>
            </div>
            <p className="roi-sensitivity__desc">
              {results.monthlyCarryingCost > 0
                ? `A 6-week schedule slippage on this project represents ${fmt(Math.round(results.monthlyCarryingCost * 1.5))} in carrying costs alone — before any budget overrun.`
                : `Based on your ${results.assetLabel.toLowerCase()} asset class and ${hasLocation ? location : "selected market"}, your project carries ${results.geoTier === 1 ? "standard" : results.geoTier === 2 ? "above-average" : "elevated"} execution risk exposure.`
              }
            </p>
          </div>

          <div className="roi-cta-block">
            <p className="roi-cta-question">{ctaQuestion}</p>
            <MetalFx preset="chromatic" strength={0.90} reflectionTargets={[siblingRef]}>
              <button ref={siblingRef} onClick={() => navigate("/schedule")} className="roi-cta">
                See How 1iQ Protects It
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </MetalFx>
            <p className="roi-cta-note">30-minute private briefing. No commitment required.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
