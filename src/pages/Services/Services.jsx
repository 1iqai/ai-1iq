import { Link } from "react-router-dom";
import { DraftPage, PageHero, Sheet, CloseBand } from "../../components/Draft/DraftPage";

/**
 * Services (/services). The work the 1iQ team does for you, as opposed to the platform you run
 * yourself. Every engagement is a defined piece of work with a start, an end and a price, and
 * every one leaves the customer running on the platform afterwards. The page ends in a briefing,
 * not a checkout: it is how a project is scoped and how 1iQ meets the company first.
 */

const WORK = [
  [
    "Project setup",
    "Your first project live and verified",
    "We take your schedule, budget and team and stand the project up in 1iQ. The schedule comes across from Primavera P6, Microsoft Project, Procore or a spreadsheet, and we check the sequencing, the date order and the budget lines before anyone relies on it. You get a project your team can work from on day one rather than a blank system to fill in.",
  ],
  [
    "Schedule review",
    "Read the schedule before you sign it",
    "Your contractor's programme checked against what the job actually needs: sequence, logic, float, durations and the local conditions at that site. You find out where the plan is optimistic while you still have room to negotiate it, rather than discovering it on site in month seven.",
  ],
  [
    "3D space model",
    "The space your project is building",
    "Built from your plan set, tied to the schedule, so progress on the job shows up on the model. Useful where a floor plan and a bar chart are not enough to explain where the work has got to, and in rooms full of people who do not read schedules.",
  ],
  [
    "Connected systems",
    "The tools your teams already use",
    "Procore, Primavera P6, Microsoft Project and Autodesk connected so data moves without anybody retyping it. Your general contractor carries on with their tools and you stop waiting on exports.",
  ],
  [
    "Portfolio and programme",
    "More than one project, or more than $50M",
    "Several projects read together, with reporting built for the people who put the capital in. Priced after a briefing, because at this size the work is shaped by who needs to see what, and how often.",
  ],
];

const RUN = [
  ["Briefing", "A call about the project, not a product demo. We look at what you have, what is already running and whether 1iQ is the right fit. If it is not, we will say so."],
  ["Scope and price", "A written scope with a fixed price and a date. Nothing starts until you have both in front of you."],
  ["Delivery", "We do the work. You see it as it goes, rather than at the end."],
  ["You carry on", "The project stays live on the platform and your team runs it. The engagement ends, the project does not."],
];

const COST = [
  ["3D space model", "$1,500", "Setup for a space up to 5,000 square feet on one level, then $149 a month. Larger or multi level spaces are quoted. A revised plan set is 25 percent of the setup."],
  ["Schedule review", "From free", "A scorecard on any schedule at no cost. The full review is $49, and it comes off your first month if the project goes live with us inside thirty days."],
  ["Project setup", "Quoted", "Priced on the size of the schedule and how many systems it comes from. Most are a week or less."],
  ["Programme work", "Quoted", "Projects over $50M and portfolios, scoped at the briefing."],
];

const Services = () => (
  <DraftPage>
    <PageHero
      sheet="Sheet S1 · Services"
      note="Work the 1iQ team does with you"
      kicker="Services"
      title="Some of it you run. Some of it we do with you."
      lead="The platform is built so a development team can run it themselves. Getting a live project into it, reading a contractor's schedule properly, or connecting the systems around it is work, and it is work we do."
    >
      <Link to="/schedule" className="pill pill--blue pill--lg">Book a briefing</Link>
      <a href="#what" className="pill pill--white pill--lg">See the work</a>
    </PageHero>

    <Sheet no="S2" name="The work" note="Five engagements" id="what" tone="paper">
      <div className="p-head reveal">
        <div className="ruler" />
        <h2 className="h2">Five pieces of work, each with an end.</h2>
        <p className="d-p">Every one is scoped, priced and finished. None of them leaves you dependent on us afterwards, which is rather the point of building the platform in the first place.</p>
      </div>
      <div className="p-grid p-grid--3 reveal">
        {WORK.map(([t, s, d], i) => (
          <div className="p-cell" key={t}>
            <span className="k">0{i + 1}</span>
            <h3>{t}</h3>
            <b className="p-sub">{s}</b>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </Sheet>

    <Sheet no="S3" name="How it runs" note="Briefing to handover">
      <div className="p-head reveal">
        <div className="ruler" />
        <h2 className="h2">How an engagement runs.</h2>
        <p className="d-p">Four steps, and you can stop after the first one.</p>
      </div>
      <div className="p-grid p-grid--4 reveal">
        {RUN.map(([t, d], i) => <div className="p-cell" key={t}><span className="k">Step {i + 1}</span><h3>{t}</h3><p>{d}</p></div>)}
      </div>
    </Sheet>

    <Sheet no="S4" name="What it costs" note="Published where we can" tone="paper">
      <div className="p-head reveal">
        <div className="ruler" />
        <h2 className="h2">What it costs.</h2>
        <p className="d-p">Published where a price can be published honestly, and quoted where the work genuinely varies. The platform itself starts at $59 a month for an active project and is priced by the project's budget.</p>
      </div>
      <div className="p-grid p-grid--4 reveal">
        {COST.map(([t, n, d]) => <div className="p-cell" key={t}><span className="k">{t}</span><b className="p-num">{n}</b><p>{d}</p></div>)}
      </div>
    </Sheet>

    <CloseBand
      label="Start with a conversation"
      title="Tell us about the project."
      text="A briefing is a call about your development, not a product walkthrough. Bring the schedule if you have one. You will leave knowing whether 1iQ fits and what it would cost."
      cta="Book a briefing"
    />
  </DraftPage>
);

export default Services;
