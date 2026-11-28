import { useEffect, useRef, useState } from "react";

/**
 * How 1iQ is used, in 28 seconds, with nothing to press.
 *
 * Four beats of seven: work happens on site, the crew taps it once on the phone, the dashboard updates
 * live, and the forecast finish date moves itself. That chain is the product, and it is the one thing a
 * tool without a field app cannot show, so it is worth a visitor's first half minute.
 *
 * It is pure CSS (the .lp rules in site-draft.css). No video to host or buffer, no play button, nothing
 * to wait for, and it runs identically on the hand written home page, which has no React. A visitor who
 * arrives mid loop still sees the whole story within half a minute, because it never stops.
 *
 * Reduced motion gets the end state with every caption visible at once, which reads as a static diagram
 * of the same four steps rather than an animation nobody asked for.
 *
 * The same markup is in src/pages/Home2026/site/markup.html. Change one, change the other.
 */
const FILM = "/assets/video/how-1iq-works.mp4";
const POSTER = "/assets/video/how-1iq-works.jpg";

/**
 * The 62 second film, with the CSS loop underneath it.
 *
 * The film is the better telling: it is the real apps, shot on the real product, and it shows the
 * handoff from the phone to the web app in a way line art cannot. But it is 9MB, so nobody waits for
 * it: the loop below runs from the first paint, the film only starts loading when the section comes
 * near the viewport, and it fades in over the loop once the browser says it can play through. A
 * visitor on a slow connection, with data saver on, or with reduced motion set, simply keeps the loop.
 */
const UseFilm = () => {
  const box = useRef(null);
  const vid = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = vid.current, b = box.current;
    if (!v || !b) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (window.innerWidth < 760) return undefined;   // the loop is the phone telling
    if (!("IntersectionObserver" in window)) return undefined;

    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        v.src = FILM;            // nothing is fetched until here
        v.load();
      });
    }, { rootMargin: "400px 0px" });
    io.observe(b);
    return () => io.disconnect();
  }, []);

  const onReady = () => {
    const v = vid.current;
    if (!v) return;
    const go = v.play();
    if (go && go.catch) go.catch(() => {});   // a browser that refuses autoplay keeps the loop
    setReady(true);
  };

  return (
    <div className={`lp-film${ready ? " is-ready" : ""}`} ref={box}>
      <video
        className="lp-film__v"
        ref={vid}
        poster={POSTER}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
        aria-hidden="true"
        onCanPlayThrough={onReady}
      />
      <UseLoop />
    </div>
  );
};

const UseLoop = () => (
  <div
    className="lp reveal"
    role="img"
    aria-label="How 1iQ is used. A crew finishes the MEP rough in on level 12 and marks it done on the phone. The dashboard in the office updates live, and the forecast finish date moves from August 3 to July 29."
  >
    <div className="lp__head">
      <span className="k">Harbor Lofts · Level 12</span>
      <span className="k">Thursday, 9:12 AM</span>
    </div>

    <div className="lp__stage">
      <div className="lp__col lp__col--1">
        <span className="lp__tag">On site</span>
        <div className="lp__floors" aria-hidden="true">
          <i className="is-done" /><i className="is-done" /><i className="is-done" /><i className="is-now" /><i /><i />
        </div>
        <div className="lp__who">
          <b>MEP rough in, level 12</b>
          <span className="lp__sub">Dani · Flow Mechanical</span>
          <span className="lp__chip lp__chip--run">In progress</span>
          <span className="lp__chip lp__chip--done">Finished</span>
        </div>
      </div>

      <div className="lp__col lp__col--2">
        <span className="lp__tag">On the phone</span>
        <div className="phone lp__phone">
          <div className="phone__notch" />
          <div className="task"><div className="strong small">MEP rough in</div><div className="xs muted">Level 12 · due today</div></div>
          <div className="lp__btn">Finish<i className="lp__tap" /></div>
          <div className="push lp__sent"><div className="xs muted"><span className="dot" />Sent</div><div className="strong small">Logged 9:12 AM</div></div>
        </div>
      </div>

      <div className="lp__col lp__col--3">
        <span className="lp__tag">In the office</span>
        <div className="lp__dash">
          <div className="lp__row"><span>Structure, L1 to L11</span><b className="ok">Done</b></div>
          <div className="lp__row lp__row--live"><span>MEP rough in, L12</span><b className="run">On site</b><b className="ok">Done</b></div>
          <div className="lp__row"><span>Envelope, L1 to L7</span><b className="dim">58%</b></div>
          <div className="lp__date">
            <span className="k">Forecast finish</span>
            <b className="lp__was">Aug 3</b>
            <small className="lp__wasnote">7 days late</small>
            <b className="lp__now">Jul 29</b>
            <small className="lp__nownote">4 days recovered</small>
          </div>
        </div>
      </div>

      <span className="lp__wire" aria-hidden="true"><i /></span>
    </div>

    <div className="lp__caps">
      <p className="lp__cap lp__cap--1"><b>Work happens.</b> A crew finishes the MEP rough in on level 12.</p>
      <p className="lp__cap lp__cap--2"><b>One tap, where they stand.</b> They mark it done on the phone. Nobody writes a report.</p>
      <p className="lp__cap lp__cap--3"><b>The office sees it live.</b> The task lands on the dashboard the moment it is tapped.</p>
      <p className="lp__cap lp__cap--4"><b>The finish date moves itself.</b> Four days recovered, and the owner sees it without asking.</p>
    </div>
    <div className="lp__bar" aria-hidden="true"><i /></div>
  </div>
);

export { UseLoop };
export default UseFilm;
