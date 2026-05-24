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

// ─── Core calculation engine — Developer ROI Model ────────────────────────────
function calcROI({ projectBudget, consultantFee, overrunRisk }) {
  // 1iQ fee — 2.5% capped at $1.25M for projects above $50M
  const iqFee = projectBudget > 50_000_000
    ? 1_250_000
    : projectBudget * 0.025;

  // Feasibility study savings vs traditional consultant ($50K–$200K)
  const feasibilitySavings = Math.min(consultantFee, 200_000);

  // Overrun protection — industry average 20–30% overrun on mid-market projects
  // 1iQ's predictive layer targets catching 50% of that exposure
  const overrunExposure = projectBudget * (overrunRisk / 100);
  const overrunProtection = overrunExposure * 0.5;

  // Investor reporting labor savings — estimated $75K/yr average
  const reportingSavings = 75_000;

  // Owner's rep / consultant savings — $180K–$300K/yr replaced by 1iQ
  const ownerRepSavings = Math.min(projectBudget * 0.015, 240_000);

  // Total benefit
  const totalBenefit = feasibilitySavings + overrunProtection + reportingSavings + ownerRepSavings;

  // Net ROI
  const netBenefit = totalBenefit - iqFee;
  const roiMultiple = totalBenefit / iqFee;

  return {
    iqFee: Math.round(iqFee),
    feasibilitySavings: Math.round(feasibilitySavings),
    overrunProtection: Math.round(overrunProtection),
    reportingSavings: Math.round(reportingSavings),
    ownerRepSavings: Math.round(ownerRepSavings),
    totalBenefit: Math.round(totalBenefit),
    netBenefit: Math.round(netBenefit),
    roiMultiple: roiMultiple.toFixed(1),
  };
}

// ─── Slider component ─────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, onChange, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="roi-slider">
      <div className="roi-slider__header">
        <span className="roi-slider__label">{label}</span>
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
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
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
  const [projectBudget, setProjectBudget] = useState(20_000_000);
  const [consultantFee, setConsultantFee] = useState(75_000);
  const [overrunRisk, setOverrunRisk] = useState(25);

  const results = useMemo(
    () => calcROI({ projectBudget, consultantFee, overrunRisk }),
    [projectBudget, consultantFee, overrunRisk]
  );

  return (
    <section id="roi-calculator" className="roi-section">

      <div className="roi-section__header">
        <h2 className="roi-section__title">
          What is your capital exposure on this project?
        </h2>
        <p className="roi-section__subtitle">
          Put in your numbers and see the 1iQ ROI case in 30 seconds.
        </p>
      </div>

      <div className="roi-layout">

        {/* ── Left: Inputs ── */}
        <div className="roi-inputs">
          <p className="roi-inputs__label">YOUR PROJECT</p>

          <Slider
            label="Total Project Budget"
            value={projectBudget}
            min={5_000_000}
            max={200_000_000}
            step={5_000_000}
            onChange={setProjectBudget}
            format={(v) =>
              v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(0)}M` : `$${v / 1_000}K`
            }
          />

          <Slider
            label="Annual Consultant / Owner's Rep Fees"
            value={consultantFee}
            min={25_000}
            max={500_000}
            step={25_000}
            onChange={setConsultantFee}
            format={(v) => `$${(v / 1_000).toFixed(0)}K`}
          />

          <Slider
            label="Estimated Overrun Risk"
            value={overrunRisk}
            min={5}
            max={40}
            step={5}
            onChange={setOverrunRisk}
            format={(v) => `${v}%`}
          />

          <p className="roi-inputs__footnote">
            Based on McKinsey, FMI, and CII industry research.{" "}
            <a href="/platform" className="roi-inputs__link">
              See full methodology →
            </a>
          </p>
        </div>

        {/* ── Right: Results ── */}
        <div className="roi-results">

          <div className="roi-stat roi-stat--primary">
            <span className="roi-stat__number">
              {results.roiMultiple}x
            </span>
            <p className="roi-stat__label">Return on 1iQ investment for this project</p>
          </div>

          <div className="roi-stat-grid">
            <div className="roi-stat roi-stat--secondary">
              <span className="roi-stat__number roi-stat__number--sm">
                {fmt(results.feasibilitySavings)}
              </span>
              <p className="roi-stat__label">Feasibility study savings</p>
            </div>

            <div className="roi-stat roi-stat--secondary">
              <span className="roi-stat__number roi-stat__number--sm">
                {fmt(results.overrunProtection)}
              </span>
              <p className="roi-stat__label">Overrun exposure protected</p>
            </div>

            <div className="roi-stat roi-stat--secondary roi-stat--highlight">
              <span className="roi-stat__number roi-stat__number--sm">
                {fmt(results.totalBenefit)}
              </span>
              <p className="roi-stat__label">Total capital protection value</p>
            </div>
          </div>

          <div className="roi-cost-callout">
            <span className="roi-cost-callout__label">1iQ fee for this project</span>
            <span className="roi-cost-callout__value">{fmt(results.iqFee)}</span>
            <span className="roi-cost-callout__note">
              2.5% of project budget, capped at $1.25M for projects above $50M. Priced against a full-time owner's rep at $180K to $300K per year.
            </span>
          </div>

          <MetalFx preset="chromatic" strength={0.90} reflectionTargets={[siblingRef]}>
            <button
              ref={siblingRef}
              onClick={() => navigate("/schedule")}
              className="roi-cta"
            >
              Run a Free Feasibility Analysis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </MetalFx>

        </div>
      </div>
    </section>
  );
}
