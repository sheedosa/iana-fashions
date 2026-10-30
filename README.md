# I&A Fashions — modest wear storefront

Concept preview of the I&A Fashions store: abayas, dresses, co-ords, hijabs and prayer wear, cut in Petite, Regular and Tall.
Built by Elconekt for IandA Group on the same stack as [I&A Schoolwear](https://github.com/sheedosa/iana-schoolwear).

**Live preview:** https://sheedosa.github.io/iana-fashions/

## Stack
Vite + React 19 + TypeScript + Tailwind v4, react-router, deployed to GitHub Pages by `.github/workflows/deploy.yml`.
Every route is prerendered to static HTML (`scripts/prerender.mjs`) with titles, meta, Open Graph, JSON-LD, `sitemap.xml` and `llms.txt`.

## Commands
```bash
npm install
npm run dev          # http://localhost:5173/iana-fashions/
npm run build        # typecheck + build + prerender (needs Chromium)
npm run build:spa    # without prerender
```

## What's real and what's sample
- **Real:** business name, address, phone, hours, company and VAT numbers, brand (I&A brand guide 2022, Fashions lockup and Light Pink).
- **Sample:** every product in `src/data/catalogue.json`, and the length measurements in `src/data/site.ts`. Ordering is switched off (`SITE.preview`).
- Open questions for the client are in `SITE.toConfirm`.

## Going live
1. Replace the catalogue with the client's range, or port `ShopifyStorefront` from the schoolwear repo into `src/lib/store.ts` (Length and Size as variant options, fabric as a metafield).
2. Set `SITE.preview = false`, add basket and checkout (schoolwear's `CartDrawer` + Shopify cart).
3. Add `VITE_SHOPIFY_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_TOKEN` as repository secrets.
4. Custom domain: `public/CNAME`, `VITE_BASE=/`, update `SITE.url`, `index.html`, `robots.txt`, `404.html` and `scripts/prerender.mjs`.
