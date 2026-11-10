/* The 1iq.ai home page's behaviour, ported from the approved mock (Nov 2026).
   init(root) wires everything up and returns a cleanup that stops every loop, listener, observer and WebGL context.
   three.js is pinned to r128 (as "three-r128") because the scene relies on that version's colour and lighting API. */
import * as THREE from "three-r128";

const WEB3FORMS_KEY = "6d1a807a-d50b-4157-a797-bc78554ce667"; // same public key as the contact page

export function init(root) {
  let alive = true;
  const ctl = new AbortController(), signal = ctl.signal;
  const observers = [], timers = [], gl = [];
  const IO = (cb, o) => { const x = new IntersectionObserver(cb, o); observers.push(x); return x; };
  const RO = (cb) => { const x = new ResizeObserver(cb); observers.push(x); return x; };
  const MO = (cb) => { const x = new MutationObserver(cb); observers.push(x); return x; };
  const raf = (f) => (alive ? requestAnimationFrame(f) : 0);
  const later = (f, ms) => setTimeout(() => alive && f(), ms);
  const every = (f, ms) => { const id = setInterval(() => alive && f(), ms); timers.push(id); return id; };
  const addEventListener = (type, fn, opts) => window.addEventListener(type, fn, { ...(opts && typeof opts === "object" ? opts : {}), signal });
  const cleanup = () => {
    alive = false; ctl.abort(); observers.forEach((o) => o.disconnect()); timers.forEach(clearInterval);
    gl.forEach((r) => { try { r.dispose(); r.forceContextLoss(); } catch (e) { /* already gone */ } });
    document.body.classList.remove("s26-body");
  };
  document.body.classList.add("s26-body");
  void root;
  (() => {

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDark = () => { const t = document.documentElement.dataset.theme; return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; };
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /* ---------- menu */
  const banner = document.getElementById("banner"), menu = document.getElementById("menu"), drawer = document.getElementById("drawer");
  menu.addEventListener("click", () => { const o = banner.classList.toggle("is-open"); menu.setAttribute("aria-expanded", o); menu.textContent = o ? "Close" : "Menu"; });
  drawer.addEventListener("click", (e) => { if (e.target.closest("a")) { banner.classList.remove("is-open"); menu.setAttribute("aria-expanded", "false"); menu.textContent = "Menu"; } });
  // Ask 1iQ: the placeholder types example questions; asking shows what the briefing covers
  const askin = document.getElementById("askin"), askout = document.getElementById("askout");
  const QS = ["When will Harbor Lofts finish?", "What is late this week?", "What does a lost day cost?", "Which draws are waiting?"];
  let qi = 0, qn = 0, qhold = 0;
  if (!reduce) every(() => {
    if (document.activeElement === askin || askin.value) return;
    const q = QS[qi]; if (qhold > 0) { qhold--; return; }
    qn++; askin.placeholder = "Ask 1iQ · " + q.slice(0, qn);
    if (qn >= q.length) { qhold = 28; qn = 0; qi = (qi + 1) % QS.length; }
  }, 60);
  document.getElementById("ask").addEventListener("submit", (e) => {
    e.preventDefault(); const q = askin.value.trim() || QS[qi];
    askout.innerHTML = `<span class="label">Ask 1iQ</span>On your projects, 1iQ answers questions like <b>${q.replace(/[<>&]/g, "")}</b> from live site data. Book a briefing to see it on one of yours.`;
    askout.classList.add("is-on");
  });
  document.addEventListener("click", (e) => { if (!e.target.closest("#ask")) askout.classList.remove("is-on"); }, { signal });

  /* ---------- briefing types itself; the full sentence holds the space */
  // a new briefing every day of the example week: on time, late, overdue, early, signed off
  const BRIEFS = [
    ["Monday", "ok", "On time", "Harbor Lofts is on schedule to finish Jul 27. Floor 11 framing starts today with Summit Builders on site."],
    ["Tuesday", "watch", "Waiting on PM", "Rain is forecast Thursday and Friday. Recon moved the level 12 pour to Wednesday and is waiting for the PM's approval."],
    ["Wednesday", "late", "Overdue", "1iQ reminded Summit Plumbing at 6 AM. Rough plumbing was still not started at noon, so the PM was alerted."],
    ["Thursday", "late", "Late", "Harbor Lofts will finish Aug 3, 7 days late, because rough plumbing is 5 days overdue. Each further day costs about $276."],
    ["Friday", "ok", "Signed off", "Floor 11 framing was signed off by the PM. Glazing on level 10 finished 2 days early."],
    ["Monday", "info", "Recovered", "Plumbing is back on track. The forecast finish improves to Jul 31, 4 days late, saving about $830 in carrying cost."],
  ];
  const byId = (id) => document.getElementById(id);
  const typed = byId("typed"), briefGhost = byId("ghost"), bday = byId("bday"), bstatus = byId("bstatus"), card = byId("briefing");
  const dotsEl = document.createElement("div"); dotsEl.className = "briefing__dots"; dotsEl.setAttribute("aria-hidden", "true");
  BRIEFS.forEach(() => dotsEl.appendChild(document.createElement("span"))); card.appendChild(dotsEl);
  briefGhost.textContent = BRIEFS.reduce((a, b) => (b[3].length > a.length ? b[3] : a), ""); // the longest one holds the space
  let bi = 0;
  const showBrief = (i, animate) => {
    const [day, s, label, text] = BRIEFS[i];
    bday.textContent = `1iQ briefing · ${day} 7:00 AM`; bstatus.textContent = label; bstatus.dataset.s = s;
    [...dotsEl.children].forEach((d, k) => d.classList.toggle("is-on", k === i));
    card.setAttribute("aria-label", `1iQ briefing, ${day}, example project: ${label}. ${text}`);
    if (!animate) { typed.textContent = text; return; }
    let n = 0; const me = ++typing; bi = i;
    (function step() {
      if (me !== typing) return; // a newer day started
      typed.textContent = text.slice(0, n += 2);
      if (n < text.length) later(step, 22);
      else if (!dayDriven) later(() => { if (me === typing) showBrief((bi + 1) % BRIEFS.length, true); }, 3200);
    })();
  };
  let typing = 0, dayDriven = false; // dayDriven: the 3D building's day brings each new briefing at 7 AM
  if (reduce) showBrief(3, false); else later(() => { if (!typing) showBrief(0, true); }, 600);

  /* ---------- reveals and the rising tower */
  const rise = document.getElementById("rise"), days = [...document.querySelectorAll("#days span")];
  const BANDS = [[0, 5], [5, 10], [10, 14], [14, 18], [18, 22]];
  const floors = [];
  for (let f = 21; f >= 0; f--) { const s = document.createElement("span"); s.className = "rise__floor"; s.dataset.f = f; rise.appendChild(s); floors.push(s); }
  let lit = -1;
  const paint = () => {
    floors.forEach((s) => { const f = +s.dataset.f, b = BANDS.findIndex(([a, z]) => f >= a && f < z); s.classList.toggle("is-lit", b <= lit); s.classList.toggle("is-now", b === lit); });
    days.forEach((d, i) => d.classList.toggle("is-lit", i <= lit));
  };
  const io = IO((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    if (e.target.dataset.beat) { lit = Math.max(lit, +e.target.dataset.beat); paint(); }
    io.unobserve(e.target);
  }), { threshold: .3 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- exposure: every figure adds up */
  const ASSETS = [["multifamily","Multifamily",2.8,.21],["hospitality","Hospitality",4.6,.28],["industrial","Industrial and logistics",2.4,.18],["mixed","Mixed use",3.5,.25],["data","Data centers",5.2,.32],["commercial","Commercial",3.1,.22]];
  const MARKETS = [["1","Established (US, UK, Canada, EU)",1],["2","High growth (Brazil, Mexico, Gulf)",1.25],["3","Emerging (Nigeria, India, SE Asia)",1.55]];
  const $ = (id) => document.getElementById(id);
  ASSETS.forEach(([v, l]) => $("asset").add(new Option(l, v)));
  MARKETS.forEach(([v, l]) => $("market").add(new Option(l, v)));
  const full = (n) => "$" + n.toLocaleString("en-US");
  const short = (n) => n >= 1e6 ? "$" + (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M" : "$" + Math.round(n / 1000) + "K";
  const calc = () => {
    const a = ASSETS.find((x) => x[0] === $("asset").value), m = MARKETS.find((x) => x[0] === $("market").value);
    const budget = +$("budget").value, months = +$("months").value;
    const carrying = Math.round((budget * .7 * .08) / 12 + 29000), dm = Math.round(a[2] * m[2] * 10) / 10;
    const delay = Math.round(carrying * a[2] * m[2]), over = Math.round(budget * a[3] * m[2]), risk = delay + over;
    $("budgetv").textContent = short(budget); $("monthsv").textContent = months;
    $("atrisk").textContent = full(risk); $("delay").textContent = full(delay); $("overrun").textContent = full(over);
    $("delayl").textContent = `Delay cost: ${dm} months of carrying cost`;
    $("sa").style.width = (delay / risk * 100) + "%"; $("sb").style.width = (over / risk * 100) + "%";
    $("slip").innerHTML = `Every month this project slips costs about <b class="num">${full(carrying)}</b> in carrying cost alone. A typical slip of ${dm} months adds ${Math.round(dm / months * 100)}% to a build of ${months} months.`;
  };
  ["asset", "market", "budget", "months"].forEach((id) => $(id).addEventListener("input", calc));
  $("expform").addEventListener("submit", (e) => e.preventDefault());
  calc();

  /* ---------- page motion: banner, hero story, words, gap list, agents, faq, quote, form */
  let heroTwin = () => {};
  const heroEl = $("top"), heroA = $("heroa"), heroB = $("herob"), cue = $("cue"), shade = $("shade"), heroFade = $("herofade");
  const wrapWords = (el) => { el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span> `).join(""); return [...el.querySelectorAll(".w")]; };
  const stWords = wrapWords($("statement"));
  [["live", "model"], ["trust,"], ["on", "site."], ["time", "to", "fix", "them."]].forEach((ph) => stWords.forEach((w, i) => { if (ph.every((t, k) => stWords[i + k]?.textContent === t)) ph.forEach((_, k) => stWords[i + k].classList.add("w--blue")); }));
  const wordHeads = [...document.querySelectorAll(".words")].map((el) => [el, wrapWords(el)]);
  const gapItems = [...document.querySelectorAll(".gapitem")];
  const qimg = $("quoteimg");
  const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const onScroll = () => {
    const vh = innerHeight, y = scrollY, hr = heroEl.getBoundingClientRect();
    const p = reduce ? 0 : Math.max(0, Math.min(1, -hr.top / Math.max(1, hr.height - vh)));
    heroA.style.opacity = 1 - sm(.03, .12, p); heroA.style.transform = `translateY(${-sm(0, .14, p) * 90}px)`; heroA.style.pointerEvents = p > .1 ? "none" : "";
    cue.style.opacity = 1 - sm(0, .04, p);
    shade.style.opacity = 1 - sm(.06, .3, p);
    heroB.style.opacity = sm(.56, .64, p) * (1 - sm(.86, .92, p));
    heroFade.style.opacity = sm(.88, .99, p);
    const lit = (p - .6) / .22 * stWords.length; stWords.forEach((w, i) => w.classList.toggle("is-on", i < lit));
    heroTwin(sm(.08, .58, p), sm(.06, 1, p));
    banner.classList.toggle("is-light", p > .94 || hr.bottom < 90);
    wordHeads.forEach(([el, ws]) => { const r = el.getBoundingClientRect(), k = (vh * .9 - r.top) / (vh * .45); ws.forEach((w, i) => w.classList.toggle("is-on", reduce || i < k * ws.length)); });
    gapItems.forEach((g) => { const r = g.getBoundingClientRect(); g.classList.toggle("is-on", reduce || (r.top < vh * .62 && r.bottom > vh * .3)); });
    if (qimg) { const r = qimg.parentElement.getBoundingClientRect(); qimg.style.transform = `translateY(${(r.top + r.height / 2 - vh / 2) * -.05}px)`; }
  };
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);
  // agents: tabs and arrows scroll the row
  const track = $("track"), tabs = [...document.querySelectorAll("#agents .tab")], cards = [...track.children];
  const go = (i) => { i = (i + cards.length) % cards.length; track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" }); };
  const cur = () => { let b = 0, d = 1e9; cards.forEach((c, i) => { const x = Math.abs(c.offsetLeft - track.offsetLeft - track.scrollLeft); if (x < d) { d = x; b = i; } }); return b; };
  tabs.forEach((t) => t.addEventListener("click", () => go(+t.dataset.i)));
  $("prev").addEventListener("click", () => go(cur() - 1)); $("next").addEventListener("click", () => go(cur() + 1));
  track.addEventListener("scroll", () => { const c = cur(); tabs.forEach((t, i) => t.setAttribute("aria-selected", i === c)); cards.forEach((k, i) => k.classList.toggle("is-active", i === c)); }, { passive: true });
  cards.forEach((k, i) => k.addEventListener("click", () => go(i)));
  // faq topics
  const ftabs = [...document.querySelectorAll("#faqtabs .tab")], panels = [...document.querySelectorAll(".qpanel")];
  ftabs.forEach((t) => t.addEventListener("click", () => { ftabs.forEach((x) => x.setAttribute("aria-selected", x === t)); panels.forEach((pn) => (pn.hidden = pn.dataset.p !== t.dataset.p)); }));
  $("contactform").addEventListener("submit", async (e) => {
    e.preventDefault(); const f = e.currentTarget, note = $("formnote"), btn = f.querySelector("button[type=submit]");
    const data = new FormData(f); data.append("access_key", WEB3FORMS_KEY); data.append("subject", "1iq.ai briefing request"); data.append("from_name", "1iq.ai home page");
    btn.disabled = true; note.textContent = "Sending…";
    try { const r = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data }); const j = await r.json();
      if (j.success) { note.textContent = "Thanks. We'll be in touch within one business day to book your briefing."; f.reset(); } else throw new Error(j.message);
    } catch (err) { note.textContent = "That didn't send. Please email admin@1iq.ai and we'll book it from there."; }
    btn.disabled = false;
  });
  onScroll();

  // live schedule: tasks with dependencies; every few seconds something happens and the plan re-flows
  (() => {
    const box = $("lsg"); if (!box) return;
    const links = $("lsglinks"), fin = $("lsgfin"), msg = $("lsgmsg"), dateEl = $("lsgdate"), dot = $("lsgdot");
    const LX = () => (innerWidth <= 760 ? 84 : 104);
    const TASKS = [
      { id: "fr", name: "Framing L11", d: 6, dep: [] },
      { id: "gl", name: "Glazing L10", d: 7, dep: [], at: 2 },
      { id: "pl", name: "Rough plumbing", d: 5, dep: ["fr"] },
      { id: "el", name: "Electrical", d: 5, dep: ["fr"] },
      { id: "dw", name: "Drywall L11", d: 6, dep: ["pl", "el"] },
      { id: "fi", name: "Finishes", d: 6, dep: ["dw", "gl"] },
      { id: "ho", name: "Handover", d: 2, dep: ["fi"] },
    ];
    const SC = [
      { msg: "On schedule", tone: "good", s: { fr: "now", gl: "now" } },
      { msg: "Rough plumbing on hold · 3 tasks re-planned", tone: "late", d: { pl: 9 }, s: { fr: "done", gl: "now", pl: "hold" } },
      { msg: "Glazing finished 2 days early", tone: "late", d: { pl: 9, gl: 5 }, s: { fr: "done", gl: "done", pl: "hold" } },
      { msg: "Electrical crew free · moved ahead of plumbing", tone: "late", d: { pl: 9, gl: 5, el: 3 }, pri: { el: -1 }, s: { fr: "done", gl: "done", pl: "hold", el: "now" } },
      { msg: "Issue cleared · drywall resequenced, finish recovers", tone: "good", d: { pl: 6, gl: 5, el: 3, dw: 4 }, pri: { el: -1, gl: 9 }, s: { fr: "done", gl: "done", el: "done", pl: "now" } },
    ];
    const plan = (sc) => {
      const es = {}, ef = {};
      const get = (t) => { if (t.id in ef) return; t.dep.forEach((id) => get(TASKS.find((x) => x.id === id)));
        es[t.id] = Math.max(t.at || 0, 0, ...t.dep.map((id) => ef[id])); ef[t.id] = es[t.id] + ((sc.d || {})[t.id] ?? t.d); };
      TASKS.forEach(get);
      const pri = (t) => (sc.pri || {})[t.id] ?? TASKS.indexOf(t);
      const order = [...TASKS].sort((a, b) => es[a.id] - es[b.id] || pri(a) - pri(b)).map((t) => t.id);
      return { es, ef, order, end: Math.max(...Object.values(ef)) };
    };
    const base = plan(SC[0]), SPAN = base.end + 7, ROW = 29;
    const rows = {};
    TASKS.forEach((t) => {
      const r = document.createElement("div"); r.className = "lsg__row";
      r.innerHTML = `<span>${t.name}</span><div style="position:relative;height:100%"><i class="lsg__base"></i><i class="lsg__bar"></i></div>`;
      box.insertBefore(r, fin); rows[t.id] = { el: r, bar: r.querySelector(".lsg__bar"), base: r.querySelector(".lsg__base") };
      r.querySelector(".lsg__base").style.left = (base.es[t.id] / SPAN * 100) + "%"; r.querySelector(".lsg__base").style.width = ((base.ef[t.id] - base.es[t.id]) / SPAN * 100) + "%";
    });
    const dateOf = (end) => { const day = 27 + Math.round(end - base.end); return day > 31 ? `Aug ${day - 31}` : `Jul ${day}`; };
    const state = (sc) => { const p = plan(sc), o = { end: p.end }; TASKS.forEach((t) => { o[t.id] = { x: p.es[t.id], w: p.ef[t.id] - p.es[t.id], y: p.order.indexOf(t.id) }; }); return o; };
    const lerp = (A, B, k) => { const o = { end: A.end + (B.end - A.end) * k }; TASKS.forEach((t) => { const a = A[t.id], b = B[t.id]; o[t.id] = { x: a.x + (b.x - a.x) * k, w: a.w + (b.w - a.w) * k, y: a.y + (b.y - a.y) * k }; }); return o; };
    const draw = (S) => {
      const lx = LX(), tw = box.getBoundingClientRect().width - lx;
      let d = "";
      TASKS.forEach((t) => { const r = rows[t.id], v = S[t.id]; r.el.style.top = v.y * ROW + "px"; r.bar.style.left = (v.x / SPAN * 100) + "%"; r.bar.style.width = (v.w / SPAN * 100) + "%"; });
      TASKS.forEach((t) => t.dep.forEach((id) => {
        const a = S[id], b = S[t.id];
        const x1 = lx + (a.x + a.w) / SPAN * tw, y1 = a.y * ROW + 12, x2 = lx + b.x / SPAN * tw, y2 = b.y * ROW + 12, mx = Math.min(x1 + 7, x2 - 2);
        d += `M${x1.toFixed(1)} ${y1.toFixed(1)}H${mx.toFixed(1)}V${y2.toFixed(1)}H${(x2 - 1).toFixed(1)}`;
      }));
      links.innerHTML = `<path d="${d}"/>`;
      fin.style.left = (lx + S.end / SPAN * tw) + "px"; fin.firstChild.textContent = "Finish " + dateOf(S.end);
    };
    let from = null, to = null, si = 0;
    const apply = (i) => {
      const sc = SC[i]; from = to || state(SC[0]); to = state(sc); const t0 = performance.now();
      TASKS.forEach((t) => { rows[t.id].bar.dataset.s = (sc.s || {})[t.id] || "plan"; });
      msg.textContent = sc.msg; dateEl.textContent = dateOf(to.end);
      dateEl.className = to.end > base.end ? "is-late" : to.end < base.end ? "is-good" : "";
      dot.style.background = sc.tone === "late" ? "var(--late)" : "var(--good)";
      if (reduce) { draw(to); return; }
      (function tick(now) { const k = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - k, 3); draw(lerp(from, to, e)); if (k < 1) raf(tick); })(t0);
    };
    apply(0);
    let timer = 0, onscreen = false;
    const loop = () => { clearTimeout(timer); if (!onscreen || reduce) return; timer = later(() => { si = (si + 1) % SC.length; apply(si); loop(); }, 2800); };
    IO(([e]) => { onscreen = e.isIntersecting; if (onscreen && to) draw(to); loop(); }).observe(box);
    addEventListener("resize", () => to && draw(to));
  })();

  // Site Watch: rain on the pour day is flagged, then the PM approves and the pour moves to Wednesday
  (() => {
    const wx = $("wx"); if (!wx) return;
    const wed = wx.querySelector('[data-d="wed"]'), thu = wx.querySelector('[data-d="thu"]');
    const chip = $("wxchip"), m = $("wxmsg"), q = $("wxq"), btn = $("wxbtn");
    const flag = () => { thu.classList.add("has-pour"); wed.classList.remove("has-pour", "is-good"); chip.className = "chip chip--late"; chip.textContent = "Critical path"; m.textContent = "Level 12 pour on Thursday, rain forecast"; q.textContent = "Move the pour to Wednesday?"; btn.textContent = "Approve"; btn.classList.remove("is-done"); };
    const ok = () => { thu.classList.remove("has-pour"); wed.classList.add("has-pour", "is-good"); chip.className = "chip"; chip.textContent = "Approved by PM"; m.textContent = "Level 12 pour moved to Wednesday, ahead of the rain"; q.textContent = "Trades and the pump crew notified"; btn.textContent = "Approved"; btn.classList.add("is-done"); };
    flag(); let on = false, t = 0, st = 0;
    const loop = () => { clearTimeout(t); if (!on || reduce) return; t = later(() => { st ^= 1; st ? ok() : flag(); loop(); }, 3200); };
    IO(([e]) => { on = e.isIntersecting; loop(); }).observe(wx);
  })();

  // Check work: the field lead checks, the PM signs off or sends it back, and the fix comes round again
  (() => {
    const cw = $("cw"); if (!cw) return;
    const ROWS = ["Framing, level 11", "Glazing, level 10", "Electrical rough in, level 9", "Drywall, level 8"];
    const TXT = { wait: "Waiting", lead: "Checked by field lead", ok: "Signed off by PM", rej: "Sent back" };
    const ic = '<span class="cw__ic"><svg class="i-ok" viewBox="0 0 12 12"><path d="M2.5 6.4l2.3 2.3 4.7-5"/></svg><svg class="i-x" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6"/></svg></span>';
    const els = ROWS.map((n) => { const r = document.createElement("div"); r.className = "cw__row"; r.innerHTML = ic + `<b>${n}</b><em></em>`; cw.appendChild(r); return r; });
    const sum = $("cwsum");
    const set = (i, st, note) => { const r = els[i]; r.dataset.s = st; r.querySelector("em").textContent = note || TXT[st]; r.classList.add("is-pop"); later(() => r.classList.remove("is-pop"), 380);
      const ok = els.filter((e) => e.dataset.s === "ok").length, rej = els.filter((e) => e.dataset.s === "rej").length; sum.textContent = `${ok} signed off · ${rej} sent back`; };
    const START = [["lead"], ["lead"], ["wait"], ["wait"]];
    const STEPS = [
      [0, "ok"], [1, "rej", "Sent back · sealant gaps"], [2, "lead"], [2, "ok"], [3, "lead"],
      [1, "lead", "Fixed · checked again"], [3, "rej", "Sent back · missing fire caulk"], [1, "ok"],
    ];
    const reset = () => START.forEach(([st], i) => set(i, st));
    reset(); let k = 0, on = false, t = 0;
    const loop = () => { clearTimeout(t); if (!on || reduce) return; t = later(() => {
      if (k >= STEPS.length) { k = 0; reset(); } else { const [i, st, n] = STEPS[k++]; set(i, st, n); } loop(); }, k >= STEPS.length ? 2600 : 1500); };
    if (reduce) { STEPS.forEach(([i, st, n]) => set(i, st, n)); }
    IO(([e]) => { on = e.isIntersecting; loop(); }).observe(cw);
  })();

  // the live data network: a market from the list below moves up and joins the network, then the loop starts again
  (() => {
    const top = $("growtop"), bot = $("growbot"); if (!top || !bot) return;
    const joined = [];
    const flip = (el, to, before) => {
      const a = el.getBoundingClientRect(); before && before(); to.appendChild(el); const b = el.getBoundingClientRect();
      el.style.transition = "none"; el.style.transform = `translate(${a.left - b.left}px, ${a.top - b.top}px)`;
      el.getBoundingClientRect(); el.style.transition = "transform .9s cubic-bezier(.23,1,.32,1), background-color .4s, box-shadow .4s, color .4s"; el.style.transform = "";
    };
    const step = () => {
      if (joined.length >= 4) { // reset: the joined markets fade out and go back to the list
        joined.forEach((el) => el.classList.add("is-leaving"));
        later(() => { joined.splice(0).forEach((el) => { el.classList.remove("is-leaving", "is-joined"); el.style.transition = "none"; bot.appendChild(el); }); }, 600);
        return;
      }
      const el = bot.querySelector("span.is-next:not(.is-joined)"); if (!el) return;
      flip(el, top, () => el.classList.add("is-joined")); joined.push(el);
    };
    let on = false, t = 0;
    const loop = () => { clearTimeout(t); if (!on || reduce) return; t = later(() => { step(); loop(); }, 2200); };
    IO(([e]) => { on = e.isIntersecting; loop(); }).observe(top);
  })();

  /* ---------- the live 3D building: a 22-storey tower under construction, physically lit */
  const scene3 = $("scene"), cv = $("bldg");
  if (!THREE) { scene3.insertAdjacentHTML("beforeend", '<div class="scene__fallback">The 3D building could not load here.</div>'); return; }
  const T = THREE;
  let renderer;
  try { renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); }
  catch (e) { scene3.insertAdjacentHTML("beforeend", '<div class="scene__fallback">This device can\'t show the 3D building.</div>'); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); gl.push(renderer);
  dayDriven = !reduce;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.physicallyCorrectLights = true;
  const scene = new T.Scene();
  const cam = new T.PerspectiveCamera(30, 1, 0.5, 600);
  const C = (hex) => new T.Color(hex).convertSRGBToLinear();

  // ---------- canvas textures (no image files)
  const canvasTex = (w, h, draw, repeat) => {
    const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h);
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4;
    if (repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
    return t;
  };
  const noise = (g, w, h, base, amp, n = 5000) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) { const a = Math.random() * amp; g.fillStyle = `rgba(0,0,0,${a})`; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); }
  };
  const concreteTex = canvasTex(256, 256, (g, w, h) => noise(g, w, h, "#c9c5bd", .06, 9000), [2, 2]);
  const padTex = canvasTex(512, 512, (g, w, h) => {
    noise(g, w, h, "#b9b4aa", .05, 16000);
    g.strokeStyle = "rgba(0,0,0,.08)"; g.lineWidth = 2;
    for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * w / 8, 0); g.lineTo(i * w / 8, h); g.stroke(); g.beginPath(); g.moveTo(0, i * h / 8); g.lineTo(w, i * h / 8); g.stroke(); }
  }, [1, 1]);
  const facadeTex = canvasTex(256, 512, (g, w, h) => { // neighbours: punched windows
    g.fillStyle = "#d8d3ca"; g.fillRect(0, 0, w, h);
    for (let y = 18; y < h; y += 42) for (let x = 14; x < w; x += 40) { g.fillStyle = Math.random() < .15 ? "#8c97a6" : "#5d6672"; g.fillRect(x, y, 24, 26); }
  }, [1, 1]);
  const MULL = 1.6; // mullion spacing (m)
  const glassTex = canvasTex(128, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5d7088"); gr.addColorStop(1, "#3c4c60");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = "#c9ccd0"; g.fillRect(0, 0, 6, h); // mullion
    g.fillStyle = "rgba(201,204,208,.7)"; g.fillRect(0, h * .5 - 1, w, 2); // transom
  });
  const litTex = canvasTex(256, 32, (g, w, h) => {
    g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
    const n = 16; for (let i = 0; i < n; i++) if (Math.random() < .3) { g.fillStyle = `rgba(255,${200 + Math.random() * 40},${140 + Math.random() * 40},1)`; g.fillRect(i * w / n + 2, 3, w / n - 4, h - 6); }
  });
  const netTex = canvasTex(64, 64, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = "rgba(40,44,50,.55)"; g.lineWidth = 1; for (let i = 0; i < w; i += 6) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); } }, [24, 3]);

  // ---------- environment: a soft sky dome so glass and metal reflect something real
  const pmrem = new T.PMREMGenerator(renderer);
  const ENV_SKIES = {
    day: ["#9fb8d6", "#eef1f3", "#cfc9bf", "#8f8a82"],
    gold: ["#5b6c95", "#f3b27e", "#a88a70", "#5a4c42"],
    night: ["#0f1626", "#2a3046", "#24221f", "#121110"],
  };
  const envFor = (mode) => {
    const s = new T.Scene(), c = ENV_SKIES[mode];
    const sky = canvasTex(16, 256, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, c[0]); gr.addColorStop(.46, c[1]); gr.addColorStop(.52, c[2]); gr.addColorStop(1, c[3]);
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    });
    s.add(new T.Mesh(new T.SphereGeometry(50, 32, 16), new T.MeshBasicMaterial({ map: sky, side: T.BackSide })));
    const env = pmrem.fromScene(s, 0.02).texture; return env;
  };

  // ---------- lights
  const hemi = new T.HemisphereLight(0xe8eef6, 0x8a847a, 1.2); scene.add(hemi);
  const sun = new T.DirectionalLight(0xfff1dc, 3.2);
  sun.position.set(30, 46, 22); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 44, bottom: -8, near: 1, far: 140 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; scene.add(sun);

  // ---------- materials
  const M = {
    ground: new T.MeshStandardMaterial({ color: C("#cbc6bc"), roughness: 1 }),
    pad: new T.MeshStandardMaterial({ map: padTex, roughness: .95 }),
    concrete: new T.MeshStandardMaterial({ map: concreteTex, color: C("#e4e0d8"), roughness: .9 }),
    glass: new T.MeshStandardMaterial({ map: glassTex, metalness: .85, roughness: .07, envMapIntensity: 1.4, emissive: new T.Color(0xffffff), emissiveIntensity: 0 }),
    spandrel: new T.MeshStandardMaterial({ color: C("#3a3d42"), metalness: .6, roughness: .35, envMapIntensity: .9 }),
    alu: new T.MeshStandardMaterial({ color: C("#b9bcc0"), metalness: .85, roughness: .3, envMapIntensity: 1 }),
    form: new T.MeshStandardMaterial({ color: C("#b7894f"), roughness: .8 }),
    net: new T.MeshStandardMaterial({ map: netTex, transparent: true, side: T.DoubleSide, roughness: 1, depthWrite: false }),
    rebar: new T.MeshStandardMaterial({ color: C("#6b4a34"), roughness: .7, metalness: .4 }),
    crane: new T.MeshStandardMaterial({ color: C("#c49a3a"), roughness: .55, metalness: .35, envMapIntensity: .8 }),
    steel: new T.MeshStandardMaterial({ color: C("#7b8088"), roughness: .45, metalness: .7 }),
    neighbour: new T.MeshStandardMaterial({ map: facadeTex, roughness: .85 }),
    roofN: new T.MeshStandardMaterial({ color: C("#bdb8ae"), roughness: .95 }),
    fence: new T.MeshStandardMaterial({ color: C("#4a5056"), roughness: .6, metalness: .3 }),
    lit: new T.MeshStandardMaterial({ color: C("#ffd9a0"), emissive: C("#ffcf8a"), emissiveIntensity: 0, roughness: .6 }),
    accent: new T.MeshStandardMaterial({ color: C("#2445D4"), emissive: C("#2445D4"), emissiveIntensity: 1.2, roughness: .4 }),
    late: new T.MeshStandardMaterial({ color: C("#B4441C"), emissive: C("#B4441C"), emissiveIntensity: .9, roughness: .5 }),
    ghost: new T.LineBasicMaterial({ color: C("#2445D4"), transparent: true, opacity: .22 }),
  };
  const mesh = (geo, m, cast = true, receive = true) => { const o = new T.Mesh(geo, m); o.castShadow = cast; o.receiveShadow = receive; return o; };
  const box = (w, h, d, m, cast, receive) => mesh(new T.BoxGeometry(w, h, d), m, cast, receive);
  const beam = (a, b, r, m) => { // a thin member between two points
    const dir = new T.Vector3().subVectors(b, a), len = dir.length();
    const o = mesh(new T.BoxGeometry(r, len, r), m, true, false);
    o.position.copy(a).addScaledVector(dir, .5); o.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize()); return o;
  };

  const neighbourMats = [];
  // ---------- site
  // the ground is a soft island that fades into the page
  M.ground.transparent = true; M.ground.depthWrite = false;
  M.ground.alphaMap = canvasTex(256, 256, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, "#fff"); gr.addColorStop(.62, "#fff"); gr.addColorStop(1, "#000"); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const ground = mesh(new T.CircleGeometry(34, 64), M.ground, false, true); ground.rotation.x = -Math.PI / 2; ground.renderOrder = -1; scene.add(ground);
  const pad = box(30, .25, 24, M.pad, false, true); pad.position.y = .12; scene.add(pad);
  // fence with gate
  const fenceRing = [[-15, -12, 15, -12], [15, -12, 15, 12], [15, 12, 3, 12], [-3, 12, -15, 12], [-15, 12, -15, -12]];
  for (const [x1, z1, x2, z2] of fenceRing) {
    const len = Math.hypot(x2 - x1, z2 - z1), f = box(len, 1.8, .06, M.fence, true, false);
    f.position.set((x1 + x2) / 2, 1.0, (z1 + z2) / 2); f.rotation.y = -Math.atan2(z2 - z1, x2 - x1); f.material = M.fence; scene.add(f);
  }
  // site cabins and material stacks
  [[-11, 9, 4.5, 2.6, 2.4], [-11, 5.8, 4.5, 2.6, 2.4]].forEach(([x, z, w, h, d]) => { const c = box(w, h, d, M.alu); c.position.set(x, h / 2 + .25, z); scene.add(c); });
  [[9, 8], [11, 6.5], [-12, -8]].forEach(([x, z]) => { const s = box(2.2, .5, 1.2, M.form); s.position.set(x, .5, z); scene.add(s); const s2 = box(2.2, .5, 1.2, M.form); s2.position.set(x, 1.0, z); scene.add(s2); });
  // neighbours, with windows
  [[-20, 9, -19, 9, 8], [19, 13, -20, 9, 8]].forEach(([x, h, z, w, d]) => {
    const n = new T.Mesh(new T.BoxGeometry(w, h, d), [M.neighbour, M.neighbour, M.roofN, M.roofN, M.neighbour, M.neighbour]);
    n.castShadow = n.receiveShadow = true; n.position.set(x, h / 2, z); scene.add(n);
    n.material = n.material.map((m) => { if (m !== M.neighbour) return m; const mm = m.clone(); neighbourMats.push(mm); mm.map = facadeTex.clone(); mm.map.needsUpdate = true; mm.map.repeat.set(w / 8, h / 10); mm.map.wrapS = mm.map.wrapT = T.RepeatWrapping; return mm; });
  });

  // ---------- the tower
  const FLOORS = 22, FH = 1.3, W = 11, D = 8;
  const bldg = new T.Group(); bldg.position.y = .25; scene.add(bldg);
  const floorsG = [], glassMats = [];
  // each face gets the glass with mullions every MULL metres, and its own pattern of lit rooms for dusk
  const glassMat = (len) => {
    const m = M.glass.clone();
    m.map = glassTex.clone(); m.map.needsUpdate = true; m.map.wrapS = m.map.wrapT = T.RepeatWrapping; m.map.repeat.set(Math.round(len / MULL), 1);
    glassMats.push(m); return m;
  };
  for (let f = 0; f < FLOORS; f++) {
    const g = new T.Group(); g.position.y = f * FH; bldg.add(g); floorsG.push(g);
    const u = { frame: [], skin: [], top: [], lit: [] };
    const slab = box(W + .4, .26, D + .4, M.concrete); slab.position.y = .13; g.add(slab); u.frame.push(slab);
    const core = box(3, FH, 2.4, M.concrete); core.position.y = FH / 2; g.add(core); u.frame.push(core);
    const colsX = [-W / 2, -W / 6, W / 6, W / 2], colsZ = [-D / 2, D / 2];
    for (const x of colsX) for (const z of colsZ) { const c = box(.38, FH, .38, M.concrete); c.position.set(x * .97, FH / 2, z * .96); g.add(c); u.frame.push(c); }
    // facade: spandrel band at the slab, glass above, aluminium fins
    const faces = [[0, D / 2 + .21, W + .4, 0], [0, -D / 2 - .21, W + .4, Math.PI], [W / 2 + .21, 0, D + .4, Math.PI / 2], [-W / 2 - .21, 0, D + .4, -Math.PI / 2]];
    for (const [x, z, len, ry] of faces) {
      const face = new T.Group(); face.position.set(x, 0, z); face.rotation.y = ry; g.add(face);
      const sp = mesh(new T.PlaneGeometry(len, .42), M.spandrel, false, true); sp.position.y = .21; face.add(sp); u.skin.push(sp);
      const gm = glassMat(len, f * 4 + faces.indexOf(faces.find((q) => q[3] === ry)));
      const gl = mesh(new T.PlaneGeometry(len, FH - .42), gm, false, true); gl.position.set(0, .42 + (FH - .42) / 2, -.02); face.add(gl); u.skin.push(gl);
      // a few rooms lit at dusk
      const n = Math.round(len / MULL);
      for (let i = 0; i < n; i++) if (Math.random() < .22) { const l = mesh(new T.PlaneGeometry(len / n - .14, FH - .62), M.lit, false, false); l.position.set(-len / 2 + (len / n) * (i + .5), .42 + (FH - .42) / 2, .005); face.add(l); u.lit.push(l); }
    }
    // the working floor: formwork edge, rebar starts and safety net
    g.userData = u;
  }
  // the working floor: formwork boards, rebar starts and a safety net, moved up as the tower rises
  const kit = new T.Group(); bldg.add(kit);
  [[0, D / 2 + .3, W + .8, 0], [0, -D / 2 - .3, W + .8, 0], [W / 2 + .3, 0, D + .8, Math.PI / 2], [-W / 2 - .3, 0, D + .8, Math.PI / 2]].forEach(([x, z, l, ry]) => {
    const b = box(l, .45, .08, M.form); b.position.set(x, FH + .2, z); b.rotation.y = ry; kit.add(b);
  });
  for (let i = 0; i < 24; i++) { const rb = box(.05, .9, .05, M.rebar, false, false); const side = i % 4; const t = (Math.floor(i / 4) / 5) - .5;
    rb.position.set(side < 2 ? t * W : (side === 2 ? -1 : 1) * W / 2 * .97, FH + .5, side < 2 ? (side === 0 ? -1 : 1) * D / 2 * .96 : t * D); kit.add(rb); }
  const net = mesh(new T.CylinderGeometry(1, 1, FH * 2, 4, 1, true), M.net, false, false);
  net.scale.set((W + 1.2) / Math.SQRT2, 1, (D + 1.2) / Math.SQRT2); net.rotation.y = Math.PI / 4; net.position.y = FH * .2; kit.add(net);
  // planned floors: a quiet outline, not a solid
  const ghost = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(W + .4, FLOORS * FH, D + .4)), M.ghost);
  ghost.position.y = .25 + FLOORS * FH / 2; scene.add(ghost);
  // where work is now, and the late item
  const nowLine = new T.Group(); scene.add(nowLine);
  [[0, D / 2 + .3, W + .6, 0], [0, -D / 2 - .3, W + .6, 0], [W / 2 + .3, 0, D + .6, Math.PI / 2], [-W / 2 - .3, 0, D + .6, Math.PI / 2]].forEach(([x, z, l, ry]) => {
    const s = box(l, .06, .06, M.accent, false, false); s.position.set(x, 0, z); s.rotation.y = ry; nowLine.add(s);
  });
  const lateMark = box(.5, .5, .5, M.late, false, false); scene.add(lateMark);

  // ---------- material hoist on the south face
  const hoist = new T.Group(); hoist.position.set(-W / 4, .25, D / 2 + 1.2); scene.add(hoist);
  const hoistH = 20 * FH;
  [-.5, .5].forEach((x) => hoist.add(beam(new T.Vector3(x, 0, 0), new T.Vector3(x, hoistH, 0), .12, M.steel)));
  const cage = box(1.6, 2, 1.4, M.steel); cage.position.set(0, 1, .9); hoist.add(cage);

  // ---------- tower crane: lattice mast and jib
  const crane = new T.Group(); crane.position.set(W / 2 + 4, .25, -D / 2 - 2); scene.add(crane);
  const mastH = FLOORS * FH + 7, s = .9;
  const corners = [[-s, -s], [s, -s], [s, s], [-s, s]];
  corners.forEach(([x, z]) => crane.add(beam(new T.Vector3(x, 0, z), new T.Vector3(x, mastH, z), .14, M.crane)));
  for (let y = 0; y < mastH - 1.5; y += 2.4) for (let k = 0; k < 4; k++) {
    const [x1, z1] = corners[k], [x2, z2] = corners[(k + 1) % 4];
    crane.add(beam(new T.Vector3(x1, y, z1), new T.Vector3(x2, y + 2.4, z2), .07, M.crane));
    crane.add(beam(new T.Vector3(x1, y, z1), new T.Vector3(x2, y, z2), .07, M.crane));
  }
  const slew = new T.Group(); slew.position.y = mastH; crane.add(slew);
  const jibL = 20, cj = 7, jh = 1.1;
  const jibPts = (x) => [new T.Vector3(x, 0, -.55), new T.Vector3(x, 0, .55), new T.Vector3(x, jh, 0)];
  for (const [a, b] of [[0, -jibL], [0, cj]]) { const A = jibPts(a), B = jibPts(b); for (let i = 0; i < 3; i++) slew.add(beam(A[i], B[i], .12, M.crane)); }
  for (let x = -jibL; x < cj; x += 2) { const A = jibPts(x), B = jibPts(x + 2); slew.add(beam(A[0], B[2], .06, M.crane)); slew.add(beam(A[1], B[2], .06, M.crane)); slew.add(beam(A[0], A[1], .06, M.crane)); }
  const apex = new T.Vector3(0, 5.2, 0);
  slew.add(beam(new T.Vector3(0, 0, 0), apex, .2, M.crane));
  slew.add(beam(apex, new T.Vector3(-jibL * .6, jh, 0), .05, M.steel));
  slew.add(beam(apex, new T.Vector3(cj, jh, 0), .05, M.steel));
  const cw = box(2, 1.6, 1.4, M.concrete); cw.position.set(cj - .8, -.4, 0); slew.add(cw);
  const cab = box(1.2, 1.2, 1.1, M.alu); cab.position.set(1, -.7, .9); slew.add(cab);
  const trolley = new T.Group(); slew.add(trolley);
  const cable = beam(new T.Vector3(0, 0, 0), new T.Vector3(0, -1, 0), .03, M.steel); trolley.add(cable);
  const load = new T.Group(); trolley.add(load);
  for (let i = 0; i < 6; i++) { const r = box(3, .14, .14, M.rebar); r.position.set(0, 0, -.4 + i * .16); load.add(r); }

  // ---------- the live twin: every part drawn as blue lines, with data rising through it
  let twin = 0;
  scene.updateMatrixWorld(true);
  const wireMat = new T.LineBasicMaterial({ color: C("#6F8CF0"), transparent: true, opacity: 0, depthWrite: false });
  const edgeCache = new Map();
  const edgesOf = (geo) => { if (!edgeCache.has(geo.uuid)) edgeCache.set(geo.uuid, new T.EdgesGeometry(geo, 25)); return edgeCache.get(geo.uuid); };
  const wireParts = [];
  const wireFor = (root, stops = []) => {
    const inv = new T.Matrix4().copy(root.matrixWorld).invert(), pts = [], m = new T.Matrix4(), p = new T.Vector3();
    const walk = (o) => {
      for (const c of o.children) {
        if (stops.includes(c)) continue;
        if (c.isMesh && c.material !== M.lit && c.material !== M.net && c !== ground) {
          const e = edgesOf(c.geometry).attributes.position; m.multiplyMatrices(inv, c.matrixWorld);
          for (let i = 0; i < e.count; i++) { p.fromBufferAttribute(e, i).applyMatrix4(m); pts.push(p.x, p.y, p.z); }
        }
        if (!c.isMesh) walk(c);
      }
    };
    walk(root);
    if (!pts.length) return;
    const g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(pts, 3));
    const ls = new T.LineSegments(g, wireMat); ls.renderOrder = 2; root.add(ls); wireParts.push(ls);
  };
  floorsG.forEach((g) => wireFor(g));
  wireFor(kit); wireFor(hoist); wireFor(crane, [slew]); wireFor(slew, [trolley]); wireFor(trolley);
  wireFor(scene, [bldg, kit, hoist, crane, nowLine, ghost]);
  // every solid fades out; the blue now line and the late marker stay as the only solids
  const solids = new Set();
  scene.traverse((o) => { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach((mm) => { if (mm !== M.accent && mm !== M.late) solids.add(mm); }); });
  solids.forEach((mm) => { mm.userData.op = mm.opacity; mm.userData.tr = mm.transparent; mm.userData.dw = mm.depthWrite; });
  // data rising through the tower
  const NP = 520, pp = new Float32Array(NP * 3), pv = new Float32Array(NP);
  for (let i = 0; i < NP; i++) { pp[i * 3] = (Math.random() - .5) * (W + 10); pp[i * 3 + 1] = Math.random() * FLOORS * FH * 1.2; pp[i * 3 + 2] = (Math.random() - .5) * (D + 10); pv[i] = .6 + Math.random() * 2.2; }
  const pgeo = new T.BufferGeometry(); pgeo.setAttribute("position", new T.BufferAttribute(pp, 3));
  const pmat = new T.PointsMaterial({ color: C("#9DB1FA"), size: .22, transparent: true, opacity: 0, depthWrite: false });
  const points = new T.Points(pgeo, pmat); points.position.y = .25; points.visible = false; scene.add(points);
  // a scan line sweeps down the site: above it only the twin remains
  renderer.localClippingEnabled = true;
  const SCAN_TOP = mastH + 8, clip = new T.Plane(new T.Vector3(0, -1, 0), SCAN_TOP + 5);
  solids.forEach((mm) => { mm.clippingPlanes = [clip]; });
  const scan = new T.Group(); scene.add(scan); scan.visible = false;
  const scanFill = new T.Mesh(new T.PlaneGeometry(40, 34), new T.MeshBasicMaterial({ color: C("#5B7BF0"), transparent: true, opacity: .10, depthWrite: false, side: T.DoubleSide }));
  scanFill.rotation.x = -Math.PI / 2; scan.add(scanFill);
  const scanEdge = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(40, 34)), new T.LineBasicMaterial({ color: C("#9DB1FA"), transparent: true, opacity: .9 }));
  scanEdge.rotation.x = -Math.PI / 2; scan.add(scanEdge);
  let twinT = 0, orbit = 0, orbitT = 0;
  // sparkles: where the scan line passes, the real building breaks into shimmering specks
  const NS = 1600, sp = new Float32Array(NS * 3), sl = new Float32Array(NS), sc = new Float32Array(NS * 3);
  const sprite = canvasTex(64, 64, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.25, "rgba(220,228,255,.9)"); gr.addColorStop(1, "rgba(157,177,250,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.9)"; g.fillRect(w / 2 - .5, 6, 1, h - 12); g.fillRect(6, h / 2 - .5, w - 12, 1); });
  const sgeo = new T.BufferGeometry(); sgeo.setAttribute("position", new T.BufferAttribute(sp, 3)); sgeo.setAttribute("color", new T.BufferAttribute(sc, 3));
  const smat = new T.PointsMaterial({ size: 1.35, map: sprite, vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending });
  const spark = new T.Points(sgeo, smat); spark.visible = false; spark.frustumCulled = false; scene.add(spark);
  let sparkH = 99;
  const cranePos = crane.position;
  const seed = (i) => {
    const r = Math.random(); let x, z;
    if (r < .62 && sparkH < .25 + (level + 1) * FH + 1) { const side = Math.floor(Math.random() * 4), t = Math.random() - .5; x = side < 2 ? t * (W + .4) : (side === 2 ? -1 : 1) * (W / 2 + .2); z = side < 2 ? (side ? 1 : -1) * (D / 2 + .2) : t * (D + .4); }
    else if (r < .8) { x = cranePos.x + (Math.random() - .5) * 2; z = cranePos.z + (Math.random() - .5) * 2; }
    else { x = (Math.random() - .5) * 32; z = (Math.random() - .5) * 26; }
    sp[i * 3] = x; sp[i * 3 + 1] = sparkH + (Math.random() - .25) * 1.1; sp[i * 3 + 2] = z; sl[i] = Math.random();
  };
  let seeded = false;
  const tickSpark = (dt) => {
    if (!seeded) { seeded = true; for (let i = 0; i < NS; i++) seed(i); }
    for (let i = 0; i < NS; i++) {
      sl[i] += dt * (.5 + (i % 7) * .12);
      if (sl[i] > 1) seed(i); else { sp[i * 3 + 1] += dt * (.6 + (i % 5) * .3); sp[i * 3] += Math.sin(i + sl[i] * 9) * dt * .4; }
      const tw = Math.max(0, Math.sin(sl[i] * Math.PI)) * (.55 + .45 * Math.sin(i * 12.9 + sl[i] * 40)); // twinkle
      const b = i % 3 === 0 ? 1 : .62; sc[i * 3] = tw * b; sc[i * 3 + 1] = tw * (b * .85 + .1); sc[i * 3 + 2] = tw;
    }
    sgeo.attributes.position.needsUpdate = true; sgeo.attributes.color.needsUpdate = true;
  };
  let twinSet = -1;
  const applyTwin = (dt) => {
    const k = Math.round(twin * 100) / 100;
    if (k !== twinSet) {
      twinSet = k;
      wireMat.opacity = .75 * smooth(.02, .35, k);
      const h = SCAN_TOP + 5 - (SCAN_TOP + 7) * smooth(.05, .9, k); clip.constant = h;
      scan.visible = false; sparkH = h; spark.visible = k > .03 && k < .97; smat.opacity = smooth(.03, .1, k) * (1 - smooth(.88, .97, k));
      solids.forEach((mm) => { const f = mm === M.ground ? 1 - smooth(.1, .45, k) : 1 - smooth(.88, 1, k); mm.transparent = mm.userData.tr || f < .999; mm.opacity = mm.userData.op * f; mm.visible = f > .01; mm.depthWrite = f > .5 ? mm.userData.dw : false; });
      pmat.opacity = .9 * smooth(.3, .95, k); points.visible = k > .25;
      M.ghost.opacity = .22 + .4 * k;
    }
    if (spark.visible && dt) tickSpark(dt);
    if (points.visible && dt) {
      const a = pgeo.attributes.position;
      for (let i = 0; i < NP; i++) { let y = a.array[i * 3 + 1] + pv[i] * dt; if (y > FLOORS * FH * 1.2) y = 0; a.array[i * 3 + 1] = y; }
      a.needsUpdate = true;
    }
  };

  let dusk = false;
  // ---------- progress: floors below `level` are finished; `level` is being framed
  let level = 13;
  const tagNow = $("tag-now"), tagLate = $("tag-late"), tagDone = $("tag-done");
  const applyLevel = () => {
    floorsG.forEach((g, f) => {
      const u = g.userData;
      g.visible = f <= level;
      u.skin.forEach((m) => (m.visible = f < level - 1));
      u.lit.forEach((m) => (m.visible = dusk && f < level - 1));
    });
    kit.position.y = level * FH;
    nowLine.position.y = .25 + (level + 1) * FH + .4;
    lateMark.position.set(-W / 2 - .25, .25 + (level - 1) * FH + .7, D / 2 + .25);
    const pct = Math.round(((level - 1) / FLOORS) * 1000) / 10;
    $("bar").style.width = pct + "%"; $("pct").textContent = pct.toFixed(1) + "%";
    $("tag-now-t").textContent = `Floor ${level + 1} · framing`;
    tagDone.querySelector(".good").textContent = `Floor ${level - 1} signed off`;
  };

  // ---------- camera: a slow turn, follows the pointer, drag to turn
  let yaw = -.62, tYaw = -.62, pitch = .26, tPitch = .26, drag = null, auto = 0, hover = false;
  const R = 92, target = new T.Vector3(2, 15, 0);
  const sizeIt = () => {
    const r = scene3.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    cam.aspect = r.width / r.height; cam.fov = cam.aspect < .75 ? 50 : 30;
    const sx = cam.aspect > 1.1 ? -.17 * r.width : 0, sy = cam.aspect <= 1.1 ? .27 * r.height : 0;
    cam.setViewOffset(r.width, r.height, sx, sy, r.width, r.height); cam.updateProjectionMatrix();
  };
  RO(sizeIt).observe(scene3); sizeIt();
  cv.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY, yaw: tYaw, pitch: tPitch }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", (e) => {
    if (drag) { tYaw = drag.yaw - (e.clientX - drag.x) * .008; tPitch = Math.max(.06, Math.min(.65, drag.pitch + (e.clientY - drag.y) * .004)); return; }
    if (e.pointerType !== "mouse") return;
    const r = cv.getBoundingClientRect(); hover = true;
    tYaw = -.62 + ((e.clientX - r.left) / r.width - .5) * .6; tPitch = .26 + ((e.clientY - r.top) / r.height - .5) * .14;
  });
  const endDrag = () => { drag = null; };
  cv.addEventListener("pointerup", endDrag); cv.addEventListener("pointercancel", endDrag);
  cv.addEventListener("pointerleave", () => { hover = false; });

  const v = new T.Vector3();
  const place = (el, x, y, z) => {
    v.set(x, y, z).project(cam);
    const r = cv.getBoundingClientRect();
    const sx = (v.x * .5 + .5) * r.width, sy = (-v.y * .5 + .5) * r.height;
    el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -100%)`;
    el.style.opacity = v.z < 1 && sx > 60 && sx < r.width - 60 && sy > 90 && sy < r.height - 20 ? Math.max(0, 1 - twin * 2.2) : 0;
  };

  // ---------- the day: dawn to dusk to dawn in about 11 seconds; the crew raises a floor at 7 AM, 11 AM and 3 PM
  const DAY = 11000, LIGHT = .68;  // share of the loop that is daylight, so nights pass quickly
  const DAYS = BRIEFS.map((b) => b[0]);
  const hourAt = (p) => (p < LIGHT ? 6 + (p / LIGHT) * 12 : 18 + ((p - LIGHT) / (1 - LIGHT)) * 12) % 24;
  const SKY = [ // hour, top, horizon
    [0, "#0d1322", "#1c2132"], [4.8, "#141b2e", "#2c2a3a"], [6, "#56658a", "#efb088"], [7.5, "#94afd2", "#f1e6d8"],
    [12, "#8fb0d8", "#eef1f3"], [16.2, "#a3b9d6", "#f1e9de"], [18, "#4c5b84", "#ee9c6c"], [19.4, "#1a2240", "#463848"], [24, "#0d1322", "#1c2132"],
  ];
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const x = hex(a), y = hex(b); return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
  const skyAt = (h) => { let i = 0; while (SKY[i + 1][0] < h) i++; const [h0, t0, b0] = SKY[i], [h1, t1, b1] = SKY[i + 1], t = (h - h0) / (h1 - h0); return [mix(t0, t1, t), mix(b0, b1, t)]; };
  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const ENVS = { day: envFor("day"), gold: envFor("gold"), night: envFor("night") };
  const SUN_DAY = C("#fff1dc"), SUN_LOW = C("#ff9a52"), MOON = C("#9fb2ff"), HEMI_DAY = C("#e8eef6"), HEMI_NIGHT = C("#2c3858"), HEMI_GROUND_DAY = C("#8a847a"), HEMI_GROUND_NIGHT = C("#1c1a18");
  const fogCol = new T.Color(); scene.fog = new T.Fog(0xffffff, 120, 260);
  const clockD = $("clock-d"), clockT = $("clock-t"), sunIcon = $("sunicon");
  let simT = reduce ? 3 * DAY + .78 * DAY * LIGHT : .045 * DAY; // starts just before 7 AM on Monday (reduced motion: Thursday afternoon)
  let envMode = "", lastDay = -1, lastShift = -1, lastMin = -1;
  const lvlFor = (day, shift) => Math.min(FLOORS - 1, 8 + day * 3 + shift);
  const shiftAt = (h) => (h >= 15 || h < 6 ? 3 : h >= 11 ? 2 : h >= 7 ? 1 : 0); // floors raised so far today (the day runs dawn to dawn)
  const daylight = (hOver) => {
    const day = Math.floor(simT / DAY) % DAYS.length, p = (simT % DAY) / DAY, h = hOver ?? hourAt(p);
    // sun crosses east to west; below the horizon the moon takes over
    const a = Math.PI * (h - 6) / 12, e = Math.sin(a), up = smooth(-.02, .18, e), low = 1 - smooth(.05, .5, e);
    if (e > -0.02) { sun.position.set(Math.cos(a) * 62, 6 + Math.max(0, e) * 58, 26); sun.color.copy(SUN_DAY).lerp(SUN_LOW, low); sun.intensity = 3.4 * up; }
    if (up < .02) { sun.position.set(-24, 50, 34); sun.color.copy(MOON); sun.intensity = .95; }
    const dl = smooth(-.12, .3, e); // how much daylight there is
    hemi.intensity = .6 + .6 * dl; hemi.color.copy(HEMI_NIGHT).lerp(HEMI_DAY, dl); hemi.groundColor.copy(HEMI_GROUND_NIGHT).lerp(HEMI_GROUND_DAY, dl);
    renderer.toneMappingExposure = (1.15 - .15 * dl) * (1 - .45 * twin); // the real site dims as the twin takes over
    const mode = e > .3 ? "day" : e > -.06 ? "gold" : "night";
    if (mode !== envMode) { envMode = mode; scene.environment = ENVS[mode]; }
    M.glass.envMapIntensity = .5 + .9 * dl;
    const [top, lowc] = skyAt(h);
    const tTop = mix(top, "#0e1018", twin), tLow = mix(lowc, "#1C1B19", twin);
    scene3.style.setProperty("--sky-top", tTop); scene3.style.setProperty("--sky-low", tLow);
    scene.fog.color.copy(fogCol.set(tLow).convertSRGBToLinear());
    // rooms light up from early evening to first light
    const night = h >= 17.4 || h < 6.4;
    M.lit.emissiveIntensity = 1.2 * (1 - smooth(-.25, .12, e));
    if (hOver != null) { if (night !== dusk) { dusk = night; applyLevel(); } return; } // a fixed hour for the quote card: no clock, no briefing
    const shift = shiftAt(h), lv = lvlFor(day, shift);
    if (night !== dusk || lv !== level) { dusk = night; level = lv; applyLevel(); }
    // a new briefing lands each morning at 7
    if (day !== lastDay || shift !== lastShift) {
      if (dayDriven && shift >= 1 && (day !== lastDay || lastShift < 1)) showBrief(day, true);
      if (day !== lastDay) { lastDay = day; clockD.textContent = DAYS[day]; }
      lastShift = shift;
    }
    const mins = Math.floor(h * 60 / 10) * 10; // ten minute steps keep the clock readable
    if (mins !== lastMin) { lastMin = mins; const hh = Math.floor(mins / 60), mm = mins % 60; clockT.textContent = `${(hh % 12) || 12}:${String(mm).padStart(2, "0")} ${hh < 12 ? "AM" : "PM"}`; sunIcon.classList.toggle("is-night", up < .02); scene3.classList.toggle("is-night", up < .02); }
  };

  let visible = true, last = performance.now();
  IO(([e]) => { visible = e.isIntersecting; if (visible && !reduce) raf(frame); }).observe(scene3);
  function frame(now) {
    const step = Math.max(0, Math.min(250, now - last)), dt = Math.min(.05, step / 1000); last = now; // the day keeps real time even on slow devices
    if (!reduce) {
      if (!hover && !drag) { auto += dt * .045; tYaw = -.62 + Math.sin(auto) * .45; }
      if (twinT < .01) simT += step; // the day holds still while the scan runs
      daylight();
      slew.rotation.y = Math.sin(now / 2400) * .8 - .2;
      trolley.position.x = -8 - Math.sin(now / 1500) * 5;
      const drop = 4 + (Math.sin(now / 1100) * .5 + .5) * 6;
      cable.scale.y = drop; cable.position.y = -drop / 2; load.position.y = -drop;
      M.accent.emissiveIntensity = .9 + Math.sin(now / 520) * .35;
    }
    twin += (twinT - twin) * (reduce ? 1 : .07); orbit += (orbitT - orbit) * (reduce ? 1 : .05);
    applyTwin(reduce ? 0 : dt);
    yaw += (tYaw + orbit * 1.5 - yaw) * (reduce ? 1 : .05); pitch += (tPitch + orbit * .16 - pitch) * (reduce ? 1 : .05);
    const Rt = R - orbit * 34;
    const tgt = target.clone(); tgt.y += orbit * 4;
    cam.position.set(tgt.x + Math.sin(yaw) * Math.cos(pitch) * Rt, tgt.y + Math.sin(pitch) * Rt, Math.cos(yaw) * Math.cos(pitch) * Rt);
    cam.lookAt(tgt);
    renderer.render(scene, cam);
    place(tagNow, W / 2, .25 + (level + 1) * FH + .6, D / 2);
    place(tagLate, -W / 2, .25 + (level - 1) * FH + 1.3, D / 2);
    place(tagDone, W / 2, .25 + (level - 5) * FH, D / 2);
    if (visible && !reduce) raf(frame);
  }

  // ---------- the hero: scroll turns the building into its live twin and brings in the statement
  heroTwin = (v, o) => { twinT = v; orbitT = o; if (reduce) { twin = v; orbit = o; raf(frame); } };
  onScroll();

  // ---------- the quote card: the same tower, at golden hour, turning with the mouse
  (() => {
    const qbox = document.getElementById("quote3d"); if (!qbox) return;
    let r2;
    try { r2 = new T.WebGLRenderer({ canvas: qbox.querySelector("canvas"), antialias: true, alpha: true }); } catch (e) { return; }
    r2.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); gl.push(r2);
    r2.shadowMap.enabled = true; r2.shadowMap.type = T.PCFSoftShadowMap; r2.outputEncoding = T.sRGBEncoding;
    r2.toneMapping = T.ACESFilmicToneMapping; r2.physicallyCorrectLights = true; r2.localClippingEnabled = true;
    qbox.classList.add("is-live");
    const qc = new T.PerspectiveCamera(32, 1, .5, 600);
    const qsize = () => { const r = qbox.getBoundingClientRect(); r2.setSize(r.width, r.height, false); qc.aspect = r.width / r.height; qc.updateProjectionMatrix(); };
    RO(qsize).observe(qbox); qsize();
    let qy = -.9, qty = -.9, qp = .22, qtp = .22, qauto = 0, qhover = false, qon = false, qlast = performance.now();
    const card = qbox.closest(".quote__img");
    qbox.addEventListener("pointermove", (e) => {
      const r = qbox.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
      qhover = true; qty = -.9 + nx * 1.4; qtp = .22 + ny * .3;
      if (!reduce) card.style.transform = `perspective(1100px) rotateY(${nx * 6}deg) rotateX(${-ny * 5}deg)`;
    });
    qbox.addEventListener("pointerleave", () => { qhover = false; card.style.transform = ""; });
    const qframe = (now) => {
      const dt = Math.min(.05, (now - qlast) / 1000); qlast = now;
      if (!reduce) {
        if (!qhover) { qauto += dt * .25; qty = -.9 + Math.sin(qauto) * .5; }
        slew.rotation.y = Math.sin(now / 2400) * .8 - .2; trolley.position.x = -8 - Math.sin(now / 1500) * 5;
        const drop = 4 + (Math.sin(now / 1100) * .5 + .5) * 6; cable.scale.y = drop; cable.position.y = -drop / 2; load.position.y = -drop;
      }
      qy += (qty - qy) * (reduce ? 1 : .06); qp += (qtp - qp) * (reduce ? 1 : .06);
      // borrow the scene: real building, golden hour; the hero puts its own look back on its next frame
      const keepTwin = twin; twin = 0; twinSet = -1; applyTwin(0); daylight(16.9);
      const RR = 72, tg = new T.Vector3(0, 13, 0);
      qc.position.set(tg.x + Math.sin(qy) * Math.cos(qp) * RR, tg.y + Math.sin(qp) * RR, Math.cos(qy) * Math.cos(qp) * RR); qc.lookAt(tg);
      r2.toneMappingExposure = renderer.toneMappingExposure;
      r2.render(scene, qc);
      twin = keepTwin; twinSet = -1;
      if (qon && !reduce) raf(qframe);
    };
    IO(([e]) => { const was = qon; qon = e.isIntersecting; if (qon && !was) { qlast = performance.now(); raf(qframe); } }, { rootMargin: "100px" }).observe(qbox);
  })();

  // ---------- the page theme only sets the accent colours; light comes from the day above
  const repaint = () => {
    scene.background = null; // the sky gradient behind the canvas shows through
    M.accent.color = C(css("--blue")); M.accent.emissive = C(css("--blue")); M.ghost.color = C(css("--blue"));
    M.late.color = C(css("--late")); M.late.emissive = C(css("--late"));
    daylight(); applyLevel();
    if (reduce) raf(frame);
  };
  repaint();
  raf(frame);
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", repaint, { signal });
  MO(repaint).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });


  })();
  return cleanup;
}
