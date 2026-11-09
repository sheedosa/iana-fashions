# I&A Fashions storefront — guidance for Claude Code

Static React storefront (Vite + Tailwind) on GitHub Pages; Shopify will be the commerce backend, as on iana-schoolwear.

## Rules
1. **Facts come from `src/data/site.ts`; products from `src/data/catalogue.json`.** Never invent prices, policies, delivery terms, fabric claims or measurements. Confirmed facts (range, fabrics: cotton, jersey, polyester; £18 to £65; delivery and returns) live in `SITE`. Unconfirmed items go in `SITE.toConfirm` and appear on pages only as a body-size `[PLACEHOLDER]`, never in a heading. While `SITE.preview` is true, products are samples and must stay labelled as such.
2. **Commerce goes through `src/lib/store.ts` only.** Components never fetch product data directly.
3. **Every page sets `<Seo>`.** Add new routes to `scripts/prerender.mjs`.
4. **No AI-generated faces.** Models are shown from behind or cropped at the shoulders.
5. **Brand (I&A guide 2022, Fashions variant):** Ochre #45353a text and dark areas; Light Pink #ffcad4 as surface/highlight only, never text; Sage #d8e2dc bands and product backdrops; warm white #fbfbf9 ground. Cormorant Garamond Bold headings (sentence case); Agrandir body and 0.15em uppercase labels, Lexend until licensed (change `--font-sans` only). Corners 3px. No pills, gradients as decoration, or card grids for prose.
6. **Made to fit you is the core idea:** every abaya can be taken up or amended in the shop (`/alterations`); bespoke is coming soon (register interest saves on the device only, `src/lib/interest.ts`). Abayas come in one length: never reintroduce Petite/Regular/Tall or length pickers. Hijabs are the biggest category: styles are products, colours are real swatches, and until photography arrives a hijab is drawn in the chosen colour (`src/components/Art.tsx`). Pre-orders (Eid, new collections) use the `Pre-order` badge.
   Imagery: no photo twice on one page, the hero frame is never a product card, and a product without its own photo gets a `PhotoSlot`.
7. Tap targets ≥ 44px, no horizontal overflow at 375px, body text ≥ 16px, one heading scale (h1 40/56, h2 30/40 in `index.css` `@layer base`), British English, GBP.
