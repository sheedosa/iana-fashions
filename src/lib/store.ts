// Commerce goes through this module only, as on the schoolwear site.
// Preview mode reads src/data/catalogue.json. At build, ShopifyStorefront (ported from iana-schoolwear/src/lib/shopify.ts)
// implements the same interface: Colour and Size become Shopify variant options, fabric a product metafield.
import catalogue from "../data/catalogue.json";

export type Colour = { name: string; hex: string };
export type HijabArt = { shape: "long" | "square" | "instant"; texture: "plain" | "crinkle" | "sheer" | "sheen" };
export type Product = {
  handle: string;
  title: string;
  type: string;
  collections: string[];
  fabric: string;
  price: number; // sample price inside the confirmed £18 to £65 range
  colours: Colour[];
  sizes: string[];
  images: string[]; // paths under /img without extension; a -sm variant exists for cards
  slot?: string; // what the photo will show, when there is no image yet
  art?: HijabArt; // hijabs are drawn in the chosen colour until photography arrives
  badge?: "New" | "Pre-order";
  details: string;
  pairsWith: string[];
};
export type Collection = { handle: string; title: string; blurb: string };

const WALL_ORDER = ["White", "Cream", "Stone", "Camel", "Rust", "Blush", "Dusty pink", "Lilac", "Plum", "Mocha", "Olive", "Sage", "Teal", "Navy", "Charcoal", "Black"];

const data = catalogue as unknown as { collections: Collection[]; products: Product[] };

export const store = {
  collections: (): Collection[] => data.collections,
  collection: (handle: string) => data.collections.find((c) => c.handle === handle),
  products: (f: { collection?: string; fabric?: string[]; colour?: string | null } = {}): Product[] =>
    data.products.filter((p) =>
      (!f.collection || f.collection === "all" || p.collections.includes(f.collection)) &&
      (!f.fabric?.length || f.fabric.includes(p.fabric)) &&
      (!f.colour || p.colours.some((c) => c.name === f.colour))),
  /** Every colour in a set of products, once each, in the order of the colour wall (light to dark through the warm tones). */
  colours: (list: Product[]): Colour[] => {
    const seen = new Map<string, Colour>();
    list.forEach((p) => p.colours.forEach((c) => { if (!seen.has(c.name)) seen.set(c.name, c); }));
    const rank = (c: Colour) => { const i = WALL_ORDER.indexOf(c.name); return i < 0 ? WALL_ORDER.length : i; };
    return [...seen.values()].sort((a, b) => rank(a) - rank(b));
  },
  /** The colour wall: every hijab colour with the styles that come in it. */
  hijabWall: (): { colour: Colour; styles: Product[] }[] => {
    const hijabs = data.products.filter((p) => !!p.art);
    return store.colours(hijabs).map((colour) => ({ colour, styles: hijabs.filter((p) => p.colours.some((c) => c.name === colour.name)) }));
  },
  product: (handle: string) => data.products.find((p) => p.handle === handle),
  pairs: (p: Product): Product[] => p.pairsWith.map((h) => data.products.find((x) => x.handle === h)).filter((x): x is Product => !!x),
  isPreorder: (p: Product) => p.badge === "Pre-order",
  isAbaya: (p: Product) => p.type === "Abayas",
};

export const img = (path: string, small = false) => `${import.meta.env.BASE_URL}img/${path}${small ? "-sm" : ""}.webp`;
export const hasSmall = (path: string) => !path.startsWith("hero/");
export const cardImg = (path: string) => img(path, hasSmall(path));
