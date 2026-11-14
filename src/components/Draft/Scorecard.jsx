import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "https://api.1iq.ai/api";
const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = /\.(xer|xml|xlsx|csv)$/i;

const day = (iso) => {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
};

// Tell the 1iQ team someone used the scorecard (the same form service the other pages use). Never blocks the result.
const sendLead = (email, fileName, card, audience) => {
  const form = new FormData();
  form.append("access_key", "aff2eb3e-c155-4a3d-987e-bf059301f9b3");
  form.append("subject", `Schedule scorecard: ${email} scored ${card.score}`);
  form.append("from_name", "1iQ website scorecard");
  form.append("email", email);
  form.append("message", `Page: ${audience}\nFile: ${fileName}\nScore: ${card.score} of 100\nChecks passed: ${card.checks.passed} of ${card.checks.total}\nActivities: ${card.activities}\nResult: ${card.verdict === "track" ? "Ready to track" : "Fix before tracking"}`);
  fetch("https://api.web3forms.com/submit", { method: "POST", body: form }).catch(() => {});
};

/**
 * The schedule scorecard: upload a P6, Microsoft Project or Excel schedule and see a short result. The full
 * findings stay inside 1iQ; this shows a score, the checks passed and the three biggest problems by name.
 */
export default function Scorecard({ audience = "developer" }) {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [card, setCard] = useState(null);
  const input = useRef(null);

  const pick = (f) => {
    setError("");
    if (!f) return setFile(null);
    if (!TYPES.test(f.name)) return setError("Upload a P6 file (.xer or .xml), a Microsoft Project XML file or an Excel sheet (.xlsx or .csv).");
    if (f.size > MAX_BYTES) return setError("The file is over 10 MB.");
    setFile(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())) return setError("Enter your work email to see the scorecard.");
    if (!file) return setError("Choose a schedule file to upload.");
    setBusy(true); setError("");
    try {
      const body = new FormData();
      body.append("email", email.trim());
      body.append("file", file);
      const res = await fetch(`${API}/schedule-scorecard`, { method: "POST", body });
      const json = await res.json().catch(() => null);
      // the server's own words only when they are about this upload (a bad file, too big, too many tries)
      if (!res.ok || !json?.success) throw new Error([400, 413, 422, 429].includes(res.status) && json?.message ? json.message : "The scorecard is not available right now. Please try again in a few minutes.");
      setCard(json.data);
      sendLead(email.trim(), file.name, json.data, audience);
    } catch (err) {
      setError(err instanceof TypeError ? "The scorecard is not available right now. Please try again in a few minutes." : err.message);
    } finally {
      setBusy(false);
    }
  };

  const again = () => { setCard(null); setFile(null); setError(""); if (input.current) input.current.value = ""; };

  if (card) {
    const good = card.verdict === "track";
    return (
      <div className="p-score" id="scorecard" aria-live="polite">
        <div className="p-score__h"><span className="k">Schedule scorecard</span><span className="k">{file?.name}</span></div>
        <div className="p-score__top">
          <div className="p-score__num"><b className={good ? "is-good" : "is-late"}>{card.score}</b><span>of 100</span></div>
          <div className="p-score__sum">
            <span className={`p-stamp${good ? " p-stamp--good" : ""}`}>{good ? "Ready to track" : "Fix before tracking"}</span>
            <p>{good
              ? "The logic holds, so a slip will show the moment it happens."
              : "Some of the logic would let a slip hide or give a finish date the schedule cannot support."}</p>
          </div>
        </div>
        <div className="p-score__facts">
          <div><span className="k">Quality checks passed</span><b>{card.checks.passed} of {card.checks.total}</b></div>
          <div><span className="k">Activities</span><b>{card.activities.toLocaleString("en-US")}</b></div>
          <div><span className="k">Links</span><b>{card.links.toLocaleString("en-US")}</b></div>
          <div><span className="k">Finish by its own logic</span><b>{day(card.plannedFinish)}</b></div>
        </div>
        <div className="p-score__list">
          <span className="k">{card.top.length ? "Biggest problems" : "Problems found"}</span>
          {card.top.length === 0 && <p>None that would hold this schedule back.</p>}
          {card.top.map((t, i) => <div key={t.title}><i>0{i + 1}</i><span>{t.title}</span>{t.blocking && <em>Fix first</em>}</div>)}
          {card.more > 0 && <p className="p-score__more">{card.more} more {card.more === 1 ? "finding" : "findings"} in the full review, with the activities involved and a corrected copy.</p>}
        </div>
        <div className="p-score__f">
          <Link to="/schedule" className="pill pill--blue">See the full review</Link>
          <button type="button" className="pill pill--white" onClick={again}>Score another schedule</button>
        </div>
      </div>
    );
  }

  return (
    <form className="p-score" id="scorecard" onSubmit={submit} noValidate>
      <div className="p-score__h"><span className="k">Schedule scorecard</span><span className="k">Free · about a minute</span></div>
      <div className="p-score__form">
        <div className="p-field">
          <label htmlFor="sc-email">Work email <span>*</span></label>
          <input id="sc-email" type="email" autoComplete="email" placeholder="jane@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="p-field">
          <label htmlFor="sc-file">Schedule file <span>*</span></label>
          <label className={`p-drop${file ? " has-file" : ""}`} htmlFor="sc-file"
            onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}>
            <input ref={input} id="sc-file" type="file" accept=".xer,.xml,.xlsx,.csv" onChange={(e) => pick(e.target.files?.[0])} />
            <b>{file ? file.name : "Choose a file or drop it here"}</b>
            <span>{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "Primavera P6 (.xer, .xml), Microsoft Project (.xml) or Excel (.xlsx, .csv), up to 10 MB"}</span>
          </label>
        </div>
        {error && <p className="p-score__err" role="alert">{error}</p>}
        <button type="submit" className="pill pill--blue pill--lg" disabled={busy}>{busy ? "Scoring the schedule" : "Score my schedule"}</button>
        <p className="p-score__note">The file is read to work out the score and is not kept. Your email is how we follow up.</p>
      </div>
    </form>
  );
}
