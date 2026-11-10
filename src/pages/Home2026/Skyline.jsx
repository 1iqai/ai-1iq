import { useEffect, useRef } from "react";
import { useDark } from "./useDark";

/**
 * The sign-in pages' background: two 3D wireframe towers with tower cranes, one either side of the
 * card (16 floors on the left, a taller 26-floor tower on the right). They turn toward the mouse;
 * the pieces under the pointer come apart and rebuild when it moves on; floors at the pointer's
 * height light up royal blue, and the lower floors stay softly blue as work done.
 *
 * Quiet by design: it slows while someone is typing, turns slowly by itself on phones (no mouse), and
 * stands still for people who ask their computer for reduced motion. Decorative only (aria-hidden).
 */


const FH = 0.34;

function makeTower(floors, W, D, done, jib, at, yawOff) {
  const segs = [];
  const add = (a, b, kind, f) => segs.push([a[0], a[1], a[2], b[0], b[1], b[2], kind, f]);
  const xs = [-W / 2, -W / 6, W / 6, W / 2], zs = [-D / 2, 0, D / 2];
  for (let f = 0; f <= floors; f++) {
    const y = f * FH;
    for (const z of zs) add([-W / 2, y, z], [W / 2, y, z], "slab", f);
    for (const x of xs) add([x, y, -D / 2], [x, y, D / 2], "slab", f);
    if (f < floors) for (const x of xs) for (const z of zs) {
      if (z === 0 && x !== -W / 6 && x !== W / 6) continue;
      add([x, y, z], [x, y + FH, z], "col", f);
    }
  }
  for (let f = 0; f < floors; f += 2) for (const x of [-W / 2, W / 2]) {
    add([x, f * FH, -D / 2], [x, (f + 1) * FH, D / 2], "brace", f);
    add([x, f * FH, D / 2], [x, (f + 1) * FH, -D / 2], "brace", f);
  }
  // tower crane: the mast in floor-high sections (so it comes apart too), jib reaching away from the card
  const top = floors * FH, mx = jib * (W / 2 - 0.2), mz = -D / 2 + 0.2, mh = 0.9;
  for (const [cx, cz] of [[-0.07, -0.07], [0.07, 0.07], [-0.07, 0.07], [0.07, -0.07]])
    for (let y = 0; y < top + mh - 1e-6; y += FH) add([mx + cx, y, mz + cz], [mx + cx, Math.min(y + FH, top + mh), mz + cz], "crane", Math.min(floors, Math.floor(y / FH)));
  const far = mx + jib * 1.6, back = mx - jib * 0.55;
  add([far, top + mh, mz], [back, top + mh, mz], "crane", floors);
  add([far, top + mh, mz], [mx, top + mh + 0.35, mz], "crane", floors);
  add([back, top + mh, mz], [mx, top + mh + 0.35, mz], "crane", floors);
  add([mx + jib * 1.2, top + mh, mz], [mx + jib * 1.2, top + 0.25, mz], "hook", floors);
  // each piece's way out: away from the tower's middle, a little up or down, a little spin
  const parts = segs.map((s) => {
    const px = (s[0] + s[3]) / 2, py = (s[1] + s[4]) / 2, pz = (s[2] + s[5]) / 2;
    const l = Math.hypot(px, pz) || 1;
    return { mx: px, my: py, mz: pz, dx: px / l + (Math.random() - 0.5) * 0.7, dy: (Math.random() - 0.35) * 0.9, dz: pz / l + (Math.random() - 0.5) * 0.7,
      spin: (Math.random() - 0.5) * 1.6, reach: 0.7 + Math.random() * 0.7, amt: 0 };
  });
  return { floors, W, D, done, segs, parts, mid: (top + mh) / 2, at, yawOff };
}

const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };

/**
 * Website hero: the same towers as the app's sign-in page. `dark` comes from the page (prefers-color-scheme).
 */
