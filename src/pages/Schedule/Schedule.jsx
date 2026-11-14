import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { DraftPage, PageHero } from "../../components/Draft/DraftPage";

/* ---------- letter of intent: the PDF and the email that carries it (wording unchanged) */
const LOI_SECTIONS = [
  { num: "1.", title: "Nonbinding", body: "Except for the provisions of Sections 3-8, this LOI is not binding on the Parties; it is only an expression of basic terms and conditions that the Parties presently intend to incorporate in a formal written agreement. No binding agreement shall exist unless and until a Definitive Agreement has been duly executed and delivered by both Parties." },
  { num: "2.", title: "Supply of Services", body: "It is the present intention of the Parties that, upon execution of the Definitive Agreement, Customer would purchase, subscribe for, or otherwise contract for 1iQ platform services at the price, terms, and other material qualifiers mutually agreed upon." },
  { num: "3.", title: "Confidentiality", body: "Each Party agrees to keep confidential all non-public information disclosed by the other Party in connection with the Transaction, including but not limited to the existence and terms of this LOI. This obligation shall survive the termination or expiration of this LOI." },
  { num: "4.", title: "Exclusivity", body: "During the period commencing on the date of this LOI and ending sixty (60) business days thereafter, Customer agrees not to solicit, initiate, or participate in discussions with any third party regarding any substantially similar transaction." },
  { num: "5.", title: "Expenses", body: "Each Party shall bear its own costs, fees, and expenses incurred in connection with the negotiation, preparation, and execution of this LOI and the Definitive Agreement, unless otherwise agreed in writing." },
  { num: "6.", title: "No Obligation to Complete Transaction", body: "Nothing in this LOI shall obligate either Party to complete the Transaction or to enter into the Definitive Agreement. Either Party may withdraw from negotiations at any time without liability, subject to the binding provisions hereof." },
  { num: "7.", title: "Governing Law", body: "This LOI shall be governed by and construed in accordance with the laws of the State of California. Any dispute shall be resolved exclusively in the courts of Los Angeles County, California." },
  { num: "8.", title: "Entire Agreement; Amendments", body: "This LOI constitutes the entire agreement of the Parties with respect to the subject matter hereof and supersedes all prior agreements. This LOI may not be amended except by a written instrument signed by both Parties." },
];

