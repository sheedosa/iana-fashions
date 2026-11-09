// Post-build: render every route to static HTML inside dist/ so GitHub Pages serves real pages
// (titles, meta, JSON-LD and content) to Google, social scrapers and AI crawlers. Also writes sitemap.xml and llms.txt.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const BASE = "/iana-fashions";
const SITE = "https://sheedosa.github.io" + BASE;
const dist = new URL("../dist/", import.meta.url).pathname;
const cat = JSON.parse(readFileSync(new URL("../src/data/catalogue.json", import.meta.url)));

const routes = ["/", "/alterations", "/delivery-returns", "/visit", "/shop/all",
  ...cat.collections.map((c) => `/shop/${c.handle}`),
  ...cat.products.map((p) => `/products/${p.handle}`)];

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]).replace(BASE, "") || "/";
  let f = join(dist, p);
  if (!existsSync(f) || statSync(f).isDirectory()) f = join(dist, "index.html");
  res.setHeader("Content-Type", types[extname(f)] ?? "application/octet-stream");
  res.end(readFileSync(f));
});
// Any free port, so parallel builds never collide.
await new Promise((ok) => server.listen(Number(process.env.PRERENDER_PORT || 0), ok));
const port = server.address().port;

const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort()); // fonts aren't needed for markup
let n = 0;
for (const r of routes) {
  await page.goto(`http://localhost:${port}${BASE}${r}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("h1") && !document.body.innerText.includes("Loading"), null, { timeout: 10000 }).catch(() => {});
  let html = await page.content();
  html = html.replace("<html", '<html data-prerendered="1"'); // informational only
  const out = r === "/" ? join(dist, "index.html") : join(dist, r.slice(1), "index.html");
  mkdirSync(join(out, ".."), { recursive: true });
  writeFileSync(out, "<!doctype html>\n" + html.replace(/^<!doctype html>\s*/i, ""));
  n++;
}
await browser.close(); server.close();

// The old length page now lives at /alterations: a static redirect so old links keep working.
const redirectTo = `${SITE}/alterations`;
mkdirSync(join(dist, "find-your-length"), { recursive: true });
writeFileSync(join(dist, "find-your-length", "index.html"), `<!doctype html>\n<html lang="en-GB"><head><meta charset="utf-8"><title>Alterations and bespoke | I&A Fashions</title><link rel="canonical" href="${redirectTo}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${BASE}/alterations"></head><body><p><a href="${BASE}/alterations">Alterations and bespoke</a></p></body></html>\n`);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod><changefreq>${r.startsWith("/products") ? "weekly" : "monthly"}</changefreq><priority>${r === "/" ? "1.0" : r.startsWith("/shop/") ? "0.9" : "0.7"}</priority></url>`).join("\n")}\n</urlset>\n`);

const cols = cat.collections.map((c) => `- [${c.title}](${SITE}/shop/${c.handle}): ${c.blurb}`).join("\n");
writeFileSync(join(dist, "llms.txt"), `# I&A Fashions

> Modest wear from I & A Fashions Limited, a family business at 84 Mitcham Road, Tooting, London SW17 9NG, trading since 1993. Abayas (about ten at any time, changing weekly or monthly), hijabs (about twenty styles, each in five colours or more) and co-ords (about ten), in cotton, jersey and polyester, priced from £18 to £65. Every abaya can be taken up or amended in the shop; custom and bespoke abayas are coming soon. Pre-orders are taken for new collections and Eid. Open Monday to Sunday 9am to 6pm. Phone 020 8767 8613. Sister shop: I&A Schoolwear.

Delivery: standard £4.95 (5 working days), express £7.95 (48 hours), free on orders of £100 and over, click and collect from 84 Mitcham Road, Tooting. Returns: 28 days; suits, bridal dresses and prom dresses excluded.

Note: this site is a concept preview. Products listed are samples; online ordering opens at launch.

## Collections
${cols}

## Help
- [Alterations and bespoke](${SITE}/alterations): amendments in the shop, bespoke coming soon
- [Delivery and returns](${SITE}/delivery-returns)
- [Visit the shop](${SITE}/visit): address, hours, phone
`);
console.log(`prerendered ${n} routes, sitemap + llms.txt written`);
