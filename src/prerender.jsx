// Build time only (npm run build): draws each page to HTML so it can be saved as a finished file.
/* eslint-disable react-refresh/only-export-components */
import { Buffer } from "node:buffer";
import { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";
import { SEO, urlOf } from "./seo";

export { SEO, urlOf };

export async function render(path) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </StrictMode>,
    // keep each page in one piece: by default a long page is split, with the rest held back until a script runs
    { progressiveChunkSize: Number.MAX_SAFE_INTEGER }
  );
  const chunks = [];
  for await (const c of prelude) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks).toString("utf8");
}
