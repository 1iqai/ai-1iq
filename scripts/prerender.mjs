// Runs at the end of "npm run build". Writes every public page out as a finished HTML file, so search engines
// and AI assistants (most of which do not run scripts) can read the whole page: its text, its title and
// description, and its structured data. The browser then takes the same HTML over (src/main.jsx).
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const { render, SEO, SITE } = await import(pathToFileURL(path.join(root, ".prerender", "prerender.js")).href);
const template = await readFile(path.join(dist, "index.html"), "utf8");
const manifest = JSON.parse(await readFile(path.join(dist, ".vite", "manifest.json"), "utf8"));

// which source file draws which page, to find the styles that page needs before any script runs
const PAGE_FILE = {
  "/platform": "src/pages/Platform/Platform.jsx", "/developer": "src/pages/Developer/Developer.jsx",
  "/construction-schedule-review": "src/pages/Scheduling/ScheduleReview.jsx", "/preconstruction-scheduling": "src/pages/Scheduling/Preconstruction.jsx",
  "/schedule": "src/pages/Schedule/Schedule.jsx", "/learn-more": "src/pages/LearnMore/LearnMore.jsx",
  "/partnership-inquiry": "src/pages/PartnershipInquiry/PartnershipInquiry.jsx", "/builder-application": "src/pages/BuilderForm/BuilderForm.jsx",
  "/get-started": "src/pages/GetStarted/GetStarted.jsx", "/terms-of-use": "src/pages/TermsOfUse/TermsOfUse.jsx", "/privacy-policy": "src/pages/PrivacyPolicy/PrivacyPolicy.jsx",
};
const cssFor = (key, seen = new Set(), out = new Set()) => {
  const e = manifest[key];
  if (!e || seen.has(key)) return out;
  seen.add(key);
  (e.css || []).forEach((c) => out.add(c));
  (e.imports || []).forEach((k) => cssFor(k, seen, out));
  return out;
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const setMeta = (html, attr, name, value) => html.replace(new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`, "s"), `$1${esc(value)}$2`);

let count = 0;
for (const [route, seo] of Object.entries(SEO)) {
  // The first pass loads the page's code; once loaded, the next pass draws the page in one piece. A page left
  // in pieces would keep its content hidden until a script ran, which is the very thing this file exists to avoid.
  let body = "";
  for (let pass = 0; pass < 4; pass++) {
    body = await render(route);
    if (!body.includes('<template id="B:')) break;
  }
  if (!body.includes("s26")) throw new Error(`Nothing was drawn for ${route}`);
  if (body.includes('<template id="B:')) throw new Error(`${route} was not drawn in one piece`);
  const url = SITE + (route === "/" ? "/" : route);
  const links = [...cssFor(PAGE_FILE[route] || "")].map((c) => `<link rel="stylesheet" href="/${c}" />`).join("\n  ");
  const ld = seo.ld.map((d) => `<script type="application/ld+json" class="seo-ld">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`).join("\n  ");
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(seo.title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace("<!--seo-->", [links, ld].filter(Boolean).join("\n  "))
    .replace('<div id="root"><!--app--></div>', `<div id="root" data-path="${route}">${body}</div>`);
  for (const [attr, name, value] of [
    ["name", "title", seo.title], ["name", "description", seo.description],
    ["property", "og:title", seo.title], ["property", "og:description", seo.description], ["property", "og:url", url],
    ["property", "twitter:title", seo.title], ["property", "twitter:description", seo.description], ["property", "twitter:url", url],
  ]) html = setMeta(html, attr, name, value);
  if (!html.includes(`data-path="${route}"`)) throw new Error(`Could not place the page for ${route}`);
  const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  count++;
}

// the list of pages for search engines, from the same table
const today = new Date().toISOString().slice(0, 10);
const HIDE = new Set(["/partnership-inquiry", "/builder-application", "/get-started"]);
const urls = Object.keys(SEO).filter((r) => !HIDE.has(r)).map((r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod></url>`).join("\n");
await writeFile(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await rm(path.join(root, ".prerender"), { recursive: true, force: true });
console.log(`Wrote ${count} pages as finished HTML, and the sitemap.`);
