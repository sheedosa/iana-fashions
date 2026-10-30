import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { LengthFinder } from "../components/LengthFinder";
import { img } from "../lib/store";
import { LENGTHS, SITE } from "../data/site";

export function FindYourLength() {
  return (
    <>
      <Seo title="Find your length" path="/find-your-length" description={`Every abaya and dress at I&A Fashions comes in Petite (${LENGTHS[0].inches}"), Regular (${LENGTHS[1].inches}") and Tall (${LENGTHS[2].inches}"). Enter your height to find yours.`} />
      <section className="wrap grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-5">
          <p className="label text-mute">Fit</p>
          <h1 className="text-[44px] sm:text-[56px]">Find your length</h1>
          <p className="max-w-xl text-[17px] text-mute">Our abayas and dresses come in three lengths so the hem falls at the ankle without taking anything up. Enter your height and we'll remember your length on this device.</p>
          <div className="rounded-pill bg-sage p-6"><LengthFinder /></div>
          <h2 className="mt-6 text-[32px]">How we measure</h2>
          <table className="w-full max-w-xl text-left text-sm">
            <thead><tr className="border-b border-ink"><th className="py-3 font-normal">Length</th><th className="py-3 font-normal">Shoulder to hem</th><th className="py-3 font-normal">For heights</th></tr></thead>
            <tbody>{LENGTHS.map((l) => <tr key={l.id} className="border-b border-line"><td className="py-3">{l.name}</td><td className="py-3">{l.inches}"</td><td className="py-3 text-mute">{l.fits}</td></tr>)}</tbody>
          </table>
          <p className="max-w-xl text-sm text-mute">Between two lengths? Choose the longer one if you wear heels, the shorter one for flats. Or come into the shop and try both.</p>
        </div>
        <img src={img("looks/pink-satin")} alt="A pink satin abaya falling to the ankle" width="1100" height="1375" className="hidden aspect-[4/5] w-full rounded-pill object-cover lg:block" />
      </section>
    </>
  );
}

export function Visit() {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}`)}`;
  return (
    <>
      <Seo title="Visit the shop in Tooting" path="/visit" description={`Try on abayas, dresses and hijabs at ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}. Open ${SITE.hours}. Phone ${SITE.phone}.`} />
      <section className="relative flex min-h-[380px] items-end bg-stone">
        <img src={img("hero/street")} alt="Two women walking on a south London street" className="absolute inset-0 h-full w-full object-cover" />
        <div className="wrap relative pb-8"><h1 className="inline-block rounded-pill bg-paper px-6 py-4 text-[44px] sm:text-[56px]">Visit us in Tooting</h1></div>
      </section>
      <section className="wrap grid gap-10 py-14 md:grid-cols-3">
        <div className="flex flex-col gap-2 border-t border-ink pt-5">
          <h2 className="label font-sans text-mute">Address</h2>
          <p className="text-lg">{SITE.address.street}<br />{SITE.address.area}, {SITE.address.city}<br />{SITE.address.postcode}</p>
          <a href={maps} className="inline-flex min-h-11 items-center underline">Open in Google Maps</a>
        </div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5">
          <h2 className="label font-sans text-mute">Opening hours</h2>
          <p className="text-lg">{SITE.hours}</p>
        </div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5">
          <h2 className="label font-sans text-mute">Call</h2>
          <a href={`tel:${SITE.phoneIntl}`} className="inline-flex min-h-11 items-center text-lg underline">{SITE.phone}</a>
          <p className="text-mute">Ask us to put a length and size aside for you to try.</p>
        </div>
      </section>
      <section className="wrap pb-6">
        <div className="flex flex-col gap-4 rounded-pill bg-pink p-8 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-[32px]">Not sure of your length?</h2><p className="text-ink">We'll measure you in the shop, or find it online in ten seconds.</p></div>
          <Link to="/find-your-length" className="btn btn-ink shrink-0">Find your length</Link>
        </div>
      </section>
    </>
  );
}
