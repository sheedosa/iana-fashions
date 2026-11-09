import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Seo, breadcrumbs, absolute } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { Chevron, HijabArt, PhotoSlot, Swatches } from "../components/Art";
import { NotFound } from "./NotFound";
import { img, store, type Product } from "../lib/store";
import { RETURNS_LINE, SITE, gbp } from "../data/site";

function Gallery({ p, colour }: { p: Product; colour: Product["colours"][number] }) {
  const [active, setActive] = useState(0);
  useEffect(() => { setActive(0); }, [p.handle]);
  if (p.art) return <HijabArt art={p.art} colour={colour} className="aspect-[4/5] w-full rounded-pill" />;
  if (!p.images.length) return <PhotoSlot caption={p.slot ?? p.title} className="aspect-[4/5] w-full rounded-pill" />;
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-pill bg-sage"><img src={img(p.images[active])} alt={`${p.title}${p.images.length > 1 ? `, view ${active + 1} of ${p.images.length}` : ""}`} width="1100" height="1375" className="aspect-[4/5] w-full object-cover" /></div>
      {p.images.length > 1 && (
        <div className="flex gap-3">
          {p.images.map((im, i) => (
            <button key={im} type="button" onClick={() => setActive(i)} aria-label={`Show view ${i + 1}`} aria-pressed={i === active} className={`h-24 w-20 overflow-hidden rounded-pill border-2 ${i === active ? "border-ink" : "border-transparent"}`}>
              <img src={img(im, true)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductPage() {
  const { handle = "" } = useParams();
  const [params] = useSearchParams();
  const p = store.product(handle);
  const [colourName, setColourName] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  useEffect(() => { setSize(null); setColourName(null); }, [handle]);
  if (!p) return <NotFound />;

  const colour = p.colours.find((c) => c.name === (colourName ?? params.get("colour"))) ?? p.colours[0];
  const oneSize = p.sizes.length === 1;
  const pre = store.isPreorder(p);
  const pairs = store.pairs(p);
  const path = `/products/${p.handle}`;
  const home = p.collections.find((c) => c !== "new-in") ?? "all";
  const row = "flex items-baseline justify-between gap-4 border-b border-line py-3";

  return (
    <>
      <Seo title={p.title} path={path} type="product" image={p.images[0] ? `/img/${p.images[0]}.webp` : undefined}
        description={`${p.title} in ${p.fabric.toLowerCase()}, in ${p.colours.length} colours. ${store.isAbaya(p) ? "Can be taken up or amended in our Tooting shop. " : ""}From I&A Fashions, Tooting.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: p.type, path: `/shop/${home}` }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.details, ...(p.images.length ? { image: p.images.map((i) => absolute(`/img/${i}.webp`)) } : {}), material: p.fabric, color: p.colours.map((c) => c.name).join(", "), brand: { "@type": "Brand", name: SITE.name }, category: p.type }]} />

      <section className="wrap grid gap-x-14 gap-y-6 pb-16 pt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:pt-10">
        <div className="flex flex-col gap-2 lg:col-start-2 lg:row-start-1">
          <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · <Link to={`/shop/${home}`} className="underline">{p.type}</Link></nav>
          {pre && <p className="label self-start rounded-pill bg-ink px-2 py-1.5 text-[11px] text-paper">Pre-order</p>}
          <h1>{p.title}</h1>
          <p className="text-xl">{gbp(p.price)} <span className="text-base text-mute">sample price</span></p>
          <p className="text-mute">{p.fabric} · {p.colours.length} {p.colours.length === 1 ? "colour" : "colours"}</p>
        </div>

        <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1"><Gallery p={p} colour={colour} /></div>

        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-2">
          <div className="flex flex-col gap-2">
            <p className="label text-mute">Colour: <span className="normal-case tracking-normal text-ink">{colour.name}</span></p>
            <div className="-ml-1.5"><Swatches colours={p.colours} active={colour.name} onPick={(c) => setColourName(c.name)} size="lg" label="Colour" /></div>
          </div>

          {!oneSize && (
            <fieldset className="flex flex-col gap-2">
              <legend className="label mb-2 text-mute">Size</legend>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className={`h-11 min-w-14 rounded-pill border px-3 ${size === s ? "border-ink bg-ink text-paper" : "border-ink hover:bg-stone"}`}>{s}</button>)}
              </div>
            </fieldset>
          )}

          <div className="flex flex-col gap-2">
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink min-h-14 flex-col gap-0 py-2 leading-tight">
              <span>{pre ? "Call to pre-order" : "Call to reserve"}</span>
              <span className="text-[13px] normal-case tracking-normal text-on-ink">{SITE.phone}</span>
            </a>
            <p className="text-mute">Online ordering opens at launch. This is a sample product{pre ? "; pre-order dates are to be confirmed" : ""}.</p>
          </div>

          <div className="flex flex-col">
            <h2 className="label mb-1 text-mute">Delivery and collection</h2>
            <p className={row}><span>{SITE.delivery.standard.label}, {SITE.delivery.standard.time}</span><span>{gbp(SITE.delivery.standard.price)}</span></p>
            <p className={row}><span>{SITE.delivery.express.label}, {SITE.delivery.express.time}</span><span>{gbp(SITE.delivery.express.price)}</span></p>
            <p className={row}><span>Orders of {gbp(SITE.delivery.freeOver)} and over</span><span>Free</span></p>
            <p className={row}><span>{SITE.delivery.collect}</span></p>
          </div>

          <div>
            <details open className="border-b border-line">
              <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4">Details<Chevron /></summary>
              <p className="pb-4 text-mute">{p.details} {p.fabric}.</p>
            </details>
            {store.isAbaya(p) && (
              <details className="border-b border-line">
                <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4">Alterations in the shop<Chevron /></summary>
                <div className="flex flex-col gap-2 pb-4 text-mute">
                  <p>This abaya can be taken up or amended in our Tooting shop: hem, sleeves or sides. Try it on and we'll pin it with you.</p>
                  <p>Prices and turnaround: [ALTERATION PRICES AND TURNAROUND]. <Link to="/alterations" className="text-ink underline">Alterations and bespoke</Link></p>
                </div>
              </details>
            )}
            <details className="border-b border-line">
              <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4">Returns<Chevron /></summary>
              <p className="pb-4 text-mute">{RETURNS_LINE} <Link to="/delivery-returns" className="text-ink underline">Delivery and returns</Link></p>
            </details>
          </div>
        </div>
      </section>

      {pairs.length > 0 && (
        <section className="wrap pb-6">
          <h2 className="mb-6">Wear it with</h2>
          <div className="grid max-w-3xl grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6">{pairs.map((x) => <ProductCard key={x.handle} p={x} />)}</div>
        </section>
      )}
    </>
  );
}
