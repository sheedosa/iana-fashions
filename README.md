# I&A Fashions — modest wear storefront

Concept preview of the I&A Fashions store: hijabs, abayas and co-ords from the Tooting shop, where every abaya can be taken up or amended to fit. Bespoke abayas are coming soon.
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
- **Real:** business name, address, phone, hours, company and VAT numbers, brand (I&A brand guide 2022, Fashions lockup and Light Pink). Confirmed by the client: range sizes (about 10 abayas, 20 hijab styles in 5+ colours, 10 co-ords), fabrics (cotton, jersey, polyester), £18 to £65, in-shop alterations, bespoke coming soon, pre-orders for Eid and new collections, delivery (£4.95 standard, £7.95 express, free over £100, click and collect) and 28-day returns.
- **Sample:** every product in `src/data/catalogue.json` (names, prices, colours). Hijabs are drawn in code until photographed; products without a photo show a labelled slot. Ordering is switched off (`SITE.preview`).
- Open questions for the client are in `SITE.toConfirm`.

## Going live
1. Replace the catalogue with the client's range, or port `ShopifyStorefront` from the schoolwear repo into `src/lib/store.ts` (Colour and Size as variant options, fabric as a metafield).
2. Set `SITE.preview = false`, add basket and checkout (schoolwear's `CartDrawer` + Shopify cart).
3. Add `VITE_SHOPIFY_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_TOKEN` as repository secrets.
4. Custom domain: `public/CNAME`, `VITE_BASE=/`, update `SITE.url`, `index.html`, `robots.txt`, `404.html` and `scripts/prerender.mjs`.
