import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DraftPage, Sheet, CloseBand } from "../../components/Draft/DraftPage";
import { PRICING_FAQ } from "../../content/pricingFaqs";

/**
 * Pricing (/pricing). Every figure on this page is read live from the backend, so this page and the app's
 * own pricing page cannot drift apart: GET /subscription/public/pricing is open, needs no sign in, and
 * carries the founding places counter with it. FALLBACK below is what renders if that call fails, and it
 * is also what the prerender writes into the HTML at build time, so crawlers read real prices.
 *
 * There is no package to pick. A project's price comes from its own budget band, which 1iQ works out from
 * the project, so the band chosen here is carried to sign up as ?band=n only to show the person back the
 * figure they came for. Sign up opens and closes on the server's signupOpen flag, not on a deploy here.
 */

const API = "https://api.1iq.ai/api/subscription/public/pricing";
const SIGNUP = "https://app.1iq.ai/signup";

/** Mirrors src/subscription/pricing.ts in 1iqbackend. Shown only when the live call cannot be reached. */
const FALLBACK = {
  signupOpen: false,
  founding: { total: 50, taken: 0, left: 50 },
  project: [
    { band: 1, minBudget: 0, maxBudget: 2000000, listCents: 9900, foundingCents: 5900 },
    { band: 2, minBudget: 2000000, maxBudget: 10000000, listCents: 32900, foundingCents: 19900 },
    { band: 3, minBudget: 10000000, maxBudget: 50000000, listCents: 82900, foundingCents: 49900 },
    { band: 4, minBudget: 50000000, maxBudget: null, listCents: null, foundingCents: null },
  ],
  space: {
    monthly: { listCents: 24900, foundingCents: 14900 },
    setup: { listCents: 250000, foundingCents: 150000 },
    revisionPct: 25, includedSqFt: 5000, maxSqFt: 25000,
  },
  analysis: { listCents: 7900, foundingCents: 4900, creditDays: 30 },
};

const usd = (c) => (c === null || c === undefined ? null : `$${Math.round(c / 100).toLocaleString("en-US")}`);
const num = (n) => n.toLocaleString("en-US");
const money = (n) => (n >= 1000000 ? `$${Number((n / 1000000).toFixed(n % 1000000 ? 1 : 0))}M` : `$${num(Math.round(n / 1000))}K`);
const span = (b) => (b.maxBudget === null ? `Over ${money(b.minBudget)}` : b.minBudget === 0 ? `Up to ${money(b.maxBudget)}` : `${money(b.minBudget)} to ${money(b.maxBudget)}`);
const tab = (b) => (b.maxBudget === null ? `Over ${money(b.minBudget)}` : `To ${money(b.maxBudget)}`);

/** The founding price with the list price struck through beside it, while founding places are left. */
const Price = ({ foundingCents, listCents, founding }) => {
  const f = usd(foundingCents);
  const l = usd(listCents);
  if (!l && !f) return <b className="p-num">Quoted</b>;
  if (!founding || !f) return <b className="p-num">{l}</b>;
  return (
    <span className="pr-pair">
      <b className="p-num">{f}</b>
      <s aria-label={`List price ${l}`}>{l}</s>
    </span>
  );
};

const INCLUDED = [
  "The web app and the mobile app for your project team",
  "Unlimited field crew and field lead seats, at no charge",
  "AI schedules, live progress and owner reports",
  "Procore, Primavera P6 and Microsoft Project connected",
  "Schedule Analyzer on every schedule you load",
];

const BILLING = [
  ["Billing starts when the project does", "A project bills from its start date until you mark it complete. Projects still being put together are not billed, and finished ones stay readable and stop billing. One price a month for each project that is running."],
  ["The band follows the budget", "1iQ reads the band off the project: the contract plus approved change orders, or the amount billed to date if that is higher. It only ever moves up, and only after seven days notice, so a price never changes on you in the same week the budget does."],
  ["A late card does not shut the site down", "If a payment fails you have fourteen days to fix it before the web app turns read only. The field app keeps working for your crews the whole time, because a billing problem in the office is not a reason to stop the job recording work."],
  ["Cancel it yourself", "Your card, your invoices and your cancellation all live in the billing page under your own account. Nothing needs a call with us and nothing is on an annual commitment."],
];

