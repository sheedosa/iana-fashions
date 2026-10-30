import { Link } from "react-router-dom";
import { cardImg, type Product } from "../lib/store";
import { LENGTHS } from "../data/site";

export function ProductCard({ p, eager = false }: { p: Product; eager?: boolean }) {
  const lengths = p.lengths.length ? p.lengths.map((l) => LENGTHS.find((x) => x.id === l)!.name).join(", ") : "One length";
  return (
    <Link to={`/products/${p.handle}`} className="lift group flex flex-col gap-2.5">
      <div className="relative overflow-hidden rounded-pill bg-sage">
        <img src={cardImg(p.images[0])} alt="" loading={eager ? "eager" : "lazy"} width="560" height="700" className="aspect-[4/5] w-full object-cover" />
        {p.badge && <span className={`label absolute left-3 top-3 rounded-pill px-2 py-1.5 text-[11px] ${p.badge === "Pre-order" ? "bg-ink text-paper" : "bg-paper"}`}>{p.badge}</span>}
      </div>
      <h3 className="text-base group-hover:underline">{p.title}{p.colours.length === 1 ? "" : `, ${p.colour.toLowerCase()}`}</h3>
      <p className="-mt-1.5 text-sm text-mute">{p.fabric} · {lengths}</p>
    </Link>
  );
}
