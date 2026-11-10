import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Tile } from "../components/Piece";
import { ColourWall } from "../components/ColourWall";
import { img, store } from "../lib/store";
import { SITE, gbp } from "../data/site";

export function Home() {
  const newIn = store.products({ collection: "new-in" });
  const fabrics = store.fabrics(store.products({ collection: "hijabs" }));
  const jersey = store.product("everyday-jersey-abaya");
  const cuff = store.product("embroidered-cuff-abaya");
  const eid = store.products({ collection: "eid" });

  return (
    <>
      <Seo title="Abayas, hijabs and co-ords, altered to fit in Tooting" path="/"
        description="New abayas every week, twenty hijab styles in five colours or more, and co-ords. Every abaya can be taken up or amended in our Tooting shop. Trading since 1993." />

      {/* The signature: the first screen is the hijab colour you choose. */}
      <ColourWall />

      {/* Hijabs by fabric: the sentence is the navigation. */}
      <section className="wrap py-14 sm:py-24" aria-labelledby="fabric-h">
        <h2 id="fabric-h" className="t-hero max-w-[12em]">
          Hijabs in{" "}
          {fabrics.map((f, i) => (
            <span key={f}>
              <Link to={`/shop/hijabs?fabric=${f}`} className="link decoration-pom !decoration-2 hover:!decoration-4">{f.toLowerCase()}</Link>
              {i < fabrics.length - 2 ? ", " : i === fabrics.length - 2 ? " or " : "."}
            </span>
          ))}
        </h2>
        <p className="lede mt-6">About twenty styles, each in five colours or more. Start with the fabric you like to wear.</p>
      </section>

      {/* New this week: tall pictures running off both edges. */}
      <section className="pb-16 sm:pb-28" aria-labelledby="new-h">
        <div className="wrap mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 sm:mb-8">
          <h2 id="new-h">New this week</h2>
          <p className="pb-1">Sample pieces and prices. <Link to="/shop/new-in" className="link tap">See all that's new</Link></p>
        </div>
        <div className="rail" tabIndex={0} role="region" aria-label="New pieces, swipe sideways">
          {newIn.map((p) => <Tile key={p.handle} p={p} tall />)}
        </div>
      </section>

      {/* Abayas: two pictures, the second set lower, with the alterations sentence between them. */}
      <section className="grid grid-cols-2 items-start gap-x-[var(--seam)] pb-16 sm:pb-28 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,4fr)] md:gap-x-0" aria-labelledby="abayas-h">
        {jersey && (
          <Link to={`/products/${jersey.handle}`} className="pic r23" aria-label={jersey.title}>
            <img src={img(jersey.images[0])} alt="Blush jersey abaya with a cream hijab falling down the back" loading="lazy" />
          </Link>
        )}
        <div className="order-last col-span-2 flex flex-col items-start gap-5 px-[var(--gutter)] pt-8 md:order-none md:col-span-1 md:px-[clamp(1.5rem,3.5vw,4rem)] md:pt-[clamp(2rem,6vw,6rem)]">
          <h2 id="abayas-h">Abayas</h2>
          <p className="t-sub">{SITE.alterations.summary}</p>
          <p>Try one on, show us what to change, and we pin it with you: the hem, the sleeves or the sides. {SITE.alterations.bespoke}</p>
          <Link to="/shop/abayas" className="btn">See the abayas</Link>
          <Link to="/alterations" className="link tap">How alterations work</Link>
        </div>
        {cuff && (
          <Link to={`/products/${cuff.handle}`} className="pic r23 mt-16 md:mt-[7.5rem]" aria-label={cuff.title}>
            <img src={img(cuff.images[0])} alt="Tonal embroidery on the cuff of a plum abaya" loading="lazy" />
          </Link>
        )}
      </section>

      {/* Co-ords: the top and the trousers side by side, running to the right edge. */}
      <section className="grid items-end gap-y-8 pb-16 sm:pb-28 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" aria-labelledby="coords-h">
        <div className="flex flex-col items-start gap-5 px-[var(--gutter)] md:pb-10">
          <h2 id="coords-h" className="t-hero">Co-ords</h2>
          <p className="lede">A long top and the trousers that go with it. Around ten sets, in cotton, jersey and polyester.</p>
          <Link to="/shop/co-ords" className="btn">See the co-ords</Link>
        </div>
        <Link to="/products/cotton-co-ord" className="order-first grid grid-cols-2 md:order-none" aria-label="Cotton co-ord set">
          <span className="pic r23"><img src={img("looks/sage-linen")} alt="Sage cotton tunic with a matching hijab draped over one shoulder" loading="lazy" /></span>
          <span className="pic r23"><img src={img("looks/sage-linen-trousers")} alt="The matching wide sage trousers under the tunic hem" loading="lazy" /></span>
        </Link>
      </section>

      {/* Eid pre-order: the embroidered abaya down one side of a Light Pink field. */}
      <section className="grid bg-pink md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" aria-labelledby="eid-h">
        <div className="pic aspect-[4/5] md:aspect-auto md:min-h-[44rem]">
          <img src={img("looks/plum-occasion")} alt="The back of a plum abaya with tonal embroidery across the yoke" loading="lazy" className="object-top" />
        </div>
        <div className="flex flex-col items-start justify-center gap-5 px-[var(--gutter)] py-12 md:px-[clamp(2rem,6vw,7rem)]">
          <h2 id="eid-h" className="t-hero">Eid pre-order</h2>
          <p className="lede">{SITE.preorders}</p>
          <p>Pre-orders open [EID PRE-ORDER DATES].</p>
          <ul className="flex w-full max-w-md flex-col py-2">
            {eid.map((p) => (
              <li key={p.handle}>
                <Link to={`/products/${p.handle}`} className="flex min-h-11 items-baseline justify-between gap-4 hover:underline">
                  <span className="t-sub">{p.title}</span><span>{gbp(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p>Sample pieces and prices.</p>
          <Link to="/shop/eid" className="btn">See the Eid pieces</Link>
        </div>
      </section>
    </>
  );
}
