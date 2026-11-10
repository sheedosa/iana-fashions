import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Seo, breadcrumbs, absolute } from "../components/Seo";
import { Name, PiecePicture, Tile } from "../components/Piece";
import { Drape, PhotoSlot, Swatches, tint } from "../components/Art";
import { pieceVT } from "../components/VLink";
import { NotFound } from "./NotFound";
import { img, store, type Colour, type Product } from "../lib/store";
import { SITE, gbp } from "../data/site";

/** The pictures of a piece, one under the other; the page scrolls them past the panel. On phones they swipe sideways. */
function Stack({ p, colour }: { p: Product; colour: Colour }) {
  const vt = { viewTransitionName: pieceVT(p.handle) };
  const drawn = !!p.art || !!store.coordArt(p);
  const more = p.images.slice(1);
  const many = drawn || more.length > 0;
  return (
    <div className="pstack" data-many={many} tabIndex={many ? 0 : undefined} role={many ? "region" : undefined} aria-label={many ? "Pictures" : undefined}>
      <div className={`pic ${drawn ? "r45" : "r23"}`} style={vt}>
        <PiecePicture p={p} colour={colour} large eager alt={`${p.title}${drawn ? "" : `, photographed in ${p.colours[0].name.toLowerCase()}`}`} />
      </div>
      {more.map((im) => <div key={im} className="pic r45"><img src={img(im)} alt={`${p.title}, the cloth close up`} loading="lazy" /></div>)}
      {p.art && (
        <div className="pic r23" style={{ background: tint(colour.hex, 0.14), color: "#45353a" }}>
          <div className="grid place-items-center p-[12%]"><Drape colour={colour} className="!h-full !max-h-none !w-auto" /></div>
        </div>
      )}
      {store.coordArt(p) && <div className="pic r45"><PhotoSlot caption={p.slot ?? p.title} /></div>}
    </div>
  );
}

/** True while the element is on screen. */
function useOnScreen<T extends Element>(selector?: string) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(true);
  useEffect(() => {
    const el = selector ? document.querySelector(selector) : ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting));
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
  const lower = colour.name.toLowerCase();
  const oneSize = p.sizes.length === 1;
  const pre = store.isPreorder(p);
  const abaya = store.isAbaya(p);
  const pairs = store.pairs(p);
  const path = `/products/${p.handle}`;
  const home = p.collections.find((c) => c !== "new-in") ?? "all";
  const action = pre ? "Call to pre-order" : "Call to reserve";
  const photographed = !p.art && !store.coordArt(p) && p.images.length > 0;
  const barOn = !buyOn && !footerOn;
  const d = SITE.delivery;

  return (
    <>
      <Seo title={p.title} path={path} type="product" image={p.images[0] ? `/img/${p.images[0]}.webp` : undefined}
        description={`${p.title} in ${p.fabric.toLowerCase()}, in ${p.colours.length} colours. ${abaya ? "Can be taken up or amended in our Tooting shop. " : ""}From I&A Fashions, Tooting.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: p.type, path: `/shop/${home}` }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.details, ...(p.images.length ? { image: p.images.map((i) => absolute(`/img/${i}.webp`)) } : {}), material: p.fabric, color: p.colours.map((c) => c.name).join(", "), brand: { "@type": "Brand", name: SITE.name }, category: p.type }]} />

      <div className="first">
        <section className="ppage">
          <Stack p={p} colour={colour} />

          <div className="ppanel">
            <div className="ppanel-in flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <nav aria-label="Breadcrumb"><Link to={`/shop/${home}`} className="link tap">{p.type}</Link></nav>
                <h1><Name>{p.title}</Name></h1>
                <p className="colour-name pt-1" aria-live="polite">in {lower}</p>
                <p className="pt-2 text-xl">{gbp(p.price)} <span className="text-base text-mute">sample price{pre ? ", pre-order" : ""}</span></p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="-ml-1"><Swatches colours={p.colours} active={colour.name} onPick={(c) => setColourName(c.name)} label="Colour" /></div>
                {photographed && colour.name !== p.colours[0].name && <p className="text-mute">Photographed in {p.colours[0].name.toLowerCase()}.</p>}
              </div>

              {!oneSize && (
                <div className="-ml-3 flex flex-wrap gap-1" role="group" aria-label="Size">
                  {p.sizes.map((s) => <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className="size">{s}</button>)}
                </div>
              )}

              <a ref={buyRef} href={`tel:${SITE.phoneIntl}`} className="btn min-h-16 flex-col gap-0.5 py-2.5">
                <span>{action}{size ? `, size ${size}` : ""}</span>
                <span className="small font-normal">{SITE.phone}</span>
              </a>

              <div className="flex flex-col gap-3">
                {abaya && <p>This abaya can be taken up or amended in our Tooting shop: the hem, the sleeves or the sides. <Link to="/alterations" className="link">How alterations work</Link></p>}
                <p>Delivery {gbp(d.standard.price)}, free on orders of {gbp(d.freeOver)} and over, or collect in Tooting. {SITE.returns.days}-day returns. <Link to="/delivery-returns" className="link">Delivery and returns</Link></p>
                <p className="text-mute">Online ordering opens at launch. This is a sample product{pre ? "; pre-order dates are to be confirmed" : ""}.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="wrap grid gap-x-16 gap-y-5 py-14 sm:py-24 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" aria-labelledby="details-h">
        <h2 id="details-h">The details</h2>
        <div className="prose-w flex flex-col gap-4 md:pt-3">
          <p className="lede">{p.details}</p>
          <p>{p.fabric}. {oneSize ? "One size." : `Sizes ${p.sizes[0]} to ${p.sizes[p.sizes.length - 1]}.`}</p>
          {abaya && <p>Alteration prices and turnaround: [ALTERATION PRICES AND TURNAROUND].</p>}
        </div>
      </section>

      {pairs.length > 0 && (
        <section className="pb-16 sm:pb-24" aria-labelledby="pairs-h">
          <h2 id="pairs-h" className="wrap mb-6 sm:mb-8">Wear it with</h2>
          <div className="grid grid-cols-2 gap-x-[var(--seam)] md:grid-cols-[minmax(0,4fr)_minmax(0,4fr)_minmax(0,3fr)]">
            {pairs.map((x, i) => <div key={x.handle} className={i === 1 ? "pt-10 md:pt-24" : ""}><Tile p={x} tall={i === 0} /></div>)}
          </div>
        </section>
      )}

      {/* Phone: price and the action stay in reach whenever the main button is off screen, and step aside for the footer. */}
      <div className="buybar" data-on={barOn} inert={!barOn} aria-label="Reserve">
        <p className="min-w-0 leading-tight">
          <span className="block truncate font-medium">{p.title}, {lower}</span>
          <span className="small">{gbp(p.price)} sample price</span>
        </p>
        <a href={`tel:${SITE.phoneIntl}`} className="btn shrink-0 px-4">{action}</a>
      </div>
    </>
  );
}