const Pricing = () => {
  const [p, setP] = useState(FALLBACK);
  const [band, setBand] = useState(2);

  useEffect(() => {
    let on = true;
    fetch(API, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((body) => {
        const d = body && body.data ? body.data : body;
        if (on && d && Array.isArray(d.project) && d.project.length) setP(d);
      })
      .catch(() => undefined);
    return () => { on = false; };
  }, []);

  const left = p.founding && Number.isFinite(p.founding.left) ? p.founding.left : 0;
  const total = p.founding && p.founding.total ? p.founding.total : 50;
  const founding = left > 0;
  const picked = p.project.find((b) => b.band === band) || p.project[0];
  const lowest = p.project.find((b) => b.foundingCents || b.listCents) || p.project[0];
  const from = usd(founding && lowest.foundingCents ? lowest.foundingCents : lowest.listCents);
  const open = !!p.signupOpen;
  const start = `${SIGNUP}?band=${picked.band}`;

  const startCta = (cls) => (open
    ? <a href={start} className={cls}>Start on this price</a>
    : <Link to="/schedule" className={cls}>Book a briefing</Link>);

  return (
    <DraftPage>
      {/* The same two column hero the home page uses, with the price picker standing where its drawing does */}
      <section className="d-hero" id="top" aria-label="Pricing">
        <div className="wrap d-hero__in">
          <div>
            <span className="k">Pricing</span>
            <h1 className="h1">You pay for the project, <em>not for seats</em>.</h1>
            <p className="d-hero__lead">One price a month for each project that is running, set by that project&rsquo;s budget. The web app, the mobile app and the integrations are all in it, and your crews on site are free.</p>
            <div className="ctas">
              {startCta("pill pill--blue pill--lg")}
              <a href="#billing" className="pill pill--white pill--lg">How billing works</a>
            </div>
            <div className="d-dates" aria-label="What the price covers">
              <div><span className="k">Your crews</span><b>Free</b><small>Unlimited field seats, every project</small></div>
              <div><span className="k">Commitment</span><b>None</b><small>Monthly, cancel it yourself</small></div>
              <div><span className="k">From</span><b>{from}</b><small>A month, projects up to $2M</small></div>
            </div>
          </div>

          <div className="d-scene pr-scene">
            <div className="d-scene__tag">
              <span className="k">Your price</span>
              <span className="k">{founding ? `${left} of ${total} founding places left` : "List prices"}</span>
            </div>
            <div className="pr-scene__in">
              <span className="k">Your project&rsquo;s budget</span>
              <div className="pr-bands" role="group" aria-label="Project budget">
                {p.project.map((b) => (
                  <button
                    key={b.band}
                    type="button"
                    className={`roi-asset-btn${b.band === band ? " roi-asset-btn--active" : ""}`}
                    aria-pressed={b.band === band}
                    onClick={() => setBand(b.band)}
                  >
                    {tab(b)}
                  </button>
                ))}
              </div>

              <div className="pr-fig">
                <Price foundingCents={picked.foundingCents} listCents={picked.listCents} founding={founding} />
                <span className="pr-fig__per">{picked.maxBudget === null ? "Priced at a briefing" : "Per active project, per month"}</span>
                <p className="pr-fig__note">
                  {picked.maxBudget === null
                    ? "Above $50M the reporting is shaped by who needs to see what and how often, so the price is set once we have walked the project with you."
                    : `${span(picked)}. Everyone on the project is included, and a second project bills at its own band.`}
                </p>
              </div>

              <div className="pr-inc">
                <span className="k">In every band</span>
                <ul className="p-list">{INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>

              <div className="pr-scene__cta">{startCta("pill pill--blue")}</div>
            </div>
          </div>
        </div>
      </section>


      <Sheet no="02" name="Two apps" note="You need both" tone="paper">
        <div className="p-head reveal">
          <div className="ruler" />
          <h2 className="h2">One project, two halves. Neither works alone.</h2>
          <p className="d-p">1iQ is a dashboard and a field app that are the same thing seen from two ends. The price below covers both, because a project only makes sense when the office and the site are looking at the same live record.</p>
        </div>
        <div className="p-grid p-grid--2 reveal">
          <div className="p-cell">
            <span className="k">In the office</span>
            <h3>The web app is where the project is read</h3>
            <p>
              Schedule, forecast, budget, draws, risk and owner reporting. This is where a project manager
              decides what moves and an owner sees where their money stands. On its own it is a plan that
              nobody on site is updating, which is the problem every developer already has.
            </p>
            <div className="p-gap" />
            <a href="https://app.1iq.ai/login" className="pill pill--white">Open the web app</a>
          </div>
          <div className="p-cell">
            <span className="k">On site</span>
            <h3>The field app is where the project is recorded</h3>
            <p>
              Crews start and finish their own tasks, report issues and send photos from where the work is.
              Field crew and field lead seats are free and unlimited, deliberately, because charging per
              person is what stops field data ever arriving. On its own it is updates nobody can read.
            </p>
            <div className="pr-stores">
              <a href="https://apps.apple.com/us/app/id6755146159" target="_blank" rel="noopener noreferrer" className="pr-store">
                <span className="k">Download on the</span><b>App Store</b>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.oneiq" target="_blank" rel="noopener noreferrer" className="pr-store">
                <span className="k">Get it on</span><b>Google Play</b>
              </a>
            </div>
          </div>
        </div>
      </Sheet>

      <Sheet no="03" name="Add ons" note="Only when the job needs them">
        <div className="p-head reveal">
          <div className="ruler" />
          <h2 className="h2">Two things you can add, and one you can try for nothing.</h2>
          <p className="d-p">Neither is bundled into the plan, because most projects do not need them and nobody should pay for a 3D model of a space they can read off a floor plan.</p>
        </div>
        <div className="p-grid p-grid--2 reveal">
          <div className="p-cell">
            <span className="k">3D space model</span>
            <h3>The space your project is building</h3>
            <Price foundingCents={p.space.monthly.foundingCents} listCents={p.space.monthly.listCents} founding={founding} />
            <b className="p-sub">Per project, per month</b>
            <p>
              Plus {usd(founding ? p.space.setup.foundingCents : p.space.setup.listCents)} to build it, once per model, from your plan set.
              Spaces up to {num(p.space.includedSqFt)} SF on one level, larger ones up to {num(p.space.maxSqFt)} SF quoted.
              A revised plan set is {p.space.revisionPct} percent of the setup. Ready in five to ten business days.
            </p>
            <div className="p-gap" />
            <Link to="/services" className="pill pill--white">How it gets built</Link>
          </div>
          <div className="p-cell">
            <span className="k">Schedule analysis</span>
            <h3>Read the schedule before you sign it</h3>
            <Price foundingCents={p.analysis.foundingCents} listCents={p.analysis.listCents} founding={founding} />
            <b className="p-sub">Per schedule, no plan needed</b>
            <p>
              Sequencing, logic and dates checked against the conditions at that site, on any contractor baseline.
              The quick scorecard is free and needs no account. The full review comes off your first invoice if
              billing starts within {p.analysis.creditDays} days, so a project that goes live with us pays nothing for it.
            </p>
            <div className="p-gap" />
            <Link to="/construction-schedule-review" className="pill pill--white">Run one free</Link>
          </div>
        </div>
      </Sheet>

      <Sheet no="04" name="How billing works" note="Four things worth knowing" id="billing" tone="paper">
        <div className="p-head reveal">
          <div className="ruler" />
          <h2 className="h2">The parts people only find out later.</h2>
          <p className="d-p">Written down here instead, because every one of these is a question we would rather answer before you pay us than after.</p>
        </div>
        <div className="p-grid p-grid--4 reveal">
          {BILLING.map(([t, d], i) => (
            <div className="p-cell" key={t}><span className="k">0{i + 1}</span><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </Sheet>

      <Sheet no="05" name="Questions" note="Asked on most briefings">
        <div className="p-grid p-grid--2 reveal">
          {PRICING_FAQ.map(([q, a]) => (
            <div className="p-cell" key={q}><h3>{q}</h3><p>{a}</p></div>
          ))}
        </div>
        <p className="pr-legal reveal">
          Prices in US dollars. <Link to="/terms-of-use">Terms of Use</Link>, <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/refund-policy">Refunds and cancellation</Link>.
        </p>
      </Sheet>

      {open ? (
        <CloseBand
          label="Start with your own project"
          title="Put your project in and see the number."
          text="Set your company up, add a card on your billing page, and your first project is live the same day. Your crews come on for nothing."
          href={start}
          cta="Start on this price"
        />
      ) : (
        <CloseBand
          label="Start with a conversation"
          title="See your own project in 1iQ before you commit."
          text="Bring the schedule and the budget to a briefing. You will leave knowing what 1iQ would cost you and whether it is worth it, which is the only version of this conversation worth having."
          cta="Book a briefing"
        />
      )}
    </DraftPage>
  );
};

export default Pricing;
