import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import "./Schedule.scss";

/* ═══════════════════════════════════════════════════════════════
   1iQ ONBOARDING FORM — White theme matching global website
   ═══════════════════════════════════════════════════════════════ */

const STEPS = [
  { id: 1, label: "You", headline: "Let's Start With You", subline: "Every great build begins with the people behind it. Tell us who you are." },
  { id: 2, label: "Company", headline: "Tell Us About Your Company", subline: "Understanding your organization helps us tailor 1iQ to your world." },
  { id: 3, label: "Operations", headline: "How Do You Build Today?", subline: "We want to understand your current workflow so 1iQ fits right in." },
  { id: 4, label: "Challenges", headline: "What's Holding You Back?", subline: "Identifying pain points helps us show you where 1iQ delivers the most value." },
  { id: 5, label: "Goals", headline: "Where Are You Headed?", subline: "Your vision matters. Let us help you get there faster, smarter, and with full transparency." },
];

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];
const COMPANY_TYPES = ["General Contractor", "Specialty Contractor", "Owner / Developer", "Construction Manager", "Architecture / Engineering", "Other"];
const PROJECT_TYPES = ["Commercial", "Residential", "Industrial", "Infrastructure", "Mixed-Use", "Other"];
const ANNUAL_REVENUE = ["Under $1M", "$1M – $10M", "$10M – $50M", "$50M – $200M", "$200M+"];
const CURRENT_TOOLS = ["Procore", "Autodesk / BIM 360", "PlanGrid", "Primavera P6", "Microsoft Project", "Spreadsheets / Manual", "Other"];
const PAIN_POINTS = ["Lack of real-time visibility", "Disconnected field & office", "Schedule delays & overruns", "Data silos across teams", "Safety & compliance gaps", "Cost tracking & budget control", "Subcontractor coordination"];
const GOALS = ["Real-time jobsite intelligence", "Predictive project insights", "Field-to-office transparency", "Faster decision making", "Reduced project risk", "Better subcontractor management", "Streamlined reporting"];
const TIMELINE = ["Immediately", "Within 1 month", "1–3 months", "3–6 months", "Just exploring"];

function ArrowIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function ProgressBar({ step, total }) {
  const pct = (step / total) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "#1a1d23", letterSpacing: "-0.2px" }}>
        {step} of {total}
      </span>
      <div style={{ width: 80, height: 3, background: "#e8eaed", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#1a1d23", borderRadius: 2, transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

function ChipGroup({ options, selected, onToggle, multi = true }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((opt) => {
        const active = multi ? selected.includes(opt) : selected === opt;
        return (
          <button key={opt} onClick={(e) => { e.preventDefault(); onToggle(opt); }} style={{
            padding: "10px 20px", borderRadius: "8px",
            border: active ? "1.5px solid #1a1d23" : "1px solid #d8dbe0",
            background: "#ffffff",
            color: active ? "#1a1d23" : "#5a5f6b",
            fontFamily: "'Inter', sans-serif", fontSize: "13.5px", fontWeight: active ? 600 : 450,
            cursor: "pointer", transition: "all 0.18s ease", whiteSpace: "nowrap",
            letterSpacing: "-0.1px",
          }}>
            {active && multi ? "✓  " : ""}{opt}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500, color: "#5a5f6b", letterSpacing: "-0.1px" }}>
        {label}{required && <span style={{ color: "#1a1d23", marginLeft: 3 }}>*</span>}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: "8px",
          border: `1px solid ${focused ? "#1a1d23" : "#d8dbe0"}`,
          background: "#ffffff", color: "#1a1d23", fontFamily: "'Inter', sans-serif",
          fontSize: "15px", fontWeight: 400, outline: "none", transition: "border-color 0.2s ease",
          letterSpacing: "-0.1px",
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500, color: "#5a5f6b", letterSpacing: "-0.1px" }}>
        {label}
      </label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: "8px",
          border: `1px solid ${focused ? "#1a1d23" : "#d8dbe0"}`,
          background: "#ffffff", color: "#1a1d23", fontFamily: "'Inter', sans-serif",
          fontSize: "15px", fontWeight: 400, outline: "none", resize: "vertical",
          transition: "border-color 0.2s ease", letterSpacing: "-0.1px",
        }}
      />
    </div>
  );
}

