import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
// Every page but the home page loads on demand, so the home page stays light.
import "./App.scss";
const Schedule = lazy(() => import("./pages/Schedule/Schedule"));
// The Nov 2026 home page; the earlier one (./pages/Home/Home) stays in the repo for reference, unrouted.
import Home2026 from "./pages/Home2026/Home2026";
const ContactUs = lazy(() => import("./pages/ContactUs/ContactUs"));
const PartnershipInquiry = lazy(() => import("./pages/PartnershipInquiry/PartnershipInquiry"));
const BuilderForm = lazy(() => import("./pages/BuilderForm/BuilderForm"));
const LearnMore = lazy(() => import("./pages/LearnMore/LearnMore"));
const CoreField = lazy(() => import("./pages/CoreField/CoreField"));
const Intelligence = lazy(() => import("./pages/Intelligence/Intelligence"));
const GetStarted = lazy(() => import("./pages/GetStarted/GetStarted"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy"));
const Platform = lazy(() => import("./pages/Platform/Platform"));
const Developer = lazy(() => import("./pages/Developer/Developer"));
import ScrollToTop from "./components/ScrollToTop";
const DemoAppWrapper = lazy(() => import("./components/DemoAppWrapper"));


function App() {
  useEffect(() => {
    // Smooth scrolling and ScrollTrigger load after the first paint, so the home page shows sooner.
    let cleanup = () => {};
    let cancelled = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("lenis")]).then(([{ default: gsap }, { ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      cleanup = (() => {
        // On touch/mobile: skip Lenis entirely — native momentum scroll is smoother
        // and Lenis's RAF loop causes jank/bounce on iOS/Android even with smoothTouch:false
        const isTouchDevice =
          window.matchMedia('(pointer: coarse)').matches ||
          'ontouchstart' in window;

        if (isTouchDevice) {
          // Native scroll: just keep ScrollTrigger in sync on resize
          let resizeTimer;
          const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
          };
          window.addEventListener('resize', handleResize, { passive: true });
          window.addEventListener('orientationchange', () => {
            setTimeout(() => ScrollTrigger.refresh(), 300);
          });
          window.lenis = null;
          return () => {
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
          };
        }

        // Desktop only — Lenis smooth wheel scroll
        const lenis = new Lenis({
          lerp: 0.1,
          smoothWheel: true,
          smoothTouch: false,
          touchAction: 'pan-y',
        });
        window.lenis = lenis;

        const handleLenisScroll = () => ScrollTrigger.update();
        lenis.on('scroll', handleLenisScroll);

        // GSAP ticker passes seconds; lenis.raf() expects milliseconds
        const raf = (time) => {
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        let resizeTimer;
        const handleResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
        };
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
          clearTimeout(resizeTimer);
          window.removeEventListener('resize', handleResize);
          lenis.off('scroll', handleLenisScroll);
          lenis.destroy();
          window.lenis = null;
          gsap.ticker.remove(raf);
          gsap.ticker.lagSmoothing(1000, 16);
        };
      })() || (() => {});
    });
    return () => { cancelled = true; cleanup(); };
  }, []);

  return (
    <div className="app">
      {/* every page opens straight away, no splash */}
      <ScrollToTop />
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home2026 />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/learn-more" element={<LearnMore />} />
        {/* <Route path="/core-field" element={<CoreField />} />
        <Route path="/intelligence" element={<Intelligence />} /> */}
        <Route path="/contact-us" element={<Navigate to="/schedule" replace />} />
        <Route path="/pricing" element={<Navigate to="/" replace />} />
        <Route path="/partnership-inquiry" element={<PartnershipInquiry />} />
        <Route path="/builder-application" element={<BuilderForm />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/demo/*" element={<DemoAppWrapper />} />
      </Routes>
      </Suspense>
    </div>
  );
}

export default App;
