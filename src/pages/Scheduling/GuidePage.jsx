import { Link } from "react-router-dom";
import { DraftPage, PageHero, Sheet, CloseBand } from "../../components/Draft/DraftPage";
import Scorecard from "../../components/Draft/Scorecard";

/**
 * A scheduling guide page. Written to be found and quoted: the answer comes first, each section answers one
 * question in plain words, and the same questions and answers are given to search engines as structured data
 * (src/seo.js). The scorecard sits in the middle; the full review stays inside 1iQ.
 */
const GuidePage = ({ g }) => (
  <DraftPage>
    <PageHero sheet={g.sheet} note={g.note} kicker={g.kicker} title={g.title} lead={g.lead}>
      <a href="#scorecard" className="pill pill--blue pill--lg">Score your schedule</a>
      <Link to="/schedule" className="pill pill--white pill--lg">Book a briefing</Link>
    </PageHero>

    <Sheet no={`${g.code}2`} name="The short answer" note={g.answerNote}>
      <div className="p-answer">
        <span className="k">{g.answerQ}</span>
        <p>{g.answer}</p>
      </div>
      <p className="p-by">By Chimi Kadiya, founder of 1iQ · construction program and project manager for more than 15 years · updated November 2026</p>
    </Sheet>

    <Sheet no={`${g.code}3`} name={g.checksName} note={g.checksNote} tone="paper">
      <div className="p-head">
        <div className="ruler" />
        <h2 className="h2">{g.checksTitle}</h2>
        <p className="d-p">{g.checksLead}</p>
      </div>
      <div className="p-checks">
        {g.checks.map(([t, d, w], i) => <div key={t}><i>{String(i + 1).padStart(2, "0")}</i><h3>{t}</h3><p>{d} <b>{w}</b></p></div>)}
      </div>
    </Sheet>

    <Sheet no={`${g.code}4`} name="Schedule scorecard" note="P6, Microsoft Project or Excel">
      <div className="p-scorewrap">
        <div>
          <div className="ruler" />
          <h2 className="h2">{g.scoreTitle}</h2>
          <p className="d-p">{g.scoreLead}</p>
          <div className="d-pts">
            <div><i>01</i><div><b>A score out of 100.</b> Based on the DCMA 14 point quality checks and on logic problems that would let a slip hide.</div></div>
            <div><i>02</i><div><b>The checks passed and failed.</b> So you know how far the schedule is from clean.</div></div>
            <div><i>03</i><div><b>The three biggest problems, by name.</b> The full list, the activities involved and a corrected copy are part of the full review.</div></div>
          </div>
        </div>
        <Scorecard audience={g.audience} />
      </div>
    </Sheet>

    <Sheet no={`${g.code}5`} name={g.useName} note={g.useNote} tone="paper">
      <div className="p-head">
        <div className="ruler" />
        <h2 className="h2">{g.useTitle}</h2>
      </div>
      <div className="p-grid p-grid--3">
        {g.use.map(([k, t, d]) => <div className="p-cell" key={t}><span className="k">{k}</span><h3>{t}</h3><p>{d}</p></div>)}
      </div>
    </Sheet>

    <Sheet no={`${g.code}6`} name="After the schedule is agreed" note="Planned against what really happens">
      <div className="p-head">
        <div className="ruler" />
        <h2 className="h2">{g.afterTitle}</h2>
      </div>
      <div className="p-prose">{g.after.map((p) => <p key={p}>{p}</p>)}</div>
      <div className="p-related">
        <Link to={g.other[0]} className="pill pill--white">{g.other[1]}</Link>
        <Link to="/platform" className="pill pill--white">See the platform</Link>
      </div>
    </Sheet>

    <Sheet no={`${g.code}7`} name="Questions" note="Short answers" tone="paper">
      <div className="p-head">
        <div className="ruler" />
        <h2 className="h2">Questions people ask.</h2>
      </div>
      <div className="p-faq">
        {g.faq.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}
      </div>
    </Sheet>

    <CloseBand label="30 minutes" title={g.closeTitle} text={g.closeText} cta="Book a briefing" />
  </DraftPage>
);

export default GuidePage;
