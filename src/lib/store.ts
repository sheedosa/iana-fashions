// Commerce goes through this module only, as on the schoolwear site.
// Preview mode reads src/data/catalogue.json. At build, ShopifyStorefront (ported from iana-schoolwear/src/lib/shopify.ts)
// implements the same interface: Length and Size become Shopify variant options, fabric a product metafield.
import catalogue from "../data/catalogue.json";
import type { LengthId } from "../data/site";

export type Product = {
  handle: string;
  title: string;
  type: string;
  collections: string[];
  colour: string;
  colours: string[];
  fabric: string;
  lengths: LengthId[];
  sizes: string[];
  images: string[]; // paths under /img without extension; -sm variant exists for cards
  badge?: string;
  details: string;
};
export type Collection = { handle: string; title: string; blurb: string };

const data = catalogue as unknown as { collections: Collection[]; products: Product[] };

export const store = {
  collections: (): Collection[] => data.collections,
  collection: (handle: string) => data.collections.find((c) => c.handle === handle),
  products: (f: { collection?: string; fabric?: string[]; length?: LengthId | null } = {}): Product[] =>
    data.products.filter((p) =>
      (!f.collection || f.collection === "all" || p.collections.includes(f.collection)) &&
      (!f.fabric?.length || f.fabric.includes(p.fabric)) &&
      (!f.length || p.lengths.length === 0 || p.lengths.includes(f.length))),
  product: (handle: string) => data.products.find((p) => p.handle === handle),
  fabrics: (): string[] => [...new Set(data.products.map((p) => p.fabric))].sort(),
};

export const img = (path: string, small = false) => `${import.meta.env.BASE_URL}img/${path}${small ? "-sm" : ""}.webp`;
export const hasSmall = (path: string) => !path.startsWith("hero/");
export const cardImg = (path: string) => img(path, hasSmall(path));