function buildLOIPdf(data, acceptedAt) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const ML = 72, MR = 72, CW = PW - ML - MR;
  let y = 72;

  const dark  = [26, 29, 35];
  const mid   = [90, 95, 107];
  const muted = [144, 152, 164];
  const faint = [236, 237, 240];
  const blue  = [30, 100, 200];

  doc.setFillColor(...blue);
  doc.rect(0, 0, PW, 6, "F");

  doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(...dark);
  doc.text("1iQ", ML, y);

  y += 28; doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(...muted);
  doc.text("LETTER OF INTENT", ML, y);

  y += 18; doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.setTextColor(...dark);
  doc.text("1iQ Platform Access Agreement", ML, y);

  y += 18; doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...muted);
  const effDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const applicant = `${data.firstName} ${data.lastName}${data.company ? ", " + data.company : ""}`;
  doc.text(`Effective Date: ${effDate}   |   Applicant: ${applicant}`, ML, y);

  y += 16; doc.setDrawColor(...faint); doc.line(ML, y, PW - MR, y);

  y += 20; doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...muted);
  const addrLines = [
    "30 January 2026", "Via Electronic Mail", "",
    "1iQ, LLC", "Los Angeles, California", "",
    `Attn: ${data.firstName} ${data.lastName}`,
    ...(data.company ? [data.company] : []),
    "", "Re: Letter of Intent for Services to be Provided",
  ];
  addrLines.forEach((line) => { if (line === "") { y += 5; return; } doc.text(line, ML, y); y += 13; });

  y += 8; doc.setDrawColor(...faint); doc.line(ML, y, PW - MR, y);

  y += 18; doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...dark);
  doc.text(`Dear ${data.firstName || "Sir/Madam"}:`, ML, y);

  y += 14;
  const intro = `This letter of intent ("LOI") sets out the principal terms of a potential contract for services being considered by ${data.firstName} ${data.lastName}${data.company ? " / " + data.company : ""} ("Customer") for use of the 1iQ platform and services from 1iQ, LLC, a Wyoming limited liability company ("1iQ").`;
  const introLines = doc.splitTextToSize(intro, CW);
  doc.setTextColor(...mid); doc.text(introLines, ML, y);
  y += introLines.length * 13 + 16;

  LOI_SECTIONS.forEach((s) => {
    if (y > PH - 150) { doc.addPage(); y = 72; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(...muted);
    doc.text(s.num, ML, y);
    doc.setTextColor(...dark); doc.text(s.title.toUpperCase(), ML + 20, y);
    y += 13;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...mid);
    const bodyLines = doc.splitTextToSize(s.body, CW);
    doc.text(bodyLines, ML, y);
    y += bodyLines.length * 13 + 16;
  });

  if (y > PH - 170) { doc.addPage(); y = 72; }
  y += 8; doc.setDrawColor(...faint); doc.line(ML, y, PW - MR, y);
  y += 16; doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.setTextColor(...muted);
  const authLine = doc.splitTextToSize("By accepting below, Customer represents that they have the full authority to bind themselves and their organization to the terms of this Letter of Intent.", CW);
  doc.text(authLine, ML, y);
  y += authLine.length * 13 + 20;

  doc.setFillColor(248, 249, 250); doc.setDrawColor(...faint);
  doc.roundedRect(ML, y, CW, 95, 6, 6, "FD");
  y += 18; doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...blue);
  doc.text("ELECTRONICALLY ACCEPTED", ML + 16, y);
  y += 16; doc.setTextColor(...dark);
  [["Full Name:", `${data.firstName} ${data.lastName}`], ["Company:", data.company || "-"], ["Work Email:", data.email], ["Accepted At:", acceptedAt]].forEach(([label, value]) => {
    doc.setFont("helvetica", "bold"); doc.text(label, ML + 16, y);
    doc.setFont("helvetica", "normal"); doc.text(value, ML + 100, y);
    y += 14;
  });

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...muted);
    doc.text("1iQ, LLC  |  Los Angeles, CA  |  info@1iq.ai  |  www.1iq.ai", ML, PH - 34);
    doc.text(`Page ${p} of ${totalPages}`, PW - MR, PH - 34, { align: "right" });
    doc.setDrawColor(...faint); doc.line(ML, PH - 46, PW - MR, PH - 46);
  }
  return doc;
}

function generateAndDeliverPDF(data, acceptedAt) {
  const doc = buildLOIPdf(data, acceptedAt);
  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const fileName = `1iQ-LOI_${data.company || "Client"}_${dateStr}.pdf`.replace(/\s+/g, "_");
  doc.save(fileName);
  return doc.output("blob");
}

// ccEmails: semicolon-separated string of addresses to CC (web3forms Pro `ccemail` field)
async function sendLOIEmail({ formData: fd, pdfBlob, acceptedAt, ccEmails, subject }) {
  const form = new FormData();
  form.append("access_key", "aff2eb3e-c155-4a3d-987e-bf059301f9b3");
  form.append("subject", subject);
  form.append("from_name", "1iQ Platform");
  form.append("replyto", fd.email);
  form.append("First Name", fd.firstName);
  form.append("Last Name", fd.lastName);
  form.append("Work Email", fd.email);
  form.append("Phone", fd.phone || "-");
  form.append("Company Name", fd.company);
  form.append("Total Active Project Budget", fd.pmCount || "-");
  form.append("LOI Accepted", "YES");
  form.append("LOI Version", "v1 - 30 January 2026");
  form.append("Accepted At", acceptedAt);
  // `ccemail` is the web3forms Pro field for CC recipients (semicolon-separated)
  if (ccEmails) form.append("ccemail", ccEmails);
  form.append("attachment", pdfBlob, "1iQ-LOI-Agreement.pdf");
  const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: form });
  return res.json();
}

