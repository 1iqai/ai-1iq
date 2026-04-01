import { useState, useMemo } from "react";
import "./ROICalculator.css";

// ─── Formatting helpers ───────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `$${Math.round(n / 1_000)}K`
    : `$${Math.round(n)}`;

const fmtHours = (n) =>
  n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : `${Math.round(n)}`;

// ─── Core calculation engine (mirrors Executive_ROI sheet — Expected scenario) ─
function calcROI({ numPMs, salary, projectBudget }) {
  const burdenMultiplier = 1.35;
  const workHours = 2080;
  const hourlyRate = (salary * burdenMultiplier) / workHours;

  // Time savings per PM per year (from Traditional_vs_1iQ sheet)
  const schedulingHoursSaved = 332;   // 336 traditional → 4 with 1iQ
  const reportingHoursSaved = 182;    // 208 traditional → 26 with 1iQ
  const chatHoursSaved = 109.2;       // 156 traditional → 46.8 with 1iQ
  const adminHoursSaved = 208;        // 520 traditional → 312 with 1iQ
  const totalHoursPerPM = schedulingHoursSaved + reportingHoursSaved + chatHoursSaved + adminHoursSaved;
  // = 831 hours

  // Labor savings (hourly rate × hours saved)
  const laborSavingsPerPM = totalHoursPerPM * hourlyRate;

  // Non-time-based savings — Expected/Mid scenario (from Executive_ROI sheet)
  const delayAvoidancePerPM = 10_000;   // 2 delay days × $5K/day
  const reworkAvoidancePerPM = 8_000;   // CII research: tech reduces rework cost

  // Total direct savings
  const directSavingsPerPM = laborSavingsPerPM + delayAvoidancePerPM + reworkAvoidancePerPM;
  const totalDirectSavings = directSavingsPerPM * numPMs;

  // Revenue upside — 1 extra project per PM per year at 7% gross margin
  const newRevenueCapacity = numPMs * 1 * projectBudget * 0.07;

  // True cost (fee embedded in project budget as 2.5% soft cost)
  const onboardingCost = numPMs * 1_000;
  const trueOutOfPocket = onboardingCost;

  // Net Year 1 benefit
  const netBenefitYear1 = totalDirectSavings + newRevenueCapacity - trueOutOfPocket;

  // ROI %
  const roi = (netBenefitYear1 / trueOutOfPocket) * 100;

  return {
    hoursGivenBack: Math.round(totalHoursPerPM * numPMs),
    totalDirectSavings: Math.round(totalDirectSavings),
    newRevenueCapacity: Math.round(newRevenueCapacity),
    netBenefitYear1: Math.round(netBenefitYear1),
    trueOutOfPocket,
    roi: Math.round(roi),
    hourlyRate: hourlyRate.toFixed(2),
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
  const [numPMs, setNumPMs] = useState(5);
  const [salary, setSalary] = useState(105_000);
  const [projectBudget, setProjectBudget] = useState(5_000_000);

  const results = useMemo(
    () => calcROI({ numPMs, salary, projectBudget }),
    [numPMs, salary, projectBudget]
  );

  return (
    <section id="roi-calculator" className="roi-section">
      {/* Header */}
      <div className="roi-section__header">
        <h2 className="roi-section__title">
          What is manual work actually costing you?
        </h2>
        <p className="roi-section__subtitle">
          Most firms have no idea. Put in your numbers and find out in 30 seconds.
        </p>
      </div>

      {/* Calculator layout */}
      <div className="roi-layout">

        {/* ── Left: Inputs ── */}
        <div className="roi-inputs">
          <p className="roi-inputs__label">YOUR TEAM</p>

          <Slider
            label="Number of Project Managers"
            value={numPMs}
            min={1}
            max={50}
            step={1}
            onChange={setNumPMs}
            format={(v) => `${v} PM${v !== 1 ? "s" : ""}`}
          />

          <Slider
            label="Average PM Salary"
            value={salary}
            min={60_000}
            max={200_000}
            step={5_000}
            onChange={setSalary}
            format={(v) => `$${(v / 1_000).toFixed(0)}K`}
          />

          <Slider
            label="Average Project Budget"
            value={projectBudget}
            min={1_000_000}
            max={50_000_000}
            step={1_000_000}
            onChange={setProjectBudget}
            format={(v) =>
              v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(0)}M` : `$${v / 1_000}K`
            }
          />

          <p className="roi-inputs__footnote">
            Based on FMI, ENR, and CII industry research. Expected scenario.{" "}
            <a href="/platform" className="roi-inputs__link">
              See full methodology →
            </a>
          </p>
        </div>

        {/* ── Right: Results ── */}
        <div className="roi-results">

          {/* Top stat — Hours */}
          <div className="roi-stat roi-stat--primary">
            <span className="roi-stat__number">
              {fmtHours(results.hoursGivenBack)}
            </span>
            <span className="roi-stat__unit">hrs</span>
            <p className="roi-stat__label">Hours given back to your team annually</p>
          </div>

          {/* Grid of 3 supporting stats */}
          <div className="roi-stat-grid">
            <div className="roi-stat roi-stat--secondary">
              <span className="roi-stat__number roi-stat__number--sm">
                {fmt(results.totalDirectSavings)}
              </span>
              <p className="roi-stat__label">Direct labor &amp; cost savings, Year 1</p>
            </div>

            <div className="roi-stat roi-stat--secondary">
              <span className="roi-stat__number roi-stat__number--sm">
                {fmt(results.newRevenueCapacity)}
              </span>
              <p className="roi-stat__label">New project revenue capacity</p>
            </div>

            <div className="roi-stat roi-stat--secondary roi-stat--highlight">
              <span className="roi-stat__number roi-stat__number--sm">
                {fmt(results.netBenefitYear1)}
              </span>
              <p className="roi-stat__label">Total net benefit, Year 1</p>
            </div>
          </div>

          {/* True cost callout */}
          <div className="roi-cost-callout">
            <span className="roi-cost-callout__label">True out-of-pocket cost to your firm</span>
            <span className="roi-cost-callout__value">{fmt(results.trueOutOfPocket)}</span>
            <span className="roi-cost-callout__note">
              1iQ fee runs as a 2.5% project soft cost — already in your budget. You only pay $1,000/PM for onboarding.
            </span>
          </div>

          {/* CTA */}
          {/* CTA */}
          <a href="https://calendly.com/ck-1iq/30min" target="_blank" rel="noopener noreferrer" className="roi-cta">
            Book Your ROI Walkthrough
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
