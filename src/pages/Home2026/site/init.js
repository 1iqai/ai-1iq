/* The 1iq.ai home page's behaviour (Nov 2026, drawing sheet version).
   init(root) wires everything up and returns a cleanup that stops every loop, listener and observer.
   The hero's high rise is drawn in CSS (no WebGL): the same drawing language as the stage model in the 1iQ app. */

const WEB3FORMS_KEY = "6d1a807a-d50b-4157-a797-bc78554ce667"; // same public key as the contact page

export function init(root) {
  let alive = true;
  const ctl = new AbortController(), signal = ctl.signal;
  const observers = [], timers = [];
  const IO = (cb, o) => { const x = new IntersectionObserver(cb, o); observers.push(x); return x; };
  const RO = (cb) => { const x = new ResizeObserver(cb); observers.push(x); return x; };
  const MO = (cb) => { const x = new MutationObserver(cb); observers.push(x); return x; };
  const raf = (f) => (alive ? requestAnimationFrame(f) : 0);
  const later = (f, ms) => setTimeout(() => alive && f(), ms);
  const every = (f, ms) => { const id = setInterval(() => alive && f(), ms); timers.push(id); return id; };
  const addEventListener = (type, fn, opts) => window.addEventListener(type, fn, { ...(opts && typeof opts === "object" ? opts : {}), signal });
  const cleanup = () => {
    alive = false; ctl.abort(); observers.forEach((o) => o.disconnect()); timers.forEach(clearInterval);
    document.body.classList.remove("s26-body");
  };
  document.body.classList.add("s26-body");
  (() => {

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- menu (the page is light from the top, so the banner is always its light version) */
  const banner = document.getElementById("banner"), menu = document.getElementById("menu"), drawer = document.getElementById("drawer");
  banner.classList.add("is-light");
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
  const wrapWords = (el) => { el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span> `).join(""); return [...el.querySelectorAll(".w")]; };
  const wordHeads = [...document.querySelectorAll(".words")].map((el) => [el, wrapWords(el)]);
  const gapItems = [...document.querySelectorAll(".gapitem")];
  const qimg = $("quoteimg");
  const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const onScroll = () => {
    const vh = innerHeight;
    story();
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
    } catch { note.textContent = "That didn't send. Please email admin@1iq.ai and we'll book it from there."; }
    btn.disabled = false;
  });

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

  /* ---------- the hero story: the tower turns, the level with the problem slides out, a line runs down the page
     to Decide now, and the decision draws in. Driven by the scroll between the top of the page and the panel. */
  const rig = $("rig"), f12 = $("f12"), ring = $("ring"), ftag = $("ftag"), leader = $("leader"), lpath = $("leaderpath"), ldot = $("leaderdot"), lend = $("leaderend"), dnp = $("dnp"), sway = $("sway"), scene = $("scene");
  const wide = () => innerWidth >= 1100;
  let lastP = -1;
  function story() {
    if (!rig || !dnp) return;
    const on = wide() && !reduce;
    const pr = dnp.getBoundingClientRect(), panelTop = pr.top + scrollY;
    root.classList.toggle("story-off", !on);
    if (!on) { if (lastP !== -2) { lastP = -2; rig.style.transform = ""; f12.style.transform = ""; ring.style.transform = ""; dnp.style.clipPath = ""; dnp.style.transform = ""; ftag.style.opacity = ""; } return; }
    // the tower's part happens while the hero is still on screen; the line then runs for the rest of the way down
    const y = scrollY, vh = innerHeight;
    const turn = sm(0, 340, y), out = sm(10, 210, y), line = sm(150, panelTop - vh * 0.62, y), show = sm(panelTop - vh * 0.85, panelTop - vh * 0.5, y);
    const pull = Math.round(170 * out);
    rig.style.transform = `rotateX(${70 - 4 * turn}deg) rotateZ(${-46 + 18 * turn}deg) translateZ(-120px)`;
    sway.classList.toggle("still", y > 12);
    f12.style.transform = `translate3d(${pull}px,0,246px)`;
    ring.style.transform = `translate3d(${pull}px,0,256px)`;
    const sc = scene.getBoundingClientRect(), fb = f12.getBoundingClientRect();
    ftag.style.left = Math.max(8, Math.min(sc.width - ftag.offsetWidth - 8, fb.left - sc.left + 8)) + "px";
    ftag.style.top = Math.max(44, fb.top - sc.top - ftag.offsetHeight - 10) + "px";
    ftag.style.opacity = out; ftag.style.transform = `translateY(${(1 - out) * 8}px)`;
    dnp.style.clipPath = `inset(0 0 ${(1 - show) * 100}% 0)`; dnp.style.transform = `translateY(${(1 - show) * 28}px)`;
    dnp.classList.toggle("is-landing", show > 0.2 && show < 1);
    // the line: from the floor's right corner, out to the gutter, down, and into the panel's header
    const host = root.getBoundingClientRect(), fr = f12.getBoundingClientRect();
    const sx = fr.right - host.left, sy = fr.top + fr.height / 2 - host.top;
    const px = pr.right - host.left, py = pr.top - host.top + 26 - (1 - show) * 28;
    const gx = Math.min(host.width - 12, px + 34);
    const len = Math.max(0, gx - sx) + Math.max(0, py - sy) + (gx - px);
    lpath.setAttribute("d", `M${sx.toFixed(1)} ${sy.toFixed(1)} H${gx.toFixed(1)} V${py.toFixed(1)} H${px.toFixed(1)}`);
    lpath.style.strokeDasharray = len; lpath.style.strokeDashoffset = len * (1 - line);
    leader.style.height = Math.ceil(py + 40) + "px";
    ldot.setAttribute("x", sx - 5); ldot.setAttribute("y", sy - 5); ldot.style.opacity = line > 0.02 ? 1 : 0;
    lend.setAttribute("x", px - 5); lend.setAttribute("y", py - 5); lend.style.opacity = line > 0.98 ? 1 : 0;
    lastP = y;
  }
  onScroll();

  /* ---------- Decide now: the buttons work, and each decision leaves a stamp */
  (() => {
    if (!dnp) return;
    const left = $("dnleft"), acts = $("dn1acts"), all = $("dnall"), rows = [...dnp.querySelectorAll(".dn-wait")], n2 = $("dn2num");
    let d1 = null, signed = false;
    const time = () => { try { return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date()); } catch { return ""; } };
    const paint = () => {
      const n = (d1 ? 0 : 1) + (signed ? 0 : rows.length);
      left.textContent = n ? `${n} to decide` : "All decided";
      acts.innerHTML = !d1
        ? '<button type="button" class="dbtn dbtn--pri" data-act="yes">Accept new dates</button><button type="button" class="dbtn" data-act="no">Keep dates</button>'
        : `<span class="dstamp${d1 === "no" ? " dstamp--kept" : ""}">${d1 === "yes" ? "Accepted · " + time() : "Kept as it is"}</span><button type="button" class="dlink" data-act="undo">Undo</button>`;
      rows.forEach((r) => { r.textContent = signed ? "Approved" : "Waiting"; r.classList.toggle("is-ok", signed); });
      all.hidden = signed; n2.classList.toggle("is-done", signed);
    };
    acts.addEventListener("click", (e) => { const a = e.target.closest("[data-act]"); if (!a) return; d1 = a.dataset.act === "undo" ? null : a.dataset.act; paint(); });
    all.addEventListener("click", () => { signed = true; paint(); });
    paint();
  })();


  })();
  return cleanup;
}
