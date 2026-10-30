import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { LengthFinder } from "../components/LengthFinder";
import { img, store } from "../lib/store";
import { SITE } from "../data/site";

const PIECES = [
  { to: "/shop/abayas", title: "Abayas", sub: "Open, closed, occasion", image: "looks/plum-occasion" },
  { to: "/shop/dresses", title: "Dresses", sub: "Maxi, lined, satin", image: "looks/pink-satin" },
  { to: "/shop/co-ords", title: "Co-ords", sub: "Linen and crepe sets", image: "looks/sage-linen" },
  { to: "/shop/hijabs", title: "Hijabs", sub: "Modal, jersey, chiffon", image: "products/hijab-stack" },
];
const EDITS = [
  { to: "/shop/new-in", title: "Everyday", image: "hero/hallway-mobile" },
  { to: "/shop/occasion", title: "Occasion & Eid", image: "looks/plum-occasion" },
  { to: "/shop/prayer", title: "Prayer", image: "products/hijab-stack" },
];

export function Home() {
  const newIn = store.products({ collection: "new-in" }).slice(0, 4);
  return (
    <>
      <Seo title="Modest wear in three lengths" path="/" description="Abayas, maxi dresses, co-ords and hijabs cut in Petite, Regular and Tall. Designed in Tooting, London, by a family business trading since 1993." />

      <section className="relative flex min-h-[560px] items-end bg-stone lg:min-h-[680px]">
        <picture>
          <source media="(max-width: 767px)" srcSet={img("hero/hallway-mobile")} />
          <img src={img("hero/hallway")} alt="A woman walking through a bright hallway in a plum open abaya over a sage dress" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[65%_50%]" />
        </picture>
        <div className="wrap relative pb-6 sm:pb-16">
          <div className="flex max-w-xl flex-col gap-4 rounded-pill bg-paper/95 p-6 sm:p-10">
            <p className="label text-mute">Autumn / winter</p>
            <h1 className="text-[40px] sm:text-[56px]">Dressed with intention.</h1>
            <p className="text-[17px] text-mute">Abayas, dresses and hijabs cut in three lengths, made for London days. From a Tooting family business, trading since {SITE.since}.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/shop/new-in" className="btn btn-ink">Shop new in</Link>
              <Link to="/find-your-length" className="btn btn-pink">Find your length</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[32px] sm:text-[40px]">Shop by piece</h2>
          <Link to="/shop/all" className="label inline-flex min-h-11 items-center underline">View everything</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 lg:grid-cols-4">
          {PIECES.map((c) => (
            <Link key={c.to} to={c.to} className="lift flex flex-col gap-2.5">
              <div className="overflow-hidden rounded-pill"><img src={img(c.image, true)} alt="" loading="lazy" width="560" height="700" className="aspect-[4/5] w-full object-cover" /></div>
              <span className="text-lg">{c.title}</span>
              <span className="-mt-2 text-sm text-mute">{c.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-sage py-16 sm:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-5">
            <p className="label text-mute">Find your length</p>
            <h2 className="text-[32px] sm:text-[44px]">Every abaya and dress in three lengths. No hemming.</h2>
            <p className="text-[17px]">Tell us your height once and we show the length that falls to the ankle, on every page you visit.</p>
            <LengthFinder compact />
          </div>
          <img src={img("looks/sage-linen")} alt="A sage linen co-ord by a tall window" loading="lazy" width="1100" height="1375" className="hidden aspect-[4/5] w-full max-w-md justify-self-end rounded-pill object-cover lg:block" />
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[32px] sm:text-[40px]">New in</h2>
          <Link to="/shop/new-in" className="label inline-flex min-h-11 items-center underline">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{newIn.map((p) => <ProductCard key={p.handle} p={p} />)}</div>
      </section>

      <section className="wrap grid gap-4 pb-16 sm:grid-cols-3 sm:gap-6">
        {EDITS.map((e) => (
          <Link key={e.title} to={e.to} className="lift relative flex min-h-[340px] items-end overflow-hidden rounded-pill text-paper sm:min-h-[420px]">
            <img src={img(e.image, !e.image.startsWith("hero/"))} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <span className="relative w-full bg-gradient-to-t from-ink/80 to-transparent p-6 pt-16">
              <span className="label block opacity-90">Edit</span>
              <span className="display block text-[32px]">{e.title}</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="relative flex min-h-[460px] items-center bg-stone">
        <picture>
          <source media="(max-width: 767px)" srcSet={img("hero/street-mobile")} />
          <img src={img("hero/street")} alt="Two women seen from behind on a south London street, in sage and pink" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <div className="wrap relative py-10">
          <div className="flex max-w-lg flex-col gap-3 rounded-pill bg-paper p-6 sm:p-10">
            <p className="label text-mute">The shop</p>
            <h2 className="text-[32px] sm:text-[40px]">Try it on in Tooting.</h2>
            <p className="text-mute">{SITE.address.street}, {SITE.address.city} {SITE.address.postcode}. Open {SITE.hours}. Come in and we'll find your length together.</p>
            <Link to="/visit" className="btn btn-ghost self-start">Plan a visit</Link>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-8 pt-16 sm:grid-cols-3">
        {[
          ["Since " + SITE.since, "A family business in south London for over thirty years. We fit people every day, so we know fit."],
          ["Three lengths", "Petite, Regular and Tall on abayas and dresses, so nothing needs taking up."],
          ["Try before you buy", "Every piece on this site can be tried on in the Tooting shop, seven days a week."],
        ].map(([t, d]) => (
          <div key={t} className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">{t}</h2><p className="text-mute">{d}</p></div>
        ))}
      </section>
    </>
  );
}
