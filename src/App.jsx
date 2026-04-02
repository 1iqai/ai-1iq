import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.scss";
import Schedule from "./pages/Schedule/Schedule";
import Home from "./pages/Home/Home";
import ContactUs from "./pages/ContactUs/ContactUs";
import PartnershipInquiry from "./pages/PartnershipInquiry/PartnershipInquiry";
import BuilderForm from "./pages/BuilderForm/BuilderForm";
import LearnMore from "./pages/LearnMore/LearnMore";
import CoreField from "./pages/CoreField/CoreField";
import Intelligence from "./pages/Intelligence/Intelligence";
import GetStarted from "./pages/GetStarted/GetStarted";
import TermsOfUse from "./pages/TermsOfUse/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import Platform from "./pages/Platform/Platform";
import "./pages/LearnMore/LearnMore.scss";
import ScrollToTop from "./components/ScrollToTop";

const DemoAppWrapper = lazy(() => import("./components/DemoAppWrapper"));

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // On mobile/touch devices, skip Lenis — native scroll is faster
    const isTouchDevice = () =>
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: false,   // always false — mobile browsers handle touch natively
      touchAction: 'pan-y', // allow native pan-y on touch
    });
    window.lenis = lenis;

    const handleLenisScroll = () => ScrollTrigger.update();
    lenis.on('scroll', handleLenisScroll);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Debounced resize handler — mobile fires resize on orientation change
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
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
  }, []);

  return (
    <div className="app">
      <LoadingScreen />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/learn-more" element={<LearnMore />} />
        {/* <Route path="/core-field" element={<CoreField />} />
        <Route path="/intelligence" element={<Intelligence />} /> */}
        <Route path="/contact-us" element={<Navigate to="/schedule" replace />} />
        <Route path="/partnership-inquiry" element={<PartnershipInquiry />} />
        <Route path="/builder-application" element={<BuilderForm />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/demo/*" element={
          <Suspense fallback={<div>Loading...</div>}>
            <DemoAppWrapper />
          </Suspense>
        } />
      </Routes>
    </div>
  );
}

export default App;
