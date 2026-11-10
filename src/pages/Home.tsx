import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { ColourWall } from "../components/ColourWall";
import { img, store } from "../lib/store";
import { SITE } from "../data/site";

export function Home() {
  const newIn = store.products({ collection: "new-in" });
  return (
    <>
      <Seo title="Abayas, hijabs and co-ords, altered to fit in Tooting" path="/"
        description="New abayas every week, twenty hijab styles in five colours or more, and co-ords. Every abaya can be taken up or amended in our Tooting shop. Trading since 1993." />

      {/* The signature: the hijab colour wall. */}
      <ColourWall />

      {/* New this week: a rail that runs off the right edge. */}
      <section className="border-t border-line py-12 sm:py-16" aria-labelledby="new-h">
        <div className="new-grid">
          <div className="new-head flex flex-col gap-3">
            <h2 id="new-h">New this week</h2>
            <p className="text-mute">New stock arrives every week or month, so the rail changes often.</p>
            <Link to="/shop/new-in" className="link tap self-start">See all new pieces</Link>
          </div>
          <div className="rail" tabIndex={0} role="region" aria-label="New pieces, scroll sideways">
            {newIn.map((p) => <ProductCard key={p.handle} p={p} />)}
          </div>
        </div>
      </section>

      {/* Abayas and the promise: made to fit you. */}
      <section className="split bg-sage" aria-labelledby="abayas-h">
        <picture>
          <source media="(max-width: 767px)" srcSet={img("hero/hallway-mobile")} />
          <img src={img("hero/hallway")} alt="A woman seen from behind walking through a bright hallway in a plum open abaya over a sage dress" loading="lazy" width="2000" height="1116"
            className="h-[22rem] w-full object-cover object-[50%_35%] sm:h-[28rem] lg:h-full lg:min-h-[38rem] lg:object-[68%_50%]" />
        </picture>
        <div className="split-text flex flex-col justify-center gap-5">
          <h2 id="abayas-h">Every abaya, altered to fit you in Tooting.</h2>
          <p className="lede">Try it on in the shop, show us what needs changing, and we do the rest: hems taken up, sleeves shortened, sides taken in.</p>
          <p>About ten abayas at a time, changing often. <b>Bespoke abayas are coming soon.</b> Leave your name on the alterations page and we'll tell you first.</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link to="/shop/abayas" className="btn btn-ink">Shop abayas</Link>
            <Link to="/alterations" className="btn btn-ghost">Alterations and bespoke</Link>
          </div>
          <p>Or call the shop on <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a>.</p>
        </div>
      </section>

      {/* Co-ords, as the pair they are. */}
      <section className="wrap-narrow grid items-end gap-8 py-14 sm:py-20 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-12" aria-labelledby="coords-h">
        <div className="flex flex-col gap-4 md:pb-6">
          <h2 id="coords-h">Co-ords</h2>
          <p className="voice">A top and trousers, cut to go together.</p>
          <p className="text-mute">Matching sets in cotton, jersey and polyester.</p>
          <Link to="/shop/co-ords" className="btn btn-ghost self-start">Shop co-ords</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <img src={img("looks/sage-linen", true)} alt="A sage linen co-ord top with a matching hijab, shown from the shoulders down" loading="lazy" width="560" height="695" className="aspect-[4/5] w-full rounded-pill object-cover object-top" />
          <img src={img("looks/sage-linen-trousers", true)} alt="The matching wide sage linen trousers" loading="lazy" width="560" height="700" className="mt-10 aspect-[4/5] w-full rounded-pill object-cover sm:mt-16" />
        </div>
      </section>

      {/* Eid pre-order: a full-bleed Light Pink band. */}
      <section className="bg-pink" aria-labelledby="eid-h">
        <div className="wrap grid items-center gap-8 py-12 sm:py-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-14 md:py-0">
          <div className="flex flex-col gap-4 md:py-20">
            <h2 id="eid-h" className="t-hero">Eid pre-orders</h2>
            <p className="lede">We take pre-orders for Eid and for new collections, so the piece you want is waiting for you when it lands.</p>
            <p>Pre-orders open [EID PRE-ORDER DATES].</p>
            <Link to="/shop/eid" className="btn btn-ink self-start">See the Eid pieces</Link>
          </div>
          <img src={img("looks/plum-occasion", true)} alt="A plum embroidered abaya, seen from behind in a stone courtyard" loading="lazy" width="560" height="695" className="aspect-[4/5] w-full max-w-md rounded-pill object-cover object-[50%_30%] md:-my-8 md:justify-self-end" />
        </div>
      </section>

      {/* The shop. */}
      <section className="split split-flip mt-14 sm:mt-24" aria-labelledby="visit-h">
        <div className="split-text flex flex-col justify-center gap-4 lg:justify-self-end">
          <h2 id="visit-h">Try it on, then we fit it.</h2>
          <p className="lede">{SITE.address.street}, {SITE.address.area} {SITE.address.postcode}. Open {SITE.hours}.</p>
          <Link to="/visit" className="btn btn-ghost self-start">Plan a visit</Link>
        </div>
        <picture className="order-first lg:order-none">
          <source media="(max-width: 767px)" srcSet={img("hero/street-mobile")} />
          <img src={img("hero/street")} alt="Two women seen from behind on a south London street, in sage and pink" loading="lazy" width="2000" height="1116" className="h-[20rem] w-full object-cover sm:h-[26rem] lg:h-full lg:min-h-[30rem]" />
        </picture>
      </section>
    </>
  );
}
