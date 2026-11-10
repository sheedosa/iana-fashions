import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Seo, breadcrumbs, absolute } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { Chevron, HijabArt, PhotoSlot, Swatches } from "../components/Art";
import { pieceVT } from "../components/VLink";
import { NotFound } from "./NotFound";
import { img, store, type Product } from "../lib/store";
import { RETURNS_LINE, SITE, gbp } from "../data/site";

function Gallery({ p, colour }: { p: Product; colour: Product["colours"][number] }) {
  const [active, setActive] = useState(0);
  useEffect(() => { setActive(0); }, [p.handle]);
  const vt = { viewTransitionName: pieceVT(p.handle) };
  if (p.art) return <HijabArt art={p.art} colour={colour} className="aspect-[4/5] w-full rounded-pill md:max-h-[calc(100dvh-6.5rem)]" style={vt} />;
  if (!p.images.length) return <div style={vt}><PhotoSlot caption={p.slot ?? p.title} className="aspect-[4/5] w-full rounded-pill md:max-h-[calc(100dvh-6.5rem)]" /></div>;
  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse md:flex-col lg:flex-row-reverse">
      <div className="min-w-0 flex-1 overflow-hidden rounded-pill bg-sage" style={vt}><img src={img(p.images[active])} alt={`${p.title}${p.images.length > 1 ? `, view ${active + 1} of ${p.images.length}` : ""}`} width="1100" height="1375" className="aspect-[6/7] w-full object-cover object-top sm:aspect-[4/5] md:max-h-[calc(100dvh-6.5rem)]" /></div>
      {p.images.length > 1 && (
        <div className="flex gap-3 sm:flex-col md:flex-row lg:flex-col">
          {p.images.map((im, i) => (
            <button key={im} type="button" onClick={() => setActive(i)} aria-label={`Show view ${i + 1}`} aria-pressed={i === active} className={`h-24 w-20 overflow-hidden rounded-pill border ${i === active ? "border-ink" : "border-transparent"}`}>
              <img src={img(im, true)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** True while the element is on screen, or still below it (not yet scrolled past). */
function useOnScreen<T extends Element>(selector?: string) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(true);
  useEffect(() => {
    const el = selector ? document.querySelector(selector) : ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting || (!selector && e.boundingClientRect.top > 0)));
    io.observe(el);
    return () => io.disconnect();
  }, [selector]);
  return [ref, on] as const;
}

export function ProductPage() {
  const { handle = "" } = useParams();
  const [params] = useSearchParams();
  const p = store.product(handle);
  const [colourName, setColourName] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [buyRef, buyOn] = useOnScreen<HTMLAnchorElement>();
  const [, footerOn] = useOnScreen("footer");
  useEffect(() => { setSize(null); setColourName(null); }, [handle]);
  if (!p) return <NotFound />;

  const colour = p.colours.find((c) => c.name === (colourName ?? params.get("colour"))) ?? p.colours[0];
  const oneSize = p.sizes.length === 1;
  const pre = store.isPreorder(p);
  const pairs = store.pairs(p);
  const path = `/products/${p.handle}`;
  const home = p.collections.find((c) => c !== "new-in") ?? "all";
  const action = pre ? "Call to pre-order" : "Call to reserve";
  const n = p.colours.length;
  const barOn = !buyOn && !footerOn;

  return (
    <>
      <Seo title={p.title} path={path} type="product" image={p.images[0] ? `/img/${p.images[0]}.webp` : undefined}
        description={`${p.title} in ${p.fabric.toLowerCase()}, in ${p.colours.length} colours. ${store.isAbaya(p) ? "Can be taken up or amended in our Tooting shop. " : ""}From I&A Fashions, Tooting.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: p.type, path: `/shop/${home}` }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.details, ...(p.images.length ? { image: p.images.map((i) => absolute(`/img/${i}.webp`)) } : {}), material: p.fabric, color: p.colours.map((c) => c.name).join(", "), brand: { "@type": "Brand", name: SITE.name }, category: p.type }]} />

      <div className="wrap pt-3 sm:pt-5">
        <nav aria-label="Breadcrumb">
          <ol className="small flex flex-wrap items-center gap-x-2 text-mute">
            <li><Link to="/" className="link tap">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to={`/shop/${home}`} className="link tap">{p.type}</Link></li>
          </ol>
        </nav>
      </div>

      <section className="wrap grid gap-x-8 gap-y-6 pb-16 pt-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:gap-x-16 lg:pb-24 lg:pt-3">
        <div className="self-start md:sticky md:top-[5.25rem]"><Gallery p={p} colour={colour} /></div>

        <div className="flex flex-col gap-7 lg:max-w-[32rem] lg:pt-4">
          <div className="flex flex-col gap-2">
            {pre && <p className="tag self-start bg-ink text-paper">Pre-order</p>}
            <h1>{p.title}</h1>
            <p className="voice" aria-live="polite">in {colour.name.toLowerCase()}</p>
            <p className="pt-1 text-xl">{gbp(p.price)} <span className="text-base text-mute">sample price</span></p>
            <p className="text-mute">{p.fabric}, {n} {n === 1 ? "colour" : "colours"}{!p.art && p.images.length > 0 && colour.name !== p.colours[0].name ? `. Photographed in ${p.colours[0].name.toLowerCase()}.` : ""}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="label text-mute">Colour</p>
            <div className="-ml-1"><Swatches colours={p.colours} active={colour.name} onPick={(c) => setColourName(c.name)} size="lg" label="Colour" /></div>
          </div>

          {!oneSize && (
            <fieldset className="flex flex-col">
              <legend className="label mb-2.5 text-mute">Size</legend>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className="chip min-w-14 justify-center !text-base hover:bg-stone aria-pressed:hover:bg-ink">{s}</button>)}
              </div>
              {store.isAbaya(p) && (
                <p className="pt-3.5">This abaya can be taken up or amended in our Tooting shop: hem, sleeves or sides. Try it on and we'll pin it with you. <Link to="/alterations" className="link">How alterations work</Link></p>
              )}
            </fieldset>
          )}

          <div className="flex flex-col gap-2.5">
            <a ref={buyRef} href={`tel:${SITE.phoneIntl}`} className="btn btn-ink min-h-14 flex-col gap-0.5 py-2.5">
              <span>{action}</span>
              <span className="small font-normal text-on-ink">{SITE.phone}</span>
            </a>
            <p className="text-mute">Online ordering opens at launch. This is a sample product{pre ? "; pre-order dates are to be confirmed" : ""}.</p>
          </div>

          <div>
            <h2 className="label mb-2 text-mute">Delivery and collection</h2>
            <div className="rows">
              <p><span>{SITE.delivery.standard.label}, {SITE.delivery.standard.time}</span><span>{gbp(SITE.delivery.standard.price)}</span></p>
              <p><span>{SITE.delivery.express.label}, {SITE.delivery.express.time}</span><span>{gbp(SITE.delivery.express.price)}</span></p>
              <p><span>Orders of {gbp(SITE.delivery.freeOver)} and over</span><span>Free</span></p>
              <p><span>{SITE.delivery.collect}</span></p>
            </div>
          </div>

          <div>
            <details open className="border-b border-line">
              <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 font-medium">Details<Chevron /></summary>
              <p className="pb-4 text-mute">{p.details} {p.fabric}.</p>
            </details>
            {store.isAbaya(p) && (
              <details className="border-b border-line">
                <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 font-medium">Alteration prices and turnaround<Chevron /></summary>
                <p className="pb-4 text-mute">Prices and turnaround: [ALTERATION PRICES AND TURNAROUND]. <Link to="/alterations" className="link text-ink">Alterations and bespoke</Link></p>
              </details>
            )}
            <details className="border-b border-line">
              <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 font-medium">Returns<Chevron /></summary>
              <p className="pb-4 text-mute">{RETURNS_LINE} <Link to="/delivery-returns" className="link text-ink">Delivery and returns</Link></p>
            </details>
          </div>
        </div>
      </section>

      {pairs.length > 0 && (
        <section className="border-t border-line" aria-labelledby="pairs-h">
          <div className="wrap grid gap-x-12 gap-y-6 py-12 sm:py-16 lg:grid-cols-[17rem_minmax(0,1fr)]">
            <h2 id="pairs-h">Wear it with</h2>
            <div className="grid max-w-2xl grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6">{pairs.map((x) => <ProductCard key={x.handle} p={x} />)}</div>
          </div>
        </section>
      )}

      {/* Phone: price and the action stay in reach once the main button has scrolled away. */}
      <div className="buybar" data-on={barOn} inert={!barOn} aria-label="Reserve">
        <p className="min-w-0 leading-tight">
          <span className="block truncate font-medium">{p.title}, {colour.name.toLowerCase()}</span>
          <span className="small">{gbp(p.price)} <span className="text-mute">sample price</span></span>
        </p>
        <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink shrink-0 px-4">{action}</a>
      </div>
    </>
  );
}
