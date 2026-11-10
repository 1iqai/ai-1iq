import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BOOK } from "./parts";

/**
 * Estimate your exposure. Every figure adds up:
 *   monthly carrying cost = loan x rate / 12 + taxes + insurance + overhead
 *   delay cost            = carrying cost x typical months of delay for the asset class x market factor
 *   overrun risk          = budget x typical overrun rate for the asset class x market factor
 *   capital at risk       = delay cost + overrun risk
 * Typical delays and overrun rates: FMI Q4 2025 Construction Outlook, KPMG Global Construction Survey 2025.
 */
export const ASSETS = [
  { value: "multifamily", label: "Multifamily", delayMonths: 2.8, overrun: 0.21 },
  { value: "hospitality", label: "Hospitality", delayMonths: 4.6, overrun: 0.28 },
  { value: "industrial", label: "Industrial and logistics", delayMonths: 2.4, overrun: 0.18 },
  { value: "mixed-use", label: "Mixed use", delayMonths: 3.5, overrun: 0.25 },
  { value: "data-center", label: "Data centers", delayMonths: 5.2, overrun: 0.32 },
  { value: "commercial", label: "Commercial", delayMonths: 3.1, overrun: 0.22 },
];
export const MARKETS = [
  { value: "1", label: "Established (US, UK, Canada, EU)", factor: 1.0 },
  { value: "2", label: "High growth (Brazil, Mexico, Gulf)", factor: 1.25 },
  { value: "3", label: "Emerging (Nigeria, India, SE Asia)", factor: 1.55 },
];

export function exposure({ asset, market, budget, months, loanPct = 0.7, rate = 0.08, taxes = 8000, insurance = 6000, overhead = 15000 }) {
  const a = ASSETS.find((x) => x.value === asset) || ASSETS[0];
  const m = MARKETS.find((x) => x.value === market) || MARKETS[0];
  const carrying = (budget * loanPct * rate) / 12 + taxes + insurance + overhead;
  const delayMonths = a.delayMonths * m.factor;
  const delayCost = carrying * delayMonths;
  const overrunRisk = budget * a.overrun * m.factor;
  return {
    carrying: Math.round(carrying),
    delayMonths: Math.round(delayMonths * 10) / 10,
    delayCost: Math.round(delayCost),
    overrunRisk: Math.round(overrunRisk),
    atRisk: Math.round(delayCost) + Math.round(overrunRisk),
    slipShare: Math.round((delayMonths / months) * 100),
  };
}

const money = (n) => (n >= 1e6 ? `$${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M` : `$${Math.round(n / 1000)}K`);
const full = (n) => `$${n.toLocaleString("en-US")}`;

const Exposure = () => {
  const [asset, setAsset] = useState("multifamily");
  const [market, setMarket] = useState("1");
  const [budget, setBudget] = useState(20_000_000);
  const [months, setMonths] = useState(18);
  const r = useMemo(() => exposure({ asset, market, budget, months }), [asset, market, budget, months]);
  const delayShare = r.atRisk ? (r.delayCost / r.atRisk) * 100 : 0;

  return (
    <div className="h26-exposure">
      <form className="h26-card h26-exp-in" onSubmit={(e) => e.preventDefault()} aria-label="Your project">
        <label className="h26-field" htmlFor="exp-asset">Asset class
          <select id="exp-asset" value={asset} onChange={(e) => setAsset(e.target.value)}>
            {ASSETS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </label>
        <label className="h26-field" htmlFor="exp-market">Market
          <select id="exp-market" value={market} onChange={(e) => setMarket(e.target.value)}>
            {MARKETS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
        <label className="h26-field" htmlFor="exp-budget">
          <span className="h26-row"><span>Project budget</span><b className="h26-num">{money(budget)}</b></span>
          <input id="exp-budget" type="range" min={5_000_000} max={200_000_000} step={1_000_000} value={budget} onChange={(e) => setBudget(+e.target.value)} />
        </label>
        <label className="h26-field" htmlFor="exp-months">
          <span className="h26-row"><span>Months to build</span><b className="h26-num">{months}</b></span>
          <input id="exp-months" type="range" min={6} max={60} step={1} value={months} onChange={(e) => setMonths(+e.target.value)} />
        </label>
        <p className="h26-xs h26-muted">Assumes a loan of 70% of budget at 8%, plus $29,000 a month in taxes, insurance and overhead. Typical delays and overruns by asset class from the FMI Q4 2025 Construction Outlook and the KPMG Global Construction Survey 2025.</p>
      </form>

      <div className="h26-card h26-exp-out" aria-live="polite">
        <div className="h26-label">Capital at risk on this project</div>
        <div className="h26-num h26-huge" data-testid="exp-at-risk">{full(r.atRisk)}</div>
        <div className="h26-split" aria-hidden="true">
          <span className="h26-split__a" style={{ width: `${delayShare}%` }} />
          <span className="h26-split__b" style={{ width: `${100 - delayShare}%` }} />
        </div>
        <div className="h26-exp-rows">
          <div className="h26-row">
            <span><i className="h26-key h26-key--a" />Delay cost: {r.delayMonths} months of carrying cost</span>
            <b className="h26-num" data-testid="exp-delay">{full(r.delayCost)}</b>
          </div>
          <div className="h26-row">
            <span><i className="h26-key h26-key--b" />Overrun risk at the typical rate</span>
            <b className="h26-num" data-testid="exp-overrun">{full(r.overrunRisk)}</b>
          </div>
        </div>
        <div className="h26-sep" />
        <p className="h26-small">Every month this project slips costs about <b className="h26-num">{full(r.carrying)}</b> in carrying cost alone. A typical slip of {r.delayMonths} months adds {r.slipShare}% to a build of {months} months.</p>
        <Link to={BOOK} className="h26-btn h26-btn--primary h26-btn--block">Book a briefing about this project</Link>
      </div>
    </div>
  );
};

export default Exposure;
