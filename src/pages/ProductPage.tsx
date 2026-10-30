import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs, absolute } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { NotFound } from "./NotFound";
import { img, store } from "../lib/store";
import { useLength } from "../lib/length";
import { LENGTHS, SITE, type LengthId } from "../data/site";

export function ProductPage() {
  const { handle = "" } = useParams();
  const p = store.product(handle);
  const { length: saved } = useLength();
  const [active, setActive] = useState(0);
  const [length, setLen] = useState<LengthId | null>(null);
  const [size, setSize] = useState<string | null>(null);
  useEffect(() => { setActive(0); setSize(null); setLen(null); }, [handle]);
  if (!p) return <NotFound />;

  const chosenLength = length ?? (saved && p.lengths.includes(saved) ? saved : null);
  const oneSize = p.sizes.length === 1;
  const related = store.products({ collection: p.collections[0] }).filter((x) => x.handle !== p.handle).slice(0, 4);
  const path = `/products/${p.handle}`;
  const lengthNote = p.lengths.length ? `Cut in ${p.lengths.map((l) => LENGTHS.find((x) => x.id === l)!.name).join(", ")}.` : "";

  return (
    <>
      <Seo title={p.title} path={path} type="product" image={`/img/${p.images[0]}.webp`}
        description={`${p.title} in ${p.fabric.toLowerCase()}. ${lengthNote} Try it on at I&A Fashions, Tooting.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: p.type, path: `/shop/${p.collections.find((c) => c !== "new-in") ?? "all"}` }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.details, image: p.images.map((i) => absolute(`/img/${i}.webp`)), material: p.fabric, color: p.colour, brand: { "@type": "Brand", name: SITE.name }, category: p.type }]} />

      <section className="wrap grid gap-10 pb-16 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-10">
        <div className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-pill bg-sage"><img src={img(p.images[active])} alt={`${p.title}, view ${active + 1} of ${p.images.length}`} width="1100" height="1375" className="aspect-[4/5] w-full object-cover" /></div>
          {p.images.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {p.images.map((im, i) => (
                <button key={im + i} type="button" onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} aria-pressed={i === active} className={`h-24 w-20 overflow-hidden rounded-pill border-2 ${i === active ? "border-ink" : "border-transparent"}`}>
                  <img src={img(im, !im.startsWith("hero/"))} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · <Link to={`/shop/${p.collections.find((c) => c !== "new-in") ?? "all"}`} className="underline">{p.type}</Link></nav>
          <div className="flex flex-col gap-2">
            <h1 className="text-[36px] sm:text-[44px]">{p.title}</h1>
            <p className="text-sm text-mute">{p.fabric} · {p.colour}{p.badge === "Pre-order" ? " · pre-order" : ""}</p>
          </div>

          {p.colours.length > 1 && (
            <div className="flex flex-col gap-2">
              <p className="label text-mute">Colours</p>
              <p className="text-sm">{p.colours.join(", ")}</p>
            </div>
          )}

          {p.lengths.length > 0 && (
            <fieldset className="flex flex-col gap-2">
              <div className="flex items-center justify-between"><legend className="label text-mute">Length</legend><Link to="/find-your-length" className="inline-flex min-h-11 items-center text-sm underline">How we measure</Link></div>
              <div className="grid grid-cols-3 gap-2">
                {LENGTHS.map((l) => {
                  const offered = p.lengths.includes(l.id);
                  const on = chosenLength === l.id;
                  return (
                    <button key={l.id} type="button" disabled={!offered} aria-pressed={on} onClick={() => setLen(l.id)}
                      className={`flex min-h-14 flex-col items-center justify-center rounded-pill border px-2 py-2 ${on ? "border-ink bg-ink text-paper" : offered ? "border-ink hover:bg-stone" : "border-line text-mute line-through"}`}>
                      <span className="text-sm font-normal">{l.name} {l.inches}"</span>
                      <span className={`text-xs ${on ? "text-[#e3d6da]" : "text-mute"}`}>{saved === l.id ? "your length" : l.fits}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {!oneSize && (
            <fieldset className="flex flex-col gap-2">
              <legend className="label mb-2 text-mute">Size</legend>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className={`h-11 min-w-14 rounded-pill border px-3 text-sm ${size === s ? "border-ink bg-ink text-paper" : "border-ink hover:bg-stone"}`}>{s}</button>)}
              </div>
            </fieldset>
          )}

          <div className="flex flex-col gap-3">
            <button type="button" disabled className="btn btn-ink min-h-14 cursor-not-allowed opacity-60">Online ordering opens at launch</button>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">Call the shop to reserve · {SITE.phone}</a>
            <p className="text-center text-sm text-mute">Concept preview: this is a sample product. Prices and stock come at launch.</p>
          </div>

          <div className="border-t border-line">
            <details open className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">Details</summary><p className="pb-4 text-mute">{p.details}</p></details>
            {p.lengths.length > 0 && <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">Length guide</summary><p className="pb-4 text-mute">Length is measured from the shoulder seam to the hem: {LENGTHS.map((l) => `${l.name} ${l.inches}"`).join(", ")}. Choose by height; the hem sits at the ankle in flat shoes.</p></details>}
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">Try it on in Tooting</summary><p className="pb-4 text-mute">Visit {SITE.address.street}, {SITE.address.postcode}, {SITE.hours}. Call {SITE.phone} and we'll put your length and size aside.</p></details>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap pb-6">
          <h2 className="mb-6 text-[32px] sm:text-[36px]">Complete the look</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{related.map((x) => <ProductCard key={x.handle} p={x} />)}</div>
        </section>
      )}
    </>
  );
}
