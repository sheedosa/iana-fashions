# I&A Fashions storefront — guidance for Claude Code

Static React storefront (Vite + Tailwind) on GitHub Pages; Shopify will be the commerce backend, as on iana-schoolwear.

## Rules
1. **Facts come from `src/data/site.ts`; products from `src/data/catalogue.json`.** Never invent prices, policies, delivery terms, fabric claims or measurements. Unconfirmed items go in `SITE.toConfirm`. While `SITE.preview` is true, products are samples and must stay labelled as such.
2. **Commerce goes through `src/lib/store.ts` only.** Components never fetch product data directly.
3. **Every page sets `<Seo>`.** Add new routes to `scripts/prerender.mjs`.
4. **No AI-generated faces.** Models are shown from behind or cropped at the shoulders.
5. **Brand (I&A guide 2022, Fashions variant):** Ochre #45353a text and dark areas; Light Pink #ffcad4 as surface/highlight only, never text; Sage #d8e2dc bands and product backdrops; warm white #fbfbf9 ground. Cormorant Garamond Bold headings (sentence case); Agrandir body and 0.15em uppercase labels, Lexend until licensed (change `--font-sans` only). Corners 3px. No pills, gradients as decoration, or card grids for prose.
6. **Length is the core idea:** every abaya/dress shows Petite/Regular/Tall, the shopper's saved length is respected everywhere.
7. Tap targets ≥ 44px, no horizontal overflow at 375px, body text ≥ 16px, British English.
