import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import jsPDF from "jspdf";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import "./Schedule.scss";


/* ═══════════════════════════════════════════════════════════════
   LOI PDF GENERATOR
   ═══════════════════════════════════════════════════════════════ */
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
  const applicant = `${data.firstName} ${data.lastName}${data.company ? " — " + data.company : ""}`;
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

async function sendLOIEmail({ formData: fd, pdfBlob, acceptedAt, toEmail, subject }) {
  const form = new FormData();
  form.append("access_key", "aff2eb3e-c155-4a3d-987e-bf059301f9b3");
  form.append("subject", subject);
  form.append("from_name", "1iQ Platform");
  form.append("First Name", fd.firstName);
  form.append("Last Name", fd.lastName);
  form.append("Work Email", fd.email);
  form.append("Phone", fd.phone || "-");
  form.append("Company Name", fd.company);
  form.append("Number of Project Managers", fd.pmCount || "-");
  form.append("LOI Accepted", "YES");
  form.append("LOI Version", "v1 - 30 January 2026");
  form.append("Accepted At", acceptedAt);
  if (toEmail) form.append("to_email", toEmail);
  form.append("attachment", pdfBlob, "1iQ-LOI-Agreement.pdf");
  const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: form });
  return res.json();
}

/* ═══════════════════════════════════════════════════════════════
   POST-LOI  "LOADING INTELLIGENCE"  SCREEN
   Shown after the user accepts the LOI — mirrors the global
   LoadingScreen animation, then navigates to the home page.
   ═══════════════════════════════════════════════════════════════ */
