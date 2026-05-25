import "./Footer.scss";
import { useNavigate, useLocation } from "react-router-dom";
import PortalButton from "../PortalButton/PortalButton";
import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path, sectionId) => {
    if (sectionId) {
      const sectionHashPath = `${path}#${sectionId}`;
      const shouldReplace = location.pathname === path && location.hash === `#${sectionId}`;

      navigate(sectionHashPath, { replace: shouldReplace });
      requestAnimationFrame(() => {
        const target = document.getElementById(sectionId);
        if (!target) {
          return;
        }

        if (window.lenis) {
          window.lenis.scrollTo(target);
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      return;
    }

    if (location.pathname !== path) {
      navigate(path);
    }

    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  };
  return (
    <>
      <footer className="footer">
        <div className="footer-middle pb-[128px]">
          <div className="col-one">
            <div>
              <p className="footer-middle-title mb-[32px] text-[14px] font-medium">Start Building Today </p>
              <PortalButton
                label="Schedule Demo"
                redirectTo="/schedule"
                showDivider={true}
                fullWidth
                className="cta__portal-btn footer-portal-btn"
              />
              <PortalButton
                label="Learn More"
                redirectTo="/get-started"
                showDivider={true}
                fullWidth
                className="cta__portal-btn footer-portal-btn mt-4"
              />
            </div>
          </div>
          <div className="col-two">
            <div className="footer-main-links">
              <p className="footer-middle-title mb-[32px] text-[14px] font-medium">Explore 1iQ</p>
              <div className="footer-links">
                {/* <a href="/core-field">
                  <span>1iQ Core</span>
                  <span>1iQ Core</span>
                </a>
                <a href="/core-field">
                  <span>1iQ Field</span>
                  <span>1iQ Field</span>
                </a>
                <a href="/intelligence">
                  <span>1iQ Intel</span>
                  <span>1iQ Intel</span>
                </a> */}
                <a href="/platform">
                  <span>1iQ Platform</span>
                  <span>1iQ Platform</span>
                </a>
                <a href="/platform" onClick={(e) =>{
                   e.preventDefault();
                   handleNavigation('/platform', 'core');
                }}>
                  <span>1iQ Core</span>
                  <span>1iQ Core</span>
                </a>
                <a href="/platform" onClick={(e) =>{
                   e.preventDefault();
                   handleNavigation('/platform', 'field');
                }}>
                  <span>1iQ Field</span>
                  <span>1iQ Field</span>
                </a>
                <a href="/platform" onClick={(e) => {
                   e.preventDefault();
                   handleNavigation('/platform', 'intelligence');
                }}>
                  <span>1iQ Intel</span>
                  <span>1iQ Intel</span>
                </a>
              </div>
            </div>
          </div>
          <div className="col-four flex lg:justify-end">
            <div>
              <p className="footer-middle-title mb-[32px] text-[14px] font-medium">CAPABILITIES</p>
              <div className="footer-links">
                <a className="link">Real Time Data Sync</a>
                <a className="link">Digital Twin Integration</a>
                <a className="link">Predictive Conflict Resolution</a>
                <a className="link">Workflow Automation</a>
                <a className="link">Project Portfolio Intelligence</a>
                <a className="link">Multi Project Control</a>
              </div>

            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="social flex gap-8">
            <a
              href="https://www.linkedin.com/company/1iq-ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="icon cursor-pointer" />
            </a>
            <a href="https://x.com/1iQaiApp" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="icon cursor-pointer" />
            </a>
            <a href="https://www.instagram.com/1iq.ai/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="icon cursor-pointer" />
            </a>
          </div>
          <div className="flex gap-6 flex-wrap">
            <a href="mailto:admin@1iq.ai" className="email-address" target="_blank">admin@1iq.ai</a>
            <div className="address text-nowrap">312 W. 2nd St, #1931, Casper, WY 82601</div>
          </div>
          <div className="legal-links flex gap-6">
            <div className="terms">
              <a href="/terms-of-use" className="hover:text-gray-400 transition-colors">Terms of Use</a>
            </div>
            <div className="policy">
              <a href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
