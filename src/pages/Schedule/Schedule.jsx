import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import jsPDF from "jspdf";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Footer from "../../components/Shared/Footer/Footer";
import { MetalFx } from "metal-fx";
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
  const declineRef = useRef(null);
  const acceptRef = useRef(null);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px", animation: "fadeIn 0.25s ease forwards",
    }}>
      <div style={{
        background: "#ffffff", borderRadius: "20px", width: "100%", maxWidth: 680,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 40px 120px rgba(0,0,0,0.15), 0 0 50px rgba(0, 102, 255, 0.05)",
        border: "1px solid rgba(0, 0, 0, 0.08)", animation: "popIn 0.35s cubic-bezier(.34,1.4,.64,1) forwards",
      }}>
        {/* ── Header ── */}
        <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 6, height: 28, background: "#0066ff", borderRadius: 3 }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#0066ff" }}>
              LETTER OF INTENT
            </span>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, color: "#000000", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
            1iQ Platform Access Agreement
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#666666", margin: 0 }}>
            Effective Date: {LOI_DATE}&nbsp;·&nbsp; Applicant: <strong style={{ color: "#000000" }}>{name}{company ? `, ${company}` : ""}</strong>
          </p>
        </div>

        {/* ── Scrollable Body ── */}
        <div ref={scrollRef} style={{
          flex: 1, overflowY: "auto", padding: "28px 32px",
          fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#333333",
          lineHeight: 1.75, letterSpacing: "-0.05px",
        }}>
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid rgba(0, 0, 0, 0.08)", fontSize: "13px", color: "#666666", lineHeight: 1.8 }}>
            <div style={{ marginBottom: 4 }}>30 January 2026</div>
            <div style={{ marginBottom: 4 }}>Via Electronic Mail</div>
            <div style={{ marginTop: 12, color: "#666666" }}>
              <strong style={{ color: "#000000" }}>1iQ, LLC</strong><br />
              Los Angeles, California
            </div>
            <div style={{ marginTop: 8, color: "#666666" }}>
              Attn: <strong style={{ color: "#000000" }}>{name}</strong>
              {company && <><br /><span style={{ color: "#666666" }}>{company}</span></>}
            </div>
            <div style={{ marginTop: 8, fontWeight: 600, color: "#000000" }}>Re: Letter of Intent for Services to be Provided</div>
          </div>

          <p style={{ margin: "0 0 16px", color: "#000000" }}>Dear {name || "Ladies and Gentlemen"}:</p>
          <p style={{ margin: "0 0 28px", color: "#666666" }}>
            This letter of intent (<strong style={{ color: "#000000" }}>"LOI"</strong>) sets out the principal terms of a potential contract for services being considered by{" "}
            <strong style={{ color: "#000000" }}>{name}{company ? ` / ${company}` : ""}</strong> (<strong style={{ color: "#000000" }}>"Customer"</strong>) for use of the 1iQ platform and services from 1iQ, LLC a Wyoming limited liability company (<strong style={{ color: "#000000" }}>"1iQ"</strong>).
          </p>

          {[
            { num: "1.", title: "Nonbinding", body: "Except for the provisions of Sections 3 to 8, this LOI is not binding on the Parties; it is only an expression of basic terms and conditions that the Parties presently intend to incorporate in a formal written agreement. No binding agreement shall exist unless and until a Definitive Agreement has been duly executed and delivered by both Parties." },
            { num: "2.", title: "Supply of Services", body: "It is the present intention of the Parties that, upon execution of the Definitive Agreement, Customer would purchase, subscribe for, or otherwise contract for 1iQ platform services at the price, terms, and other material qualifiers mutually agreed upon." },
            { num: "3.", title: "Confidentiality", body: "Each Party agrees to keep confidential all non-public information disclosed by the other Party in connection with the Transaction, including but not limited to the existence and terms of this LOI. This obligation shall survive the termination or expiration of this LOI." },
            { num: "4.", title: "Exclusivity", body: "During the period commencing on the date of this LOI and ending sixty (60) business days thereafter, Customer agrees not to solicit, initiate, or participate in discussions with any third party regarding any substantially similar transaction." },
            { num: "5.", title: "Expenses", body: "Each Party shall bear its own costs, fees, and expenses incurred in connection with the negotiation, preparation, and execution of this LOI and the Definitive Agreement, unless otherwise agreed in writing." },
            { num: "6.", title: "No Obligation to Complete Transaction", body: "Nothing in this LOI shall obligate either Party to complete the Transaction or to enter into the Definitive Agreement. Either Party may withdraw from negotiations at any time without liability, subject to the binding provisions hereof." },
            { num: "7.", title: "Governing Law", body: "This LOI shall be governed by and construed in accordance with the laws of the State of California. Any dispute shall be resolved exclusively in the courts of Los Angeles County, California." },
            { num: "8.", title: "Entire Agreement; Amendments", body: "This LOI constitutes the entire agreement of the Parties with respect to the subject matter hereof and supersedes all prior agreements. This LOI may not be amended except by a written instrument signed by both Parties." },
          ].map((s) => (
            <div key={s.num} style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700, color: "#000000", letterSpacing: "1.2px", textTransform: "uppercase", margin: "0 0 8px", display: "flex", gap: 8 }}>
                <span style={{ color: "#0066ff" }}>{s.num}</span> {s.title}
              </h3>
              <p style={{ margin: 0, color: "#666666" }}>{s.body}</p>
            </div>
          ))}

          <div style={{ borderTop: "1px solid rgba(0, 0, 0, 0.08)", paddingTop: 20, marginTop: 8, color: "#666666", fontSize: "12px" }}>
            By accepting below, Customer represents that they have the full authority to bind themselves and their organization to the terms of this Letter of Intent.
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "20px 32px 24px", borderTop: "1px solid rgba(0, 0, 0, 0.08)", flexShrink: 0, background: "rgba(0, 0, 0, 0.02)", borderRadius: "0 0 20px 20px" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginBottom: 20 }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2, accentColor: "#0066ff", cursor: "pointer", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13.5px", color: "#666666", lineHeight: 1.5 }}>
              I have read, understood, and agree to the terms of this Letter of Intent on behalf of myself and/or my organization.
            </span>
          </label>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <MetalFx preset="chromatic" strength={0.90} reflectionTargets={[declineRef]}>
              <button ref={declineRef} onClick={onDecline} style={{ padding: "12px 24px", borderRadius: "100px", border: "1px solid rgba(0, 0, 0, 0.15)", background: "#f0f0f0", fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 600, color: "#666666", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
                Decline
              </button>
            </MetalFx>
            <MetalFx preset="chromatic" strength={0.90} reflectionTargets={[acceptRef]}>
              <button ref={acceptRef} onClick={agreed ? onAccept : undefined} disabled={!agreed} style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: "100px", border: "none", overflow: "hidden", background: agreed ? "#0066ff" : "rgba(0,0,0,0.05)", cursor: agreed ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                <span style={{ padding: "12px 20px 12px 24px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 600, color: agreed ? "#ffffff" : "rgba(0,0,0,0.3)", letterSpacing: "1.2px", textTransform: "uppercase" }}>Continue</span>
                <span style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.12)", borderRadius: "50%", margin: "3px 3px 3px 0" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </button>
            </MetalFx>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEMO BOOKING PAGE
   ═══════════════════════════════════════════════════════════════ */

const PORTFOLIO_OPTIONS = ["<$10M", "$10M-$50M", "$50M-$100M", "$100M+"];
const PROJECT_TYPES = ["Residential", "Commercial", "Mixed-Use", "Industrial", "Multifamily", "Hospitality", "Other"];
const PORTFOLIO_SIZES = ["1-2 projects", "3-5 projects", "6-10 projects", "10+ projects"];

const BULLETS = [
  "See live project data from your GC's field operations flowing to your developer dashboard",
  "Watch 1iQ predict schedule delays and budget overruns 2-4 weeks before they manifest",
  "Review ROI calculations and capital protection scenarios specific to your portfolio",
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
        title="Development Intelligence Briefing"
        text="Schedule a private briefing to see how 1iQ transforms fragmented project data into capital-protecting intelligence for your development business."
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
              Private Development Intelligence Briefing
            </h2>
            <p className="demo-booking__subtext">
              Schedule a 30-minute executive briefing with real project data. See exactly how 1iQ transforms your current reporting gaps into capital-protecting intelligence.
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
              <span className="demo-booking__badge">Executive briefing</span>
              <span className="demo-booking__badge">ROI analysis</span>
              <span className="demo-booking__badge">Risk modeling demo</span>
            </div>
          </div>

          {/* ── RIGHT: Form Card ── */}
          <div className="demo-booking__right">
            <div className="demo-card">
              <div className="demo-card__header">
                <p className="demo-card__eyebrow">Executive Briefing</p>
                <h3 className="demo-card__title">Schedule your development intelligence review</h3>
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

                {/* Current Development Portfolio Value */}
                <DemoField label="Current Development Portfolio Value" id="portfolioValue" required>
                  <select
                    id="portfolioValue"
                    value={data.portfolioValue}
                    onChange={set("portfolioValue")}
                    onFocus={() => setFocused("portfolioValue")}
                    onBlur={() => setFocused(null)}
                    required
                    style={{
                      ...inputStyle("portfolioValue"),
                      color: data.portfolioValue ? "#ffffff" : "rgba(255,255,255,0.35)",
                      appearance: "none",
                      WebkitAppearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      paddingRight: "40px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="" disabled>Select portfolio value</option>
                    {PORTFOLIO_OPTIONS.map((o) => (
                      <option key={o} value={o} style={{ background: "#0d1117", color: "#ffffff" }}>{o}</option>
                    ))}
                  </select>
                </DemoField>

                {/* Primary Project Type */}
                <DemoField label="Primary Project Type" id="projectType">
                  <select
                    id="projectType"
                    value={data.projectType}
                    onChange={set("projectType")}
                    onFocus={() => setFocused("projectType")}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputStyle("projectType"),
                      color: data.projectType ? "#ffffff" : "rgba(255,255,255,0.35)",
                      appearance: "none",
                      WebkitAppearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      paddingRight: "40px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="" disabled>Select project type</option>
                    {PROJECT_TYPES.map((o) => (
                      <option key={o} value={o} style={{ background: "#0d1117", color: "#ffffff" }}>{o}</option>
                    ))}
                  </select>
                </DemoField>

                {/* Active Portfolio Size */}
                <DemoField label="Active Portfolio Size" id="portfolioSize">
                  <select
                    id="portfolioSize"
                    value={data.portfolioSize}
                    onChange={set("portfolioSize")}
                    onFocus={() => setFocused("portfolioSize")}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputStyle("portfolioSize"),
                      color: data.portfolioSize ? "#ffffff" : "rgba(255,255,255,0.35)",
                      appearance: "none",
                      WebkitAppearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      paddingRight: "40px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="" disabled>Select portfolio size</option>
                    {PORTFOLIO_SIZES.map((o) => (
                      <option key={o} value={o} style={{ background: "#0d1117", color: "#ffffff" }}>{o}</option>
                    ))}
                  </select>
                </DemoField>

                {/* Primary Visibility Challenge */}
                <DemoField label="Primary Visibility Challenge" id="painPoint">
                  <input
                    id="painPoint"
                    type="text"
                    value={data.painPoint}
                    onChange={set("painPoint")}
                    placeholder="e.g., Delayed GC reports, budget overruns, investor reporting"
                    onFocus={() => setFocused("painPoint")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("painPoint")}
                  />
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