function PostLOILoader({ onDone }) {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current || !logoRef.current || !textRef.current) return;

    // Set hidden initial states
    gsap.set(logoRef.current, { opacity: 0, scale: 0.5, rotation: -10, filter: "blur(10px)" });
    gsap.set(textRef.current, { opacity: 0, y: 20, filter: "blur(5px)" });
    gsap.set(dotsRef.current, { opacity: 0, scale: 0, rotation: 180 });

    const tl = gsap.timeline();
    tl.to(logoRef.current, {
      opacity: 1, scale: 1, rotation: 0, filter: "blur(0px)",
      duration: 1.2, ease: "back.out(1.7)",
    })
    .to(textRef.current, {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 0.8, ease: "power3.out",
    }, "-=0.6")
    .to(dotsRef.current, {
      opacity: 1, scale: 1, rotation: 0,
      duration: 0.6, stagger: 0.1, ease: "back.out(1.5)",
    }, "-=0.3");

    // Pulsing dots loop
    const dotsLoop = gsap.timeline({ repeat: -1 });
    dotsLoop
      .to(dotsRef.current, { scale: 1.3, duration: 0.4, stagger: 0.1, ease: "power2.inOut" })
      .to(dotsRef.current, { scale: 1, duration: 0.4, stagger: 0.1, ease: "power2.inOut" });

    // Exit after 2.5 s then call onDone
    const exitTimer = setTimeout(() => {
      gsap.to(dotsRef.current, { opacity: 0, scale: 0, rotation: -180, duration: 0.5, stagger: 0.05, ease: "back.in(1.5)" });
      gsap.to(textRef.current, { opacity: 0, y: -20, filter: "blur(5px)", duration: 0.8, ease: "power3.in", delay: 0.1 });
      gsap.to(logoRef.current, { opacity: 0, scale: 0.5, rotation: 10, filter: "blur(10px)", duration: 1, ease: "back.in(1.7)", delay: 0.2 });
      gsap.to(containerRef.current, {
        opacity: 0, duration: 0.6, ease: "power2.in", delay: 0.5,
        onComplete: onDone,
      });
    }, 2500);

    return () => {
      clearTimeout(exitTimer);
      tl.kill();
      dotsLoop.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)",
        display: "flex", justifyContent: "center", alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Rotating radial glow (same as LoadingScreen) */}
      <div style={{
        position: "absolute", top: "-50%", left: "-50%",
        width: "200%", height: "200%",
        background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
        animation: "loi-rotate 20s linear infinite",
        pointerEvents: "none",
      }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: "2rem", perspective: "1000px" }}>
          <img
            ref={logoRef}
            src="/assets/1iQ-White.png"
            alt="1iQ Logo"
            style={{ height: "10rem", width: "auto", transformOrigin: "center center" }}
          />
        </div>
        <div
          ref={textRef}
          style={{
            fontSize: "1.25rem", fontWeight: 400,
            color: "rgba(255,255,255,0.9)", marginBottom: "1.5rem",
            fontFamily: "'Inter', sans-serif", letterSpacing: "0.01em",
          }}
        >
          Loading intelligence…
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              ref={(el) => { dotsRef.current[i] = el; }}
              style={{
                width: 10, height: 10, borderRadius: "50%",
                background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)",
                boxShadow: "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)",
                display: "inline-block",
              }}
            />
          ))}
        </div>
      </div>
      <style>{`@keyframes loi-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOI TERMS MODAL  (kept from original)
   ═══════════════════════════════════════════════════════════════ */
const LOI_DATE = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

function LOIModal({ name, company, visible, onAccept, onDecline }) {
  const [agreed, setAgreed] = useState(false);
  const scrollRef = useRef(null);

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
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "22px", fontWeight: 800, color: "#1a1d23", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
            1iQ Platform Access Agreement
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#9098a4", margin: 0 }}>
            Effective Date: {LOI_DATE}&nbsp;·&nbsp; Applicant: <strong style={{ color: "#5a5f6b" }}>{name}{company ? ` — ${company}` : ""}</strong>
          </p>
        </div>

        {/* ── Scrollable Body ── */}
        <div ref={scrollRef} style={{
          flex: 1, overflowY: "auto", padding: "28px 32px",
          fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#3a3f4a",
          lineHeight: 1.75, letterSpacing: "-0.05px",
        }}>
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #ecedf0", fontSize: "13px", color: "#9098a4", lineHeight: 1.8 }}>
            <div style={{ marginBottom: 4 }}>30 January 2026</div>
            <div style={{ marginBottom: 4 }}>Via Electronic Mail</div>
            <div style={{ marginTop: 12, color: "#5a5f6b" }}>
              <strong style={{ color: "#1a1d23" }}>1iQ, LLC</strong><br />
              Los Angeles, California
            </div>
            <div style={{ marginTop: 8, color: "#5a5f6b" }}>
              Attn: <strong style={{ color: "#1a1d23" }}>{name}</strong>
              {company && <><br /><span style={{ color: "#5a5f6b" }}>{company}</span></>}
            </div>
            <div style={{ marginTop: 8, fontWeight: 600, color: "#3a3f4a" }}>Re: Letter of Intent for Services to be Provided</div>
          </div>

          <p style={{ margin: "0 0 16px", color: "#3a3f4a" }}>Dear {name || "Ladies and Gentlemen"}:</p>
          <p style={{ margin: "0 0 28px", color: "#5a5f6b" }}>
            This letter of intent (<strong style={{ color: "#1a1d23" }}>"LOI"</strong>) sets out the principal terms of a potential contract for services being considered by{" "}
            <strong style={{ color: "#1a1d23" }}>{name}{company ? ` / ${company}` : ""}</strong> (<strong style={{ color: "#1a1d23" }}>"Customer"</strong>) for use of the 1iQ platform and services from 1iQ, LLC a Wyoming limited liability company (<strong style={{ color: "#1a1d23" }}>"1iQ"</strong>).
          </p>

          {[
            { num: "1.", title: "Nonbinding", body: "Except for the provisions of Sections 3–8, this LOI is not binding on the Parties; it is only an expression of basic terms and conditions that the Parties presently intend to incorporate in a formal written agreement. No binding agreement shall exist unless and until a Definitive Agreement has been duly executed and delivered by both Parties." },
            { num: "2.", title: "Supply of Services", body: "It is the present intention of the Parties that, upon execution of the Definitive Agreement, Customer would purchase, subscribe for, or otherwise contract for 1iQ platform services at the price, terms, and other material qualifiers mutually agreed upon." },
            { num: "3.", title: "Confidentiality", body: "Each Party agrees to keep confidential all non-public information disclosed by the other Party in connection with the Transaction, including but not limited to the existence and terms of this LOI. This obligation shall survive the termination or expiration of this LOI." },
            { num: "4.", title: "Exclusivity", body: "During the period commencing on the date of this LOI and ending sixty (60) business days thereafter, Customer agrees not to solicit, initiate, or participate in discussions with any third party regarding any substantially similar transaction." },
            { num: "5.", title: "Expenses", body: "Each Party shall bear its own costs, fees, and expenses incurred in connection with the negotiation, preparation, and execution of this LOI and the Definitive Agreement, unless otherwise agreed in writing." },
            { num: "6.", title: "No Obligation to Complete Transaction", body: "Nothing in this LOI shall obligate either Party to complete the Transaction or to enter into the Definitive Agreement. Either Party may withdraw from negotiations at any time without liability, subject to the binding provisions hereof." },
            { num: "7.", title: "Governing Law", body: "This LOI shall be governed by and construed in accordance with the laws of the State of California. Any dispute shall be resolved exclusively in the courts of Los Angeles County, California." },
            { num: "8.", title: "Entire Agreement; Amendments", body: "This LOI constitutes the entire agreement of the Parties with respect to the subject matter hereof and supersedes all prior agreements. This LOI may not be amended except by a written instrument signed by both Parties." },
          ].map((s) => (
            <div key={s.num} style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, color: "#1a1d23", letterSpacing: "1.2px", textTransform: "uppercase", margin: "0 0 8px", display: "flex", gap: 8 }}>
                <span style={{ color: "#9098a4" }}>{s.num}</span> {s.title}
              </h3>
              <p style={{ margin: 0, color: "#5a5f6b" }}>{s.body}</p>
            </div>
          ))}

          <div style={{ borderTop: "1px solid #ecedf0", paddingTop: 20, marginTop: 8, color: "#9098a4", fontSize: "12px" }}>
            By accepting below, Customer represents that they have the full authority to bind themselves and their organization to the terms of this Letter of Intent.
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "20px 32px 24px", borderTop: "1px solid #ecedf0", flexShrink: 0, background: "#fafafa", borderRadius: "0 0 16px 16px" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginBottom: 20 }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2, accentColor: "#1a1d23", cursor: "pointer", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13.5px", color: "#3a3f4a", lineHeight: 1.5 }}>
              I have read, understood, and agree to the terms of this Letter of Intent on behalf of myself and/or my organization.
            </span>
          </label>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button onClick={onDecline} style={{ padding: "12px 24px", borderRadius: "100px", border: "1px solid #d8dbe0", background: "#ffffff", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: "#5a5f6b", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
              Decline
            </button>
            <button onClick={agreed ? onAccept : undefined} disabled={!agreed} style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: "100px", border: "none", overflow: "hidden", background: agreed ? "#1a1d23" : "#d0d3db", cursor: agreed ? "pointer" : "not-allowed" }}>
              <span style={{ padding: "12px 20px 12px 24px", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: "#ffffff", letterSpacing: "1.2px", textTransform: "uppercase" }}>Accept &amp; Continue</span>
              <span style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.12)", borderRadius: "50%", margin: "3px 3px 3px 0" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEMO BOOKING PAGE
   ═══════════════════════════════════════════════════════════════ */

const PM_OPTIONS = ["1–3", "4–10", "11–25", "25+"];

const BULLETS = [
  "Watch the schedule rewrite itself the moment a field task closes",
  "See live project intelligence across every active job — no manual input",
  "Get your team's ROI figure before the call ends",
];

function DemoField({ label, id, children, required }) {
  return (
    <div className="demo-field">
      <label htmlFor={id} className="demo-field__label">
        {label}{required && <span className="demo-field__req"> *</span>}
      </label>
      {children}
    </div>
  );
}

const Schedule = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [showLOI, setShowLOI] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(null);

  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "", pmCount: "",
  });

  const set = (field) => (e) => setData((d) => ({ ...d, [field]: e.target.value }));

  const canSubmit = data.firstName && data.lastName && data.email && data.company;

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
        "Number of Project Managers": data.pmCount,
      };
      Object.entries(payload).forEach(([key, value]) => {
        if (value && value.toString().trim() !== "") formData.append(key, value);
      });
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const result = await response.json();
      if (result.success) {
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

      // 2. Email to ADMIN (your web3forms account default email)
      await sendLOIEmail({
        formData: data, pdfBlob, acceptedAt, toEmail: null,
        subject: `LOI Accepted — ${data.firstName} ${data.lastName} / ${data.company}`,
      });

      // 3. Email confirmation to the SUBMITTER
      //    Requires web3forms Pro plan to deliver to a different address.
      //    On free plan the admin copy above still goes through.
      await sendLOIEmail({
        formData: data, pdfBlob, acceptedAt, toEmail: data.email,
        subject: `Your 1iQ Platform LOI — ${data.company || data.firstName}`,
      });
    } catch (err) {
      // Non-blocking — loading screen continues regardless
      console.error("LOI PDF/email error:", err);
    }
  };

  // Called when the loading screen animation finishes
  const handleLoaderDone = () => {
    setShowLoader(false);
    // Navigate to home and scroll to the very top
    navigate("/");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: "10px",
    border: `1.5px solid ${focused === field ? "#4a9eff" : "rgba(255,255,255,0.12)"}`,
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    fontSize: "15px",
    fontWeight: 400,
    outline: "none",
    transition: "border-color 0.2s ease, background 0.2s ease",
    boxSizing: "border-box",
    boxShadow: focused === field ? "0 0 0 3px rgba(74,158,255,0.12)" : "none",
  });

  return (
    <div className="app relative w-full overflow-x-hidden">
      <Navigation heroRef={heroRef} />

      <CommonHeader
        ref={heroRef}
        title="Get Started"
        text="Ready to experience 1iQ? Tell us about your team and we'll be in touch."
      />

      {/* ── LOI Modal ── */}
      <LOIModal
        name={data.firstName || "there"}
        company={data.company}
        visible={showLOI}
        onAccept={handleLOIAccept}
        onDecline={() => setShowLOI(false)}
      />

      {/* ── Post-LOI Loading Intelligence Screen ── */}
      {showLoader && <PostLOILoader onDone={handleLoaderDone} />}

      {/* ── Demo Booking Section ── */}
      <section className="demo-booking">
        <div className="demo-booking__inner">

          {/* ── LEFT: Value Prop ── */}
          <div className="demo-booking__left">
            <h2 className="demo-booking__headline">
              See Your Virtual Project Manager in Action
            </h2>
            <p className="demo-booking__subtext">
              Book a 30-minute demo. See how 1iQ eliminates manual tracking, follow-ups, and schedule coordination — live on a real project.
            </p>
            <ul className="demo-booking__bullets">
              {BULLETS.map((b, i) => (
                <li key={i} className="demo-booking__bullet">
                  <span className="demo-booking__check" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Badge row */}
            <div className="demo-booking__badges">
              <span className="demo-booking__badge">30-min call</span>
              <span className="demo-booking__badge">No commitment</span>
              <span className="demo-booking__badge">Live demo</span>
            </div>
          </div>

          {/* ── RIGHT: Form Card ── */}
          <div className="demo-booking__right">
            <div className="demo-card">
              <div className="demo-card__header">
                <p className="demo-card__eyebrow">Book a Demo</p>
                <h3 className="demo-card__title">Tell us where to reach you</h3>
              </div>

              <form onSubmit={handleSubmit} className="demo-card__form" noValidate>
                {/* Name row */}
                <div className="demo-card__row">
                  <DemoField label="First Name" id="firstName" required>
                    <input
                      id="firstName"
                      type="text"
                      value={data.firstName}
                      onChange={set("firstName")}
                      placeholder="Jane"
                      required
                      onFocus={() => setFocused("firstName")}
                      onBlur={() => setFocused(null)}
                      style={inputStyle("firstName")}
                    />
                  </DemoField>
                  <DemoField label="Last Name" id="lastName" required>
                    <input
                      id="lastName"
                      type="text"
                      value={data.lastName}
                      onChange={set("lastName")}
                      placeholder="Smith"
                      required
                      onFocus={() => setFocused("lastName")}
                      onBlur={() => setFocused(null)}
                      style={inputStyle("lastName")}
                    />
                  </DemoField>
                </div>

                {/* Work Email */}
                <DemoField label="Work Email" id="email" required>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={set("email")}
                    placeholder="jane@company.com"
                    required
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("email")}
                  />
                </DemoField>

                {/* Phone */}
                <DemoField label="Phone" id="phone">
                  <input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={set("phone")}
                    placeholder="+1 (555) 000-0000"
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("phone")}
                  />
                </DemoField>

                {/* Company Name */}
                <DemoField label="Company Name" id="company" required>
                  <input
                    id="company"
                    type="text"
                    value={data.company}
                    onChange={set("company")}
                    placeholder="Acme Construction"
                    required
                    onFocus={() => setFocused("company")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("company")}
                  />
                </DemoField>

                {/* Number of Project Managers */}
                <DemoField label="Number of Project Managers" id="pmCount">
                  <select
                    id="pmCount"
                    value={data.pmCount}
                    onChange={set("pmCount")}
                    onFocus={() => setFocused("pmCount")}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputStyle("pmCount"),
                      color: data.pmCount ? "#ffffff" : "rgba(255,255,255,0.35)",
                      appearance: "none",
                      WebkitAppearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      paddingRight: "40px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="" disabled>Select range</option>
                    {PM_OPTIONS.map((o) => (
                      <option key={o} value={o} style={{ background: "#0d1117", color: "#ffffff" }}>{o}</option>
                    ))}
                  </select>
                </DemoField>

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={!canSubmit || sending}
                  className="demo-card__submit"
                  style={{ opacity: canSubmit && !sending ? 1 : 0.5, cursor: canSubmit && !sending ? "pointer" : "not-allowed" }}
                >
                  {sending ? "Booking…" : "Book My Demo →"}
                </button>

                <p className="demo-card__footnote">
                  30 minutes. No commitment. We'll confirm within one business day.
                </p>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.92) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder, select::placeholder { color: rgba(255,255,255,0.28); }
        select option { background: #0d1117; color: #ffffff; }
      `}</style>
    </div>
  );
};

export default Schedule;
