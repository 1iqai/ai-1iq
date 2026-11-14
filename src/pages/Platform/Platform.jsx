import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { DraftPage, PageHero, Sheet, CloseBand } from "../../components/Draft/DraftPage";
import PlatformSlider from "../../components/PlatformSlider";

const STACK = ["Microsoft Project", "Excel and Google Sheets", "QuickBooks and Sage", "Procore and Buildertrend", "Email and Slack", "DocuSign"];
const GET = ["Live dashboard", "Risk analysis", "Investor reporting", "Early alerts", "Field updates on mobile", "Ask 1iQ"];
const NOTES = [
  ["No platform migration", "Your project team keeps using Procore. You keep using Excel. 1iQ connects the data and adds intelligence on top."],
  ["Built to connect", "1iQ pulls data from the tools you already have and sends intelligence back to where you need it."],
  ["Same workflow, better data", "Your team's process does not change. The quality and speed of the information flowing through it does."],
];
const ROI = [
  ["Overrun protection", "$4M to $6M", "Average overrun exposure protected on a $20M project through early risk identification."],
  ["Feasibility intelligence", "$50K to $200K", "What a traditional consultant feasibility study costs, replaced by analysis 1iQ generates."],
  ["Owner's rep fees", "$300K a year", "Direct field visibility removes the need for owner's representative fees of $10K to $25K a month."],
  ["Investor reporting", "$100K a year", "Internal labor saved by automated quarterly reporting and investor updates on demand."],
];

const Platform = () => {
  const location = useLocation();

  // a link such as /platform#field opens that part of the page
  useEffect(() => {
    const id = (location.state && location.state.scrollTo) || location.hash.slice(1);
    if (!id) return undefined;
    const t = setTimeout(() => document.getElementById(id === "core" || id === "field" || id === "intelligence" ? "parts" : id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    return () => clearTimeout(t);
  }, [location]);

  return (
    <DraftPage>
      <PageHero
        sheet="Sheet P1 · Platform"
        note="Development intelligence platform"
        kicker="The platform"
        title="The operating intelligence your development business needs."
        lead="Real estate developers manage multi million dollar projects with scattered information, reports that are weeks old and consultants in between. 1iQ connects your field operations to your capital decisions as they happen."
      >
        <Link to="/schedule" className="pill pill--blue pill--lg">Book an intelligence demo</Link>
        <a href="#parts" className="pill pill--white pill--lg">See the four parts</a>
      </PageHero>

      <Sheet no="P2" name="How it connects" note="Works with what you have" tone="paper">
        <div className="p-head reveal">
          <div className="ruler" />
          <h2 className="h2">Connects to your existing workflow.</h2>
          <p className="d-p">1iQ works with your current systems instead of replacing them. Your team keeps the tools they know while 1iQ builds the intelligence layer.</p>
        </div>
        <div className="reveal">
          <div className="p-flow">
            <div className="p-flow__side"><span className="k">Your current stack</span><div className="p-chips">{STACK.map((s) => <span key={s}>{s}</span>)}</div></div>
            <div className="p-flow__mid" aria-hidden="true"><div className="p-core"><img src="/assets/img/home/logo-light.png" alt="" /><span>Intelligence<br />layer</span></div></div>
            <div className="p-flow__side p-flow__side--out"><span className="k">What you get</span><div className="p-chips">{GET.map((s) => <span key={s}>{s}</span>)}</div></div>
          </div>
          <div className="p-grid p-grid--3">
            {NOTES.map(([t, d], i) => <div className="p-cell" key={t}><span className="k">0{i + 1}</span><h3>{t}</h3><p>{d}</p></div>)}
          </div>
        </div>
      </Sheet>

      <PlatformSlider />

      <Sheet no="P4" name="Platform return" note="What it protects" tone="paper">
        <div className="p-head reveal">
          <div className="ruler" />
          <h2 className="h2">Capital protection that pays for itself.</h2>
          <p className="d-p">1iQ returns its cost through lower risk, time saved and consultant fees you no longer need.</p>
        </div>
        <div className="p-grid p-grid--4 reveal">
          {ROI.map(([t, n, d]) => <div className="p-cell" key={t}><span className="k">{t}</span><b className="p-num">{n}</b><p>{d}</p></div>)}
        </div>
      </Sheet>

      <CloseBand label="Start protecting your capital" title="See 1iQ intelligence in action." text="Book a live demo with real project data. Our team will show you how 1iQ turns scattered information into intelligence that protects your capital." cta="Book a live demo" />
    </DraftPage>
  );
};

export default Platform;
