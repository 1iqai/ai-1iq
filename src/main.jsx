import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
import App from "./App.jsx";
import { cleanPath } from "./seo";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Pages are written out as finished HTML when the site is built (scripts/prerender.mjs), so search engines and
// AI assistants can read them without running scripts. When the HTML in the page is for this address, React
// takes it over as it is. For any other address (the demo, a redirect) the page is drawn fresh.
if (root.dataset.path && root.dataset.path === cleanPath(window.location.pathname)) {
  hydrateRoot(root, app);
} else {
  root.innerHTML = "";
  createRoot(root).render(app);
}