const Skyline = ({ layout = "sides" }) => {
  const ref = useRef(null);
  const isDark = useDark();
  const colors = useRef({ wire: "#8E8A82", blue: "#2445D4" });
  colors.current = isDark ? { wire: "#6E6A63", blue: "#5B7BF0" } : { wire: "#8E8A82", blue: "#2445D4" };

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const fine = window.matchMedia?.("(pointer: fine)").matches ?? true;
    const towers = [makeTower(16, 1.5, 1.0, 10, -1, 0.2, 0), makeTower(26, 1.15, 1.0, 9, 1, 0.8, 0.5)];
    let yaw = -0.55, pitch = 0.12, tYaw = yaw, tPitch = pitch, mxp = -1, myp = -1, raf = 0;
    const t0 = performance.now();
    // "typing" = a key pressed in the last 1.5 s (the email box is focused on load, so focus alone isn't enough)
    let lastKey = -1e9;
    const typing = () => performance.now() - lastKey < 1500;
    const onKey = () => { lastKey = performance.now(); };

    const box = () => cv.getBoundingClientRect();
    const size = () => { const r = window.devicePixelRatio || 1, b = box(); cv.width = b.width * r; cv.height = b.height * r; ctx.setTransform(r, 0, 0, r, 0, 0); };
    size();

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } });
    io.observe(cv);
    const frame = (now) => {
      if (!visible) return;
      const b = box(), w = b.width, h = b.height, narrow = w < 760, still = typing();
      if (!fine || mxp < 0) { const t = (now - t0) / 1000; tYaw = -0.55 + Math.sin(t * 0.25) * 0.35; tPitch = 0.12 + Math.sin(t * 0.17) * 0.04; }
      const k = reduce ? 1 : still ? 0.02 : 0.06;
      yaw += (tYaw - yaw) * k; pitch += (tPitch - pitch) * k;
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(h / 12, narrow ? w / 6 : 105), cam = 12, oy = h * 0.95;
      const alpha = narrow ? 0.45 : 1, R = narrow ? 120 : 170, live = mxp >= 0 && fine && !still && !reduce;
      const { wire, blue } = colors.current;
      ctx.lineCap = "round";
      for (const T of towers) {
        const ox = w * T.at, Y0 = T.mid, yw = yaw + T.yawOff;
        const cy = Math.cos(yw), sy = Math.sin(yw), cp = Math.cos(pitch), sp = Math.sin(pitch);
        const proj = (x, y, z) => {
          const X = x * cy - z * sy, Z0 = x * sy + z * cy;
          const Y = (y - Y0) * cp - Z0 * sp, Z = (y - Y0) * sp + Z0 * cp;
          const p = cam / (cam + Z);
          return [ox + X * scale * p, oy - (Y + Y0) * scale * p];
        };
        const near = new Float32Array(T.floors + 1);
        if (mxp >= 0 && fine) for (let f = 0; f <= T.floors; f++) {
          const fy = proj(0, (f + 0.5) * FH, 0)[1];
          const dy = Math.abs(myp - fy), dx = Math.max(0, Math.abs(mxp - ox) - scale * 1.1);
          near[f] = Math.max(0, 1 - dy / 110) * Math.max(0, 1 - dx / 420);
        }
        for (let i = 0; i < T.segs.length; i++) {
          const s = T.segs[i], P = T.parts[i];
          // under the pointer: come apart quickly; when it leaves: go back into place slowly
          const [pmx, pmy] = proj(P.mx, P.my, P.mz);
          const d = live ? Math.hypot(pmx - mxp, pmy - myp) : 1e9;
          const target = d < R ? Math.pow(1 - d / R, 1.4) : 0;
          P.amt += (target - P.amt) * (target > P.amt ? 0.2 : 0.045);
          let e1 = [s[0], s[1], s[2]], e2 = [s[3], s[4], s[5]];
          if (P.amt > 0.002) {
            const a = P.spin * P.amt, ca = Math.cos(a), sa = Math.sin(a), o = P.amt * P.reach;
            const move = ([x, y, z]) => {
              const rx = x - P.mx, rz = z - P.mz, ry = y - P.my;
              return [P.mx + rx * ca - rz * sa + P.dx * o, P.my + ry * Math.cos(a * 0.6) + P.dy * o, P.mz + rx * sa + rz * ca + P.dz * o];
            };
            e1 = move(e1); e2 = move(e2);
          }
          const a1 = proj(...e1), a2 = proj(...e2);
          const f = s[7], glow = Math.max(near[Math.min(f, T.floors)] || 0, P.amt), done = f < T.done && s[6] !== "crane" && s[6] !== "hook";
          if (glow > 0.05) { ctx.strokeStyle = rgba(blue, (0.25 + 0.75 * glow) * alpha); ctx.lineWidth = 1 + glow * 1.2; }
          else if (done) { ctx.strokeStyle = rgba(blue, 0.28 * alpha); ctx.lineWidth = 1; }
          else { ctx.strokeStyle = rgba(wire, (s[6] === "brace" ? 0.22 : 0.42) * alpha); ctx.lineWidth = s[6] === "crane" ? 1.2 : 1; }
          ctx.beginPath(); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(a2[0], a2[1]); ctx.stroke();
        }
        for (let f = 0; f <= T.floors; f++) if (near[f] > 0.2 && !(live && near[f] > 0.6)) {
          const c = [[-T.W / 2, -T.D / 2], [T.W / 2, -T.D / 2], [T.W / 2, T.D / 2], [-T.W / 2, T.D / 2]].map(([x, z]) => proj(x, f * FH, z));
          ctx.fillStyle = rgba(blue, 0.07 * near[f] * alpha);
          ctx.beginPath(); c.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
        }
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (e) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const b = box(); mxp = e.clientX - b.left; myp = e.clientY - b.top;
      tYaw = -0.55 + (mxp / b.width - 0.5) * 0.9; tPitch = 0.12 + (myp / b.height - 0.5) * 0.22;
    };
    const onLeave = () => { mxp = -1; };
    const onResize = () => { size(); if (reduce) raf = requestAnimationFrame(frame); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // reduced motion draws once: draw again when the theme changes
  useEffect(() => { window.dispatchEvent(new Event("resize")); }, [isDark]);
  void layout;

  return <canvas ref={ref} aria-hidden="true" className="h26-skyline" data-testid="skyline" />;
};

export default Skyline;