/* ---------- shown after the letter is accepted, then the demo opens */
function PostLOILoader({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2900);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="p-wait" role="status">
      <img src="/assets/img/home/logo-dark.png" alt="1iQ" />
      <span className="k">Loading intelligence</span>
      <div className="p-wait__bar"><i /></div>
    </div>
  );
}

/* ---------- the letter of intent window */
const LOI_DATE = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
const LOI_TERMS = [
  { num: "1.", title: "Nonbinding", body: "Except for the provisions of Sections 3 to 8, this LOI is not binding on the Parties; it is only an expression of basic terms and conditions that the Parties presently intend to incorporate in a formal written agreement. No binding agreement shall exist unless and until a Definitive Agreement has been duly executed and delivered by both Parties." },
  { num: "2.", title: "Supply of Services", body: "It is the present intention of the Parties that, upon execution of the Definitive Agreement, Customer would purchase, subscribe for, or otherwise contract for 1iQ platform services at the price, terms, and other material qualifiers mutually agreed upon." },
  { num: "3.", title: "Confidentiality", body: "Each Party agrees to keep confidential all non-public information disclosed by the other Party in connection with the Transaction, including but not limited to the existence and terms of this LOI. This obligation shall survive the termination or expiration of this LOI." },
  { num: "4.", title: "Exclusivity", body: "During the period commencing on the date of this LOI and ending sixty (60) business days thereafter, Customer agrees not to solicit, initiate, or participate in discussions with any third party regarding any substantially similar transaction." },
  { num: "5.", title: "Expenses", body: "Each Party shall bear its own costs, fees, and expenses incurred in connection with the negotiation, preparation, and execution of this LOI and the Definitive Agreement, unless otherwise agreed in writing." },
  { num: "6.", title: "No Obligation to Complete Transaction", body: "Nothing in this LOI shall obligate either Party to complete the Transaction or to enter into the Definitive Agreement. Either Party may withdraw from negotiations at any time without liability, subject to the binding provisions hereof." },
  { num: "7.", title: "Governing Law", body: "This LOI shall be governed by and construed in accordance with the laws of the State of California. Any dispute shall be resolved exclusively in the courts of Los Angeles County, California." },
  { num: "8.", title: "Entire Agreement; Amendments", body: "This LOI constitutes the entire agreement of the Parties with respect to the subject matter hereof and supersedes all prior agreements. This LOI may not be amended except by a written instrument signed by both Parties." },
];

