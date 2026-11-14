import { Link } from "react-router-dom";
import { DraftPage, PageHero, Sheet, CloseBand } from "../../components/Draft/DraftPage";
import ROICalculator from "../../components/ROICalculator";

const SAYS = [
  "The information you are making decisions on is 2 to 4 weeks old.",
  "The consultant between you and ground truth costs $180K to $300K a year.",
  "The average mid market development overruns by 20 to 30 percent. That is a visibility problem, not fate.",
];
const LAYERS = [
  ["Before you build", "Feasibility", "Generate execution risk models and schedule projections from a handful of project inputs. Replace $50K to $200K in consultant feasibility fees with intelligence ready in hours."],
  ["While you build", "Active execution oversight", "A direct line from the jobsite to your dashboard. You see what is happening on site as it happens, with nobody filtering it on the way."],
  ["When you report", "Investor grade reporting", "Quarterly reporting written from live project data. Replace manual compilation with reports on demand that protect capital relationships and show the work is under control."],
];

const Developer = () => (
  <DraftPage>
    <PageHero
      sheet="Sheet D1 · For developers"
      note="Owners, family offices and private equity"
      kicker="For developers"
      title="You are committing $30M to a project. What are you actually seeing?"
      lead="If your answer involves a consultant's weekly update or a PDF report, 1iQ was built to change that."
    >
      <Link to="/schedule" className="pill pill--blue pill--lg">See 1iQ on a real project</Link>
      <a href="#roi-calculator" className="pill pill--white pill--lg">Estimate your exposure</a>
    </PageHero>

    <Sheet no="D2" name="The problem" note="What it costs to find out late">
      <div className="p-says reveal">
        {SAYS.map((s, i) => <div key={s}><i>0{i + 1}</i><p>{s}</p></div>)}
      </div>
    </Sheet>

    <Sheet no="D3" name="Three layers" note="From feasibility to investor reporting" tone="paper">
      <div className="p-head reveal">
        <div className="ruler" />
        <h2 className="h2">Three intelligence layers.</h2>
        <p className="d-p">1iQ works across the whole development lifecycle, from feasibility before you build through to investor reporting.</p>
      </div>
      <div className="p-grid p-grid--3 reveal">
        {LAYERS.map(([k, t, d]) => <div className="p-cell" key={t}><span className="k">{k}</span><h3>{t}</h3><p>{d}</p></div>)}
      </div>
    </Sheet>

    <Sheet no="D4" name="Estimate" note="Built on your numbers">
      <div className="p-head reveal">
        <div className="ruler" />
        <h2 className="h2">What is your capital exposure on this project?</h2>
        <p className="d-p">Enter your project constraints and see what gaps in visibility could cost on an active development.</p>
      </div>
      <div className="reveal"><ROICalculator /></div>
    </Sheet>

    <CloseBand label="30 minutes" title="Book your development intelligence briefing." text="See 1iQ running on a real development project, built around your asset class and capital challenge." cta="Book your briefing" />
  </DraftPage>
);

export default Developer;
