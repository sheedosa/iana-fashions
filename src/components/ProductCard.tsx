import { useRef } from "react";
import { cardImg, type Product } from "../lib/store";
import { gbp } from "../data/site";
import { HijabArt, PhotoSlot, Swatches } from "./Art";
import { VLink, pieceVT } from "./VLink";

function Badge({ p }: { p: Product }) {
  if (!p.badge) return null;
  return <span className={`tag absolute left-3 top-3 ${p.badge === "Pre-order" ? "bg-ink text-paper" : "bg-paper text-ink"}`}>{p.badge}</span>;
}

export function Price({ p, className = "" }: { p: Product; className?: string }) {
  return <span className={className}>{gbp(p.price)} <span className="text-mute">sample price</span></span>;
}

/** A piece in a listing. Hijabs are drawn in `colour` when the listing is filtered to one, otherwise in their first colour. */
export function ProductCard({ p, eager = false, colour }: { p: Product; eager?: boolean; colour?: string | null }) {
  const pic = useRef<HTMLDivElement>(null);
  const shown = p.colours.find((c) => c.name === colour) ?? p.colours[0];
  const href = `/products/${p.handle}${colour && shown.name === colour ? `?colour=${encodeURIComponent(colour)}` : ""}`;
  const n = p.colours.length;

  return (
    <VLink to={href} className="group relative flex flex-col gap-3" onClick={() => { if (pic.current) pic.current.style.viewTransitionName = pieceVT(p.handle); }}>
      <div ref={pic} className="relative overflow-hidden rounded-pill bg-sage">
        {p.art
          ? <HijabArt art={p.art} colour={shown} className="aspect-[4/5] w-full" />
          : p.images[0]
            ? <img src={cardImg(p.images[0])} alt="" loading={eager ? "eager" : "lazy"} width="560" height="700" className="aspect-[4/5] w-full object-cover" />
            : <PhotoSlot caption={p.slot ?? p.title} className="aspect-[4/5] w-full" />}
        <Badge p={p} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="t-card group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{p.title}</h3>
        <p><Price p={p} /></p>
        <div className="small flex flex-col gap-1.5 text-mute">
          <span>{p.fabric}{p.art ? `, shown in ${shown.name.toLowerCase()}` : `, ${n} ${n === 1 ? "colour" : "colours"}`}</span>
          <Swatches colours={p.colours} size="sm" label={`${p.title} colours`} />
        </div>
      </div>
    </VLink>
  );
}