function SectionLabel({ children, required, hint }) {
  return (
    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500, color: "#5a5f6b", letterSpacing: "-0.1px", marginBottom: 10, display: "block" }}>
      {children}{required && <span style={{ color: "#1a1d23", marginLeft: 2 }}>*</span>}
      {hint && <span style={{ fontWeight: 400, marginLeft: 6, fontSize: "12px", color: "#9098a4" }}>{hint}</span>}
    </label>
  );
}

/* ═══════════════════════════════════════════════════════
   LOI TERMS MODAL
   ═══════════════════════════════════════════════════════ */
const LOI_DATE = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

function LOIModal({ name, company, jobTitle, hqLocation, visible, onAccept, onDecline }) {
  const [agreed, setAgreed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) setHasScrolled(true);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(10, 12, 18, 0.72)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px", animation: "fadeIn 0.25s ease forwards",
    }}>
      <div style={{
        background: "#ffffff", borderRadius: "16px", width: "100%", maxWidth: 680,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 40px 120px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #e0e2e8", animation: "popIn 0.35s cubic-bezier(.34,1.4,.64,1) forwards",
      }}>

        {/* ── Header ── */}
        <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid #ecedf0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 6, height: 28, background: "#1a1d23", borderRadius: 3 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#9098a4" }}>
              LETTER OF INTENT
            </span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: 800, color: "#1a1d23", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
            1iQ Platform Access Agreement
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#9098a4", margin: 0 }}>
            Effective Date: {LOI_DATE} &nbsp;·&nbsp; Applicant: <strong style={{ color: "#5a5f6b" }}>{name}{jobTitle ? `, ${jobTitle}` : ""}{company ? ` — ${company}` : ""}{hqLocation ? `, ${hqLocation}` : ""}</strong>
          </p>
        </div>

        {/* ── Scrollable Body ── */}
        <div ref={scrollRef} onScroll={handleScroll} style={{
          flex: 1, overflowY: "auto", padding: "28px 32px",
          fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#3a3f4a",
          lineHeight: 1.75, letterSpacing: "-0.05px",
        }}>

          {/* ── Formal letter metadata ── */}
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #ecedf0", fontSize: "13px", color: "#9098a4", lineHeight: 1.8 }}>
            <div style={{ marginBottom: 4 }}>30 January 2026</div>
            <div style={{ marginBottom: 4 }}>Via Electronic Mail</div>
            <div style={{ marginTop: 12, color: "#5a5f6b" }}>
              <strong style={{ color: "#1a1d23" }}>1iQ, LLC</strong><br />
              Los Angeles, California
            </div>
            <div style={{ marginTop: 8, color: "#5a5f6b" }}>
              Attn: <strong style={{ color: "#1a1d23" }}>{name}</strong>
              {jobTitle && <span style={{ color: "#5a5f6b" }}>, {jobTitle}</span>}
              {company && <><br /><span style={{ color: "#5a5f6b" }}>{company}</span></>}
              {hqLocation && <span style={{ color: "#9098a4" }}> · {hqLocation}</span>}
            </div>
            <div style={{ marginTop: 8, fontWeight: 600, color: "#3a3f4a" }}>Re: Letter of Intent for Services to be Provided</div>
          </div>

          {/* ── Salutation ── */}
          <p style={{ margin: "0 0 16px", color: "#3a3f4a" }}>
            Dear {name || "Ladies and Gentlemen"}:
          </p>

          {/* ── Opening paragraph ── */}
          <p style={{ margin: "0 0 28px", color: "#5a5f6b" }}>
            This letter of intent (<strong style={{ color: "#1a1d23" }}>"LOI"</strong>) sets out the principal terms of a potential contract for services being considered by{" "}
            <strong style={{ color: "#1a1d23" }}>{name}{company ? ` / ${company}` : ""}</strong> (<strong style={{ color: "#1a1d23" }}>"Customer"</strong>) for use of the 1iQ platform and services (as defined in Section 2) from 1iQ, LLC a Wyoming limited liability company (<strong style={{ color: "#1a1d23" }}>"1iQ"</strong>). The possible contract is referred to as the <strong style={{ color: "#1a1d23" }}>"AI SaaS Agreement"</strong> or <strong style={{ color: "#1a1d23" }}>"Definitive Agreement"</strong> and Customer and 1iQ are referred to collectively as the <strong style={{ color: "#1a1d23" }}>"Parties"</strong> and each, individually, as a <strong style={{ color: "#1a1d23" }}>"Party"</strong>.
          </p>

          {[
            {
              num: "1.",
              title: "Nonbinding",
              body: `Except for the provisions of Section 3, Section 4, Section 5, Section 6, Section 7, Section 8, and the requirement of this Section 1 regarding entry into negotiations, this LOI is not binding on the Parties; it is only an expression of basic terms and conditions that the Parties presently intend to incorporate in a formal written agreement that will govern the Transaction (an "AI SaaS Agreement" or "Definitive Agreement"). No binding agreement shall exist with respect to the Transaction unless and until the Definitive Agreement has been duly executed and delivered by both Parties. As soon as practicable following the acceptance and approval of this LOI by the Seller, the Parties shall enter into good faith negotiations with the objective of executing the Definitive Agreement within sixty (60) business days thereafter. 1iQ shall prepare the initial draft of the Definitive Agreement.`,
            },
            {
              num: "2.",
              title: "Supply of Services",
              body: `It is the present intention of the Parties that, upon execution of the Definitive Agreement, Customer would purchase, subscribe for, or otherwise contract for and 1iQ would sell, provide, or otherwise contract for the services set out in the attached Exhibit A ("Term Sheet"), at the price, terms, and other material qualifiers set out therein. The Definitive Agreement shall contain such covenants, conditions, indemnities, representations, and warranties as the Parties shall mutually agree.`,
            },
            {
              num: "3.",
              title: "Confidentiality",
              body: `Each Party agrees to keep confidential all non-public information disclosed by the other Party in connection with the Transaction, including but not limited to the existence and terms of this LOI. Neither Party shall disclose such information to any third party without the prior written consent of the disclosing Party, except as required by law. This obligation of confidentiality shall survive the termination or expiration of this LOI.`,
            },
            {
              num: "4.",
              title: "Exclusivity",
              body: `During the period commencing on the date of this LOI and ending sixty (60) business days thereafter (the "Exclusivity Period"), Customer agrees not to solicit, initiate, encourage, or participate in any discussions or negotiations with any third party regarding any transaction that is substantially similar to the Transaction contemplated herein. 1iQ agrees to negotiate exclusively with Customer during the Exclusivity Period.`,
            },
            {
              num: "5.",
              title: "Expenses",
              body: `Each Party shall bear its own costs, fees, and expenses (including legal, accounting, and advisory fees) incurred in connection with the negotiation, preparation, and execution of this LOI and the Definitive Agreement, unless otherwise agreed in writing by the Parties.`,
            },
            {
              num: "6.",
              title: "No Obligation to Complete Transaction",
              body: `Except as expressly set forth herein, nothing in this LOI shall obligate either Party to complete the Transaction or to enter into the Definitive Agreement. Either Party may withdraw from negotiations at any time without liability to the other Party, subject to the binding provisions of this LOI.`,
            },
            {
              num: "7.",
              title: "Governing Law",
              body: `This LOI shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of laws provisions. Any dispute arising out of or relating to this LOI shall be resolved exclusively in the courts of competent jurisdiction located in Los Angeles County, California, and each Party hereby submits to the personal jurisdiction of such courts.`,
            },
            {
              num: "8.",
              title: "Entire Agreement; Amendments",
              body: `This LOI constitutes the entire agreement of the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, representations, warranties, and understandings, whether oral or written, relating to such subject matter. This LOI may not be amended except by a written instrument signed by both Parties.`,
            },
          ].map((s) => (
            <div key={s.num} style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, color: "#1a1d23", letterSpacing: "1.2px", textTransform: "uppercase", margin: "0 0 8px", display: "flex", gap: 8 }}>
                <span style={{ color: "#9098a4" }}>{s.num}</span> {s.title}
              </h3>
              <p style={{ margin: 0, color: "#5a5f6b" }}>{s.body}</p>
            </div>
          ))}

          <div style={{ borderTop: "1px solid #ecedf0", paddingTop: 20, marginTop: 8, color: "#9098a4", fontSize: "12px" }}>
            By accepting below, Customer represents that they have the full authority to bind themselves and their organization to the terms of this Letter of Intent, and acknowledges receipt of the foregoing.
          </div>

        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "20px 32px 24px", borderTop: "1px solid #ecedf0", flexShrink: 0, background: "#fafafa", borderRadius: "0 0 16px 16px" }}>
          {/* Agree checkbox */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginBottom: 20 }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2, accentColor: "#1a1d23", cursor: "pointer", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13.5px", color: "#3a3f4a", lineHeight: 1.5 }}>
              I have read, understood, and agree to the terms of this Letter of Intent on behalf of myself and/or my organization.
            </span>
          </label>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button onClick={onDecline} style={{
              padding: "12px 24px", borderRadius: "100px",
              border: "1px solid #d8dbe0", background: "#ffffff",
              fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600,
              color: "#5a5f6b", letterSpacing: "1px", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.18s ease",
            }}>
              Decline
            </button>
            <button onClick={agreed ? onAccept : undefined} disabled={!agreed} style={{
              display: "flex", alignItems: "center", gap: 0, borderRadius: "100px",
              border: "none", overflow: "hidden",
              background: agreed ? "#1a1d23" : "#d0d3db",
              cursor: agreed ? "pointer" : "not-allowed",
              transition: "background 0.2s ease",
            }}>
              <span style={{ padding: "12px 20px 12px 24px", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: "#ffffff", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                Accept &amp; Continue
              </span>
              <span style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", background: agreed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)", borderRadius: "50%", margin: "3px 3px 3px 0" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Schedule = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showLOI, setShowLOI] = useState(false);
  const [sending, setSending] = useState(false);
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", phone: "", jobTitle: "",
    companyName: "", companyType: "", companySize: "", annualRevenue: "", hqLocation: "",
    projectTypes: [], currentTools: [], activeProjects: "", teamSize: "",
    painPoints: [], biggestChallenge: "",
    goals: [], timeline: "", additionalNotes: "",
  });

  const set = (field) => (val) => setData((d) => ({ ...d, [field]: val }));
  const toggleMulti = (field) => (val) => setData((d) => ({
    ...d, [field]: d[field].includes(val) ? d[field].filter((v) => v !== val) : [...d[field], val],
  }));

  const handleAccept = () => { navigate("/demo"); };
  const handleDecline = () => { setShowLOI(false); };

  const canProceed = () => {
    switch (step) {
      case 1: return data.firstName && data.lastName && data.email;
      case 2: return data.companyName && data.companyType && data.companySize;
      case 3: return data.projectTypes.length > 0;
      case 4: return data.painPoints.length > 0;
      case 5: return data.goals.length > 0 && data.timeline;
      default: return true;
    }
  };

  const go = (dir) => {
    const next = step + dir;
    if (next >= 1 && next <= 5) {
      setStep(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("access_key", "aff2eb3e-c155-4a3d-987e-bf059301f9b3");
      const payload = {
        "First Name": data.firstName, "Last Name": data.lastName, "Email": data.email,
        "Phone": data.phone, "Job Title": data.jobTitle, "Company Name": data.companyName,
        "Company Type": data.companyType, "Company Size": data.companySize,
        "Annual Revenue": data.annualRevenue, "HQ Location": data.hqLocation,
        "Project Types": data.projectTypes.join(", "), "Current Tools": data.currentTools.join(", "),
        "Active Projects": data.activeProjects, "Team Size": data.teamSize,
        "Pain Points": data.painPoints.join(", "), "Biggest Challenge": data.biggestChallenge,
        "Goals": data.goals.join(", "), "Timeline": data.timeline, "Additional Notes": data.additionalNotes,
      };
      Object.entries(payload).forEach(([key, value]) => {
        if (value && value.toString().trim() !== "") formData.append(key, value);
      });
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const responseData = await response.json();
      if (responseData.success) {
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

  const cur = STEPS[step - 1];

  return (
    <div className="app relative w-full overflow-x-hidden">
      <Navigation heroRef={heroRef} />
      <CommonHeader
        ref={heroRef}
        title={"Get Started"}
        text={"Ready to experience 1iQ? Tell us about your team and we'll be in touch."}
      ></CommonHeader>

      <div className="w-full min-h-screen bg-white pb-32" style={{ fontFamily: "'Inter', sans-serif", color: "#1a1d23" }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />

        <LOIModal
          name={data.firstName || "there"}
          company={data.companyName}
          jobTitle={data.jobTitle}
          hqLocation={data.hqLocation}
          visible={showLOI}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />

        {/* ─── PROGRESS NAV BAR ─── */}
        <nav className="sticky top-0 z-50 flex items-center justify-end px-4 md:px-8 h-16 border-b border-[#ecedf0]" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ProgressBar step={step} total={5} />
            <div style={{ display: "flex", alignItems: "center", borderRadius: "100px", border: "1px solid #d8dbe0", overflow: "hidden", marginLeft: 8 }}>
              <span style={{ padding: "10px 16px 10px 20px", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: "#1a1d23", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Onboarding
              </span>
            </div>
          </div>
        </nav>

        {/* ─── STEP INDICATORS ─── */}
        <div className="w-full flex justify-center pt-7 px-4">
          <div className="w-full max-w-[640px] flex items-center justify-center">
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                <div onClick={() => { if (i + 1 <= step) setStep(i + 1); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: i + 1 <= step ? "pointer" : "default", opacity: i + 1 <= step ? 1 : 0.3, transition: "opacity 0.3s ease" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: i + 1 === step ? "#1a1d23" : i + 1 < step ? "#ffffff" : "#f4f5f6", border: i + 1 < step ? "1.5px solid #1a1d23" : i + 1 === step ? "none" : "1px solid #d8dbe0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: i + 1 === step ? "#ffffff" : "#1a1d23", transition: "all 0.3s ease" }}>
                    {i + 1 < step ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:block" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap", color: i + 1 === step ? "#1a1d23" : "#9098a4" }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-[12px] sm:w-[36px] h-[1.5px] mx-1 sm:mx-1.5 mb-5 transition-colors duration-300" style={{ background: i + 1 < step ? "#1a1d23" : "#e0e2e5" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── FORM CARD ─── */}
        <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); if (canProceed()) go(1); }}>
          <div ref={containerRef} className="w-full flex justify-center">
            <div className="w-full max-w-[640px] px-4 md:px-5 py-6 pb-10">
              <div className="bg-white rounded-xl border border-[#d8dbe0] p-6 md:p-9">
                <div key={step} style={{ marginBottom: 32, animation: "slideIn 0.4s ease forwards" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px", fontWeight: 800, color: "#1a1d23", margin: "0 0 8px", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                    {cur.headline}
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14.5px", color: "#5a5f6b", lineHeight: 1.65, margin: 0, letterSpacing: "-0.1px" }}>
                    {cur.subline}
                  </p>
                </div>

                <div key={`f-${step}`} style={{ display: "flex", flexDirection: "column", gap: 22, animation: "slideIn 0.45s ease 0.04s forwards", opacity: 0 }}>
                  {step === 1 && (<>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <Field label="First Name" value={data.firstName} onChange={set("firstName")} placeholder="Jane" required />
                      <Field label="Last Name" value={data.lastName} onChange={set("lastName")} placeholder="Smith" required />
                    </div>
                    <Field label="Work Email" value={data.email} onChange={set("email")} placeholder="jane@company.com" type="email" required />
                    <Field label="Phone" value={data.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" type="tel" />
                    <Field label="Job Title" value={data.jobTitle} onChange={set("jobTitle")} placeholder="VP of Operations" />
                  </>)}
                  {step === 2 && (<>
                    <Field label="Company Name" value={data.companyName} onChange={set("companyName")} placeholder="Acme Construction" required />
                    <div><SectionLabel required>Company Type</SectionLabel><ChipGroup options={COMPANY_TYPES} selected={data.companyType} onToggle={set("companyType")} multi={false} /></div>
                    <div><SectionLabel required>Company Size</SectionLabel><ChipGroup options={COMPANY_SIZES} selected={data.companySize} onToggle={set("companySize")} multi={false} /></div>
                    <div><SectionLabel>Annual Revenue</SectionLabel><ChipGroup options={ANNUAL_REVENUE} selected={data.annualRevenue} onToggle={set("annualRevenue")} multi={false} /></div>
                    <Field label="HQ Location" value={data.hqLocation} onChange={set("hqLocation")} placeholder="Austin, TX" />
                  </>)}
                  {step === 3 && (<>
                    <div><SectionLabel required>Project Types</SectionLabel><ChipGroup options={PROJECT_TYPES} selected={data.projectTypes} onToggle={toggleMulti("projectTypes")} /></div>
                    <div><SectionLabel>Current Tools &amp; Software</SectionLabel><ChipGroup options={CURRENT_TOOLS} selected={data.currentTools} onToggle={toggleMulti("currentTools")} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <Field label="Active Projects" value={data.activeProjects} onChange={set("activeProjects")} placeholder="e.g. 12" />
                      <Field label="Field Team Size" value={data.teamSize} onChange={set("teamSize")} placeholder="e.g. 45" />
                    </div>
                  </>)}
                  {step === 4 && (<>
                    <div><SectionLabel required hint="(select all that apply)">Top Pain Points</SectionLabel><ChipGroup options={PAIN_POINTS} selected={data.painPoints} onToggle={toggleMulti("painPoints")} /></div>
                    <TextArea label="Describe your biggest challenge" value={data.biggestChallenge} onChange={set("biggestChallenge")} placeholder="In your own words, what keeps you up at night about your construction projects?" />
                  </>)}
                  {step === 5 && (<>
                    <div><SectionLabel required hint="(select all that apply)">What do you want from 1iQ?</SectionLabel><ChipGroup options={GOALS} selected={data.goals} onToggle={toggleMulti("goals")} /></div>
                    <div><SectionLabel required>Implementation Timeline</SectionLabel><ChipGroup options={TIMELINE} selected={data.timeline} onToggle={set("timeline")} multi={false} /></div>
                    <TextArea label="Anything else we should know?" value={data.additionalNotes} onChange={set("additionalNotes")} placeholder="Special requirements, upcoming projects, or questions for our team..." />
                  </>)}
                </div>
              </div>
            </div>
          </div>

          {/* ─── BOTTOM NAV BAR ─── */}
          <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-between items-center px-4 py-3 md:px-7 md:py-3.5 border-t border-[#ecedf0]" style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(16px)" }}>
            <button type="button" onClick={() => go(-1)} disabled={step === 1} style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: "100px", border: `1px solid ${step === 1 ? "#e8eaed" : "#d8dbe0"}`, background: "#ffffff", cursor: step === 1 ? "not-allowed" : "pointer", overflow: "hidden", opacity: step === 1 ? 0.4 : 1, transition: "opacity 0.2s ease" }}>
              <span style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", borderRight: `1px solid ${step === 1 ? "#e8eaed" : "#d8dbe0"}` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1d23" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
              </span>
              <span style={{ padding: "10px 20px 10px 14px", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: "#1a1d23", letterSpacing: "1.2px", textTransform: "uppercase" }}>Back</span>
            </button>

            <button type="submit" disabled={!canProceed() || sending} style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: "100px", border: "none", background: canProceed() && !sending ? "#2d3039" : "#c8cad0", cursor: canProceed() && !sending ? "pointer" : "not-allowed", overflow: "hidden", transition: "background 0.2s ease" }}>
              <span style={{ padding: "12px 20px 12px 24px", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: "#ffffff", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                {sending ? "Sending..." : step === 5 ? "Submit" : "Continue"}
              </span>
              {!sending && (
                <span style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.12)", borderRadius: "50%", margin: "3px 3px 3px 0" }}>
                  {step === 5
                    ? <ArrowIcon size={13} color="#ffffff" />
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  }
                </span>
              )}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes slideIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes popIn { from { opacity: 0; transform: scale(0.92) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          @keyframes scaleCheck { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          * { box-sizing: border-box; }
          input::placeholder, textarea::placeholder { color: #b0b5be; }
          button:active { transform: scale(0.98); }
          ::selection { background: #1a1d23; color: #ffffff; }
        `}</style>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default Schedule;