function LOIModal({ name, company, visible, onAccept, onDecline }) {
  const [agreed, setAgreed] = useState(false);
  if (!visible) return null;
  return (
    <div className="p-modal" role="dialog" aria-modal="true" aria-labelledby="loi-title">
      <div className="p-modal__box">
        <div className="p-modal__h">
          <span className="k">Letter of intent</span>
          <h2 id="loi-title">1iQ Platform Access Agreement</h2>
          <p>Effective Date: {LOI_DATE} · Applicant: <strong>{name}{company ? `, ${company}` : ""}</strong></p>
        </div>
        <div className="p-modal__body">
          <div className="p-modal__addr">
            <div>30 January 2026</div>
            <div>Via Electronic Mail</div>
            <div style={{ marginTop: 12 }}><strong>1iQ, LLC</strong><br />Los Angeles, California</div>
            <div style={{ marginTop: 8 }}>Attn: <strong>{name}</strong>{company && <><br />{company}</>}</div>
            <div style={{ marginTop: 8 }}><strong>Re: Letter of Intent for Services to be Provided</strong></div>
          </div>
          <p style={{ marginBottom: 16, color: "var(--ink)" }}>Dear {name || "Ladies and Gentlemen"}:</p>
          <p style={{ marginBottom: 26 }}>
            This letter of intent (<strong>"LOI"</strong>) sets out the principal terms of a potential contract for services being considered by{" "}
            <strong>{name}{company ? ` / ${company}` : ""}</strong> (<strong>"Customer"</strong>) for use of the 1iQ platform and services from 1iQ, LLC a Wyoming limited liability company (<strong>"1iQ"</strong>).
          </p>
          {LOI_TERMS.map((s) => (
            <section key={s.num}>
              <h3><span>{s.num}</span>{s.title}</h3>
              <p>{s.body}</p>
            </section>
          ))}
          <p style={{ borderTop: "1px solid var(--line2)", paddingTop: 18, fontSize: 12.5, color: "var(--muted)" }}>
            By accepting below, Customer represents that they have the full authority to bind themselves and their organization to the terms of this Letter of Intent.
          </p>
        </div>
        <div className="p-modal__f">
          <label>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>I have read, understood, and agree to the terms of this Letter of Intent on behalf of myself and/or my organization.</span>
          </label>
          <div>
            <button type="button" className="pill pill--white" onClick={onDecline}>Decline</button>
            <button type="button" className="pill pill--blue" disabled={!agreed} onClick={agreed ? onAccept : undefined}>Accept and continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- the booking page */
const PORTFOLIO_OPTIONS = ["Under $10M", "$10M to $50M", "$50M to $100M", "$100M and over"];
const PROJECT_TYPES = ["Residential", "Commercial", "Mixed use", "Industrial", "Multifamily", "Hospitality", "Other"];
const PORTFOLIO_SIZES = ["1 to 2 projects", "3 to 5 projects", "6 to 10 projects", "More than 10 projects"];
const BULLETS = [
  ["See live project data", "from the jobsite flowing to your developer dashboard."],
  ["Watch 1iQ flag schedule delays and budget overruns", "2 to 4 weeks before they show up."],
  ["Review return calculations", "and capital protection scenarios specific to your portfolio."],
];

const Field = ({ label, id, required, half, children }) => (
  <div className={`p-field${half ? " p-field--half" : ""}`}>
    <label htmlFor={id}>{label}{required && <span> *</span>}</label>
    {children}
  </div>
);

const Schedule = () => {
  const navigate = useNavigate();
  const [showLOI, setShowLOI] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [sending, setSending] = useState(false);
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "",
    portfolioValue: "", projectType: "", portfolioSize: "", painPoint: ""
  });
  const set = (field) => (e) => setData((d) => ({ ...d, [field]: e.target.value }));

  const canSubmit = data.firstName && data.lastName && data.email && data.company && data.portfolioValue;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("access_key", "aff2eb3e-c155-4a3d-987e-bf059301f9b3");
      const payload = {
        "First Name": data.firstName,
        "Last Name": data.lastName,
        "Work Email": data.email,
        "Phone": data.phone,
        "Company Name": data.company,
        "Current Development Portfolio Value": data.portfolioValue,
        "Primary Project Type": data.projectType,
        "Active Portfolio Size": data.portfolioSize,
        "Primary Visibility Challenge": data.painPoint,
      };
      Object.entries(payload).forEach(([key, value]) => {
        if (value && value.toString().trim() !== "") formData.append(key, value);
      });
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const result = await response.json();
      if (result.success) {
        // CC admin@1iq.ai on the form submission notification (web3forms Pro ccemail)
        const adminCopy = new FormData();
        adminCopy.append("access_key", "aff2eb3e-c155-4a3d-987e-bf059301f9b3");
        adminCopy.append("ccemail", "admin@1iq.ai");
        adminCopy.append("subject", `New Intelligence Briefing Request: ${data.firstName} ${data.lastName} / ${data.company}`);
        adminCopy.append("from_name", "1iQ Platform");
        adminCopy.append("replyto", data.email);
        Object.entries(payload).forEach(([key, value]) => {
          if (value && value.toString().trim() !== "") adminCopy.append(key, value);
        });
        fetch("https://api.web3forms.com/submit", { method: "POST", body: adminCopy }).catch(() => {});
        setShowLOI(true);
      } else {
        alert("There was an error submitting the form. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("There was an error sending the form. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Called when the user clicks "Accept & Continue" on the LOI
  const handleLOIAccept = async () => {
    setShowLOI(false);    // close the modal immediately
    setShowLoader(true);  // show the 1iQ loading intelligence screen

    const acceptedAt = new Date().toLocaleString("en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      timeZoneName: "short",
    });

    try {
      // 1. Generate PDF — auto-downloads to the user's browser
      const pdfBlob = generateAndDeliverPDF(data, acceptedAt);

      // Single submission: primary goes to account owner (ck@1iq.ai),
      // ccemail delivers copies to submitter + admin@1iq.ai in one call.
      const ccList = `${data.email};admin@1iq.ai`;
      await sendLOIEmail({
        formData: data, pdfBlob, acceptedAt,
        ccEmails: ccList,
        subject: `Development Intelligence LOI Accepted: ${data.firstName} ${data.lastName} / ${data.company}`,
      });
    } catch (err) {
      // Non-blocking — loading screen continues regardless
      console.error("LOI PDF/email error:", err);
    }
  };

  // Called when the loading screen animation finishes
  const handleLoaderDone = () => {
    setShowLoader(false);
    // Navigate to demo app and scroll to the very top
    navigate("/demo");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const text = (id, type, placeholder, required) => (
    <input id={id} type={type} value={data[id]} onChange={set(id)} placeholder={placeholder} required={required} />
  );
  const pick = (id, placeholder, options, required) => (
    <select id={id} value={data[id]} onChange={set(id)} required={required} style={{ color: data[id] ? undefined : "var(--dis)" }}>
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <DraftPage>
      <LOIModal name={data.firstName || "there"} company={data.company} visible={showLOI} onAccept={handleLOIAccept} onDecline={() => setShowLOI(false)} />
      {showLoader && <PostLOILoader onDone={handleLoaderDone} />}

      <PageHero
        narrow
        sheet="Sheet B1 · Book a briefing"
        note="30 minutes · private"
        kicker="Development intelligence briefing"
        title="See it on your own kind of project."
        lead="Book a private briefing to see how 1iQ turns scattered project data into intelligence that protects capital across your development business."
      />

      <section className="d-sec">
        <div className="wrap p-two">
          <div>
            <div className="ruler" />
            <h2 className="h2">Private development intelligence briefing.</h2>
            <p className="d-p">A 30 minute executive briefing with real project data. See exactly how 1iQ closes the gaps in your current reporting.</p>
            <div className="d-pts">
              {BULLETS.map(([b, r], i) => <div key={b}><i>0{i + 1}</i><div><b>{b}</b> {r}</div></div>)}
            </div>
            <div className="p-tags"><span>Executive briefing</span><span>Return analysis</span><span>Risk modeling demo</span></div>
          </div>

          <div className="p-formcard">
            <div className="p-formcard__h"><span className="k">Executive briefing</span><h3>Book your development intelligence review</h3></div>
            <form onSubmit={handleSubmit} className="p-form" noValidate>
              <Field label="First name" id="firstName" required half>{text("firstName", "text", "Jane", true)}</Field>
              <Field label="Last name" id="lastName" required half>{text("lastName", "text", "Smith", true)}</Field>
              <Field label="Work email" id="email" required>{text("email", "email", "jane@company.com", true)}</Field>
              <Field label="Phone" id="phone">{text("phone", "tel", "+1 (555) 000 0000", false)}</Field>
              <Field label="Company name" id="company" required>{text("company", "text", "Acme Development", true)}</Field>
              <Field label="Current development portfolio value" id="portfolioValue" required>{pick("portfolioValue", "Select portfolio value", PORTFOLIO_OPTIONS, true)}</Field>
              <Field label="Primary project type" id="projectType" half>{pick("projectType", "Select project type", PROJECT_TYPES, false)}</Field>
              <Field label="Active portfolio size" id="portfolioSize" half>{pick("portfolioSize", "Select portfolio size", PORTFOLIO_SIZES, false)}</Field>
              <Field label="Primary visibility challenge" id="painPoint">{text("painPoint", "text", "For example late reports, budget overruns, investor reporting", false)}</Field>
              <button type="submit" disabled={!canSubmit || sending} className="pill pill--blue pill--lg">{sending ? "Booking" : "Book my briefing"}</button>
            </form>
          </div>
        </div>
      </section>
    </DraftPage>
  );
};

export default Schedule;
