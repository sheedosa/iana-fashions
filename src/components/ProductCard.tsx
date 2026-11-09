import { useState } from "react";
import { Link } from "react-router-dom";
import { cardImg, type Product } from "../lib/store";
import { gbp } from "../data/site";
import { HijabArt, PhotoSlot, Swatches } from "./Art";

function Badge({ p }: { p: Product }) {
  if (!p.badge) return null;
  return <span className={`label absolute left-3 top-3 rounded-pill px-2 py-1.5 text-[11px] ${p.badge === "Pre-order" ? "bg-ink text-paper" : "bg-paper text-ink"}`}>{p.badge}</span>;
}

export function Price({ p, className = "" }: { p: Product; className?: string }) {
  return <span className={className}>{gbp(p.price)} <span className="text-mute">sample price</span></span>;
}

export function ProductCard({ p, eager = false }: { p: Product; eager?: boolean }) {
  const [colour, setColour] = useState(p.colours[0]);
  const href = `/products/${p.handle}`;

  if (p.art) {
    // Hijabs: the drawing follows the colour picked under the card.
    return (
      <div className="flex flex-col gap-2.5">
        <Link to={`${href}?colour=${encodeURIComponent(colour.name)}`} className="group flex flex-col gap-2.5">
          <div className="relative overflow-hidden rounded-pill">
            <HijabArt art={p.art} colour={colour} className="aspect-[4/5] w-full" />
            <Badge p={p} />
          </div>
          <h3 className="group-hover:underline">{p.title}</h3>
        </Link>
        <p className="-mt-1.5 text-base"><Price p={p} /></p>
        <p className="-mt-1.5 text-sm text-mute">{p.fabric} · {colour.name} · {p.colours.length} colours</p>
        <div className="-ml-2.5"><Swatches colours={p.colours} active={colour.name} onPick={setColour} label={`${p.title} colours`} /></div>
      </div>
    );
  }

  return (
    <Link to={href} className="lift group flex flex-col gap-2.5">
      <div className="relative overflow-hidden rounded-pill bg-sage">
        {p.images[0]
          ? <img src={cardImg(p.images[0])} alt="" loading={eager ? "eager" : "lazy"} width="560" height="700" className="aspect-[4/5] w-full object-cover" />
          : <PhotoSlot caption={p.slot ?? p.title} className="aspect-[4/5] w-full" />}
        <Badge p={p} />
      </div>
      <h3 className="group-hover:underline">{p.title}</h3>
      <p className="-mt-1.5 text-base"><Price p={p} /></p>
      <div className="-mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-mute">
        <span>{p.fabric}</span>
        <Swatches colours={p.colours} label={`${p.title} colours`} />
      </div>
    </Link>
  );
}
