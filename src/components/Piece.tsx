import { useRef, type CSSProperties } from "react";
import { cardImg, img, store, type Colour, type Product } from "../lib/store";
import { gbp } from "../data/site";
import { CoordArt, HijabArt, PhotoSlot, tint } from "./Art";
import { VLink, pieceVT } from "./VLink";

/** The picture of a piece: its photograph, or a drawing in the chosen colour on a tint of that colour, or a slot that says what will be shot. */
export function PiecePicture({ p, colour, large = false, eager = false, alt = "", style }: { p: Product; colour: Colour; large?: boolean; eager?: boolean; alt?: string; style?: CSSProperties }) {
  const coord = store.coordArt(p);
  if (p.art) return <HijabArt art={p.art} colour={colour} ground={tint(colour.hex, 0.42)} style={style} />;
  if (coord) return <CoordArt colour={colour} wide={coord.wide} trim={coord.trim} ground={tint(colour.hex, 0.22)} style={style} />;
  if (p.images[0]) return <img src={large ? img(p.images[0]) : cardImg(p.images[0])} alt={alt} loading={eager ? "eager" : "lazy"} style={style} />;
  return <PhotoSlot caption={p.slot ?? p.title} />;
}

/** A product name with "co-ord" kept on one line. */
export function Name({ children }: { children: string }) {
  const parts = children.split(/(co-ords?)/i);
  return <>{parts.map((t, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{t}</span> : t))}</>;
}

/** The product unit: a bare picture, edge to edge, and one line under it. `tall` picks 2:3 over 4:5 so a wall is uneven.
    Drawn pieces are shown in `colour` (the listing's filter, or the colour the wall has dealt this piece). */
export function Tile({ p, tall = false, eager = false, colour }: { p: Product; tall?: boolean; eager?: boolean; colour?: string | null }) {
  const pic = useRef<HTMLSpanElement>(null);
  const shown = p.colours.find((c) => c.name === colour) ?? p.colours[0];
  const href = `/products/${p.handle}${colour && shown.name === colour ? `?colour=${encodeURIComponent(colour)}` : ""}`;
  return (
    <VLink to={href} className="tile" onClick={() => { if (pic.current) pic.current.style.viewTransitionName = pieceVT(p.handle); }}>
      <span ref={pic} className={`pic ${tall ? "r23" : "r45"}`}><PiecePicture p={p} colour={shown} eager={eager} /></span>
      <span className="cap">
        <span className="t-name cap-name"><Name>{p.title}</Name>{store.isPreorder(p) ? ", pre-order" : ""}</span>
        <span>{gbp(p.price)}</span>
      </span>
    </VLink>
  );
}
