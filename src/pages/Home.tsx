import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { AlterationsFigure } from "../components/Art";
import { img, store } from "../lib/store";
import { SITE } from "../data/site";

const HIJAB_PICKS = ["crinkle-cotton-hijab", "square-cotton-hijab", "instant-jersey-hijab", "premium-jersey-hijab"];

export function Home() {
  const newIn = store.products({ collection: "new-in" }).slice(0, 4);
  const hijabs = HIJAB_PICKS.map((h) => store.product(h)).filter((p) => !!p);
  return (
    <>
      <Seo title="Abayas, hijabs and co-ords, altered to fit in Tooting" path="/"
        description="New abayas every week, twenty hijab styles in five colours or more, and co-ords. Every abaya can be taken up or amended in our Tooting shop. Trading since 1993." />

      {/* Hero: words first on phones, the photograph beneath; card over the photograph from md up. */}
      <section className="relative flex flex-col bg-stone md:min-h-[640px] md:justify-end">
        <picture className="order-2 md:order-none">
          <source media="(max-width: 767px)" srcSet={img("hero/hallway-mobile")} />
          <img src={img("hero/hallway")} alt="A woman seen from behind walking through a bright hallway in a plum open abaya over a sage dress" fetchPriority="high"
            className="h-[440px] w-full object-cover object-[50%_40%] md:absolute md:inset-0 md:h-full md:object-[65%_50%]" />
        </picture>
        <div className="relative md:mx-auto md:w-full md:max-w-[1320px] md:px-8 order-1 md:order-none md:pb-14">
          <div className="flex max-w-xl flex-col gap-4 bg-paper px-4 pb-7 pt-6 md:rounded-pill md:p-10">
            <p className="label text-mute">New in every week · Tooting, since {SITE.since}</p>
            <h1>New abayas every week, altered to fit you in Tooting.</h1>
            <p className="text-[17px] text-mute">Pick your abaya, hijab or co-ord. If the hem or sleeves need taking up, we amend it in the shop.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/shop/new-in" className="btn btn-ink">Shop new this week</Link>
              <Link to="/alterations" className="btn btn-pink">How alterations work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hijabs lead: the biggest category. */}
      <section className="wrap grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div className="flex flex-col gap-5">
          <p className="label text-mute">Hijabs</p>
          <h2>Twenty styles, each in five colours or more.</h2>
          <p className="max-w-md text-mute">Cotton, jersey and polyester, from everyday jersey to a satin finish for Eid. Pick a colour under any style to see it.</p>
          <img src={img("products/hijab-stack")} alt="Five folded hijabs in sage, pink, cream, plum and charcoal on a cloth" loading="lazy" width="1100" height="1366" className="hidden aspect-[4/5] w-full max-w-md rounded-pill object-cover lg:block" />
          <Link to="/shop/hijabs" className="btn btn-ink self-start">Browse all hijabs</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 lg:self-center">
          {hijabs.map((p) => <ProductCard key={p.handle} p={p} />)}
        </div>
      </section>

      <section className="border-y border-line py-14 sm:py-16">
        <div className="wrap">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div className="flex flex-col gap-2">
              <h2>New this week</h2>
              <p className="text-mute">New stock arrives every week or month, so the rail changes often.</p>
            </div>
            <Link to="/shop/new-in" className="label inline-flex min-h-11 items-center underline">See all new pieces</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{newIn.map((p) => <ProductCard key={p.handle} p={p} />)}</div>
        </div>
      </section>

      {/* The core idea: made to fit you. */}
      <section className="bg-sage py-16 sm:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-5">
            <p className="label text-mute">Made to fit you</p>
            <h2>Every abaya, taken up or amended in the shop.</h2>
            <p className="max-w-lg text-[17px]">Try it on in Tooting, show us what needs changing, and we do the rest: hems taken up, sleeves shortened, sides taken in.</p>
            <p className="max-w-lg text-[17px]"><b>Bespoke abayas are coming soon.</b> Leave your name on the alterations page and we'll tell you first.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/alterations" className="btn btn-ink">Alterations and bespoke</Link>
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">Call {SITE.phone}</a>
            </div>
          </div>
          <div className="rounded-pill bg-paper p-6 sm:p-10">
            <AlterationsFigure className="mx-auto w-full max-w-md" />
          </div>
        </div>
      </section>

      {/* Eid pre-order. */}
      <section className="wrap py-16 sm:py-20">
        <div className="grid overflow-hidden rounded-pill bg-ink text-paper md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <img src={img("looks/plum-occasion", true)} alt="A plum embroidered abaya, seen from behind in a stone courtyard" loading="lazy" width="560" height="695" className="aspect-[4/3] h-full w-full object-cover object-[50%_30%] md:aspect-auto" />
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-12">
            <p className="label text-on-ink">Pre-order</p>
            <h2>Eid pre-orders</h2>
            <p className="text-on-ink">We take pre-orders for Eid and for new collections, so the piece you want is waiting for you when it lands.</p>
            <p className="text-on-ink">Pre-orders open [EID PRE-ORDER DATES].</p>
            <Link to="/shop/eid" className="btn btn-pink self-start">See the Eid pieces</Link>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-6 pb-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Link to="/shop/abayas" className="lift group flex flex-col overflow-hidden rounded-pill bg-stone">
          <div className="overflow-hidden"><img src={img("looks/embroidered-cuff")} alt="" loading="lazy" width="1100" height="1366" className="aspect-[4/3] w-full object-cover object-[50%_45%]" /></div>
          <div className="flex flex-col gap-1 p-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <span className="display text-[30px] group-hover:underline">Abayas</span>
            <span className="text-mute">About ten at a time, changing often</span>
          </div>
        </Link>
        <Link to="/shop/co-ords" className="lift group flex flex-col overflow-hidden rounded-pill bg-sage">
          <div className="overflow-hidden"><img src={img("looks/sage-linen", true)} alt="" loading="lazy" width="560" height="695" className="aspect-[4/3] w-full object-cover object-[50%_35%] md:aspect-[5/4]" /></div>
          <div className="flex flex-col gap-1 p-5">
            <span className="display text-[30px] group-hover:underline">Co-ords</span>
            <span className="text-mute">Matching sets in cotton, jersey and polyester</span>
          </div>
        </Link>
      </section>

      <section className="relative flex flex-col bg-stone md:min-h-[460px] md:justify-center">
        <picture>
          <source media="(max-width: 767px)" srcSet={img("hero/street-mobile")} />
          <img src={img("hero/street")} alt="Two women seen from behind on a south London street, in sage and pink" loading="lazy" className="h-[360px] w-full object-cover md:absolute md:inset-0 md:h-full" />
        </picture>
        <div className="relative md:mx-auto md:w-full md:max-w-[1320px] md:px-8 md:py-10">
          <div className="flex max-w-lg flex-col gap-3 bg-paper p-6 md:rounded-pill md:p-10">
            <p className="label text-mute">The shop</p>
            <h2>Try it on, then we fit it.</h2>
            <p className="text-mute">{SITE.address.street}, {SITE.address.area} {SITE.address.postcode}. Open {SITE.hours}.</p>
            <Link to="/visit" className="btn btn-ghost self-start">Plan a visit</Link>
          </div>
        </div>
      </section>
    </>
  );
}
