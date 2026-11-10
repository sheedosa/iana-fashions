import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { AlterationsFigure, PhotoSlot, ShopMap } from "../components/Art";
import { clearInterest, loadInterest, saveInterest, type Interest } from "../lib/interest";
import { DELIVERY_LINE, RETURNS_LINE, SITE, gbp } from "../data/site";

const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}`)}`;

function BespokeInterest() {
  const [saved, setSaved] = useState<Interest | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState<{ name?: string; contact?: string; form?: string }>({});
  useEffect(() => { setSaved(loadInterest()); }, []);

  if (saved) {
    return (
      <div className="flex flex-col gap-3 rounded-pill bg-paper p-6 sm:p-8" role="status">
        <p className="t-sub">Thank you, {saved.name}. Your interest is saved on this device.</p>
        <p className="text-mute">Nothing has been sent yet. When bespoke opens, we'll ask you to call or visit; until then, the shop on {SITE.phone} is the quickest way to talk about it.</p>
        <button type="button" className="btn btn-ghost self-start" onClick={() => { clearInterest(); setSaved(null); }}>Remove my details</button>
      </div>
    );
  }
  return (
    <form noValidate className="flex flex-col gap-5 rounded-pill bg-paper p-6 sm:p-8" onSubmit={(e) => {
      e.preventDefault();
      const next: typeof err = {};
      if (!name.trim()) next.name = "Add your name.";
      if (!contact.trim()) next.contact = "Add a phone number or an email address so we can reach you.";
      setErr(next);
      if (next.name || next.contact) { document.getElementById(next.name ? "bi-name" : "bi-contact")?.focus(); return; }
      const i = { name: name.trim(), contact: contact.trim(), note: note.trim(), savedOn: new Date().toISOString() };
      if (saveInterest(i)) setSaved(i); else setErr({ form: "This browser won't save details. Call the shop instead." });
    }}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bi-name" className="field-label">Your name</label>
        <input id="bi-name" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!err.name} aria-describedby={err.name ? "bi-name-e" : undefined} />
        {err.name && <p id="bi-name-e" className="font-medium">{err.name}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bi-contact" className="field-label">Phone or email</label>
        <input id="bi-contact" className="field" autoComplete="on" autoCapitalize="none" value={contact} onChange={(e) => setContact(e.target.value)} aria-invalid={!!err.contact} aria-describedby={err.contact ? "bi-contact-e" : undefined} />
        {err.contact && <p id="bi-contact-e" className="font-medium">{err.contact}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bi-note" className="field-label">What would you like made? <span className="font-normal text-mute">Optional</span></label>
        <textarea id="bi-note" className="field" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <p className="text-mute">Saved on this device only. Nothing is sent while the site is in preview.</p>
      <p role="alert" className="font-medium empty:hidden">{err.form}</p>
      <button type="submit" className="btn btn-ink self-start">Register interest</button>
    </form>
  );
}

export function Alterations() {
  return (
    <>
      <Seo title="Alterations and bespoke" path="/alterations"
        description={`${SITE.alterations.summary} Hems taken up, sleeves shortened, sides taken in at ${SITE.address.street}, Tooting. ${SITE.alterations.bespoke}`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Alterations and bespoke", path: "/alterations" }]),
          { "@context": "https://schema.org", "@type": "Service", name: "Abaya alterations", serviceType: "Clothing alterations", provider: { "@id": `${SITE.url}/#store` }, areaServed: "London" }]} />

      <section className="wrap grid items-center gap-x-16 gap-y-8 pb-12 pt-8 sm:pt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-5">
          <h1 className="t-hero">Alterations and bespoke</h1>
          <p className="voice">Made to fit you, in the shop.</p>
          <p className="lede">{SITE.alterations.summary} Try it on, show us what needs changing, and we'll make it fit.</p>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink">Call {SITE.phone}</a>
            <Link to="/visit" className="btn btn-ghost">Find the shop</Link>
          </div>
        </div>
        <div className="rounded-pill bg-sage p-6 sm:p-10"><AlterationsFigure className="mx-auto w-full max-w-md" /></div>
      </section>

      <section className="wrap grid gap-x-16 gap-y-12 border-t border-line py-12 sm:py-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-4">
          <h2>What amendments mean</h2>
          <p>An amendment is a change to a finished abaya so it sits right on you. The usual ones:</p>
          <dl className="flex flex-col border-t border-ink">
            {[
              ["Hem taken up", "The length shortened so the hem sits where you want it, in flats or heels."],
              ["Sleeves shortened", "Taken up so the cuff sits at your wrist."],
              ["Sides taken in", "A closer fit through the body, taken in along the side seams."],
            ].map(([t, d]) => (
              <div key={t} className="grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[13rem_1fr] sm:items-baseline"><dt className="t-sub">{t}</dt><dd className="text-mute">{d}</dd></div>
            ))}
          </dl>
          <p className="text-mute">Something else in mind? Ask in the shop.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h2>How to ask</h2>
          <p><b>Walk in.</b> Bring the abaya to {SITE.address.street}, {SITE.address.area}, any day, {SITE.hours.replace("Monday to Sunday, ", "")}. Try it on and show us what needs changing.</p>
          <p><b>Or call first</b> on <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a> to ask about a piece.</p>
          <div className="rows">
            <p><span>Prices</span><span className="text-right text-mute">[ALTERATION PRICES]</span></p>
            <p><span>Turnaround</span><span className="text-right text-mute">[TURNAROUND]</span></p>
          </div>
        </div>
      </section>

      <section className="bg-sage">
        <div className="wrap grid gap-x-16 gap-y-8 py-12 sm:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="flex flex-col gap-4">
            <h2>Custom and bespoke abayas are coming soon.</h2>
            <p>An abaya cut for you, in the colour and fabric you choose. Leave your details and we'll tell you when it opens.</p>
            <p className="text-mute">Opening date: [BESPOKE LAUNCH DATE].</p>
          </div>
          <BespokeInterest />
        </div>
      </section>
    </>
  );
}

export function Visit() {
  return (
    <>
      <Seo title="Visit the shop in Tooting" path="/visit"
        description={`Try on abayas, hijabs and co-ords, and have them altered, at ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}. Open ${SITE.hours}. Phone ${SITE.phone}.`}
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Visit", path: "/visit" }])} />
      <section className="wrap grid gap-x-16 gap-y-10 pb-12 pt-8 sm:pt-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
        <div className="flex flex-col gap-5">
          <h1 className="t-hero">Visit us in Tooting</h1>
          <p className="lede">Try everything on, pick your hijab colours in person, and have your abaya taken up while you're here.</p>
          <dl className="flex flex-col border-t border-ink">
            <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[140px_1fr]"><dt className="pt-0.5 font-medium text-mute">Address</dt><dd className="text-lg">{SITE.address.street}, {SITE.address.area}<br />{SITE.address.city} {SITE.address.postcode}<br /><a href={maps} className="link tap text-base">Open in Google Maps</a></dd></div>
            <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[140px_1fr]"><dt className="pt-0.5 font-medium text-mute">Hours</dt><dd className="text-lg">{SITE.hours}</dd></div>
            <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[140px_1fr]"><dt className="pt-0.5 font-medium text-mute">Phone</dt><dd><a href={`tel:${SITE.phoneIntl}`} className="link tap text-lg">{SITE.phone}</a></dd></div>
          </dl>
        </div>
        <ShopMap className="w-full self-start rounded-pill" />
      </section>
      <section className="wrap grid gap-x-16 gap-y-10 border-t border-line pb-16 pt-12 sm:pb-24 sm:pt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <PhotoSlot caption="The shop front on Mitcham Road" className="aspect-[4/3] w-full rounded-pill" />
        <div className="prose-w flex flex-col gap-4">
          <h2>What to expect</h2>
          <p><b>Try it on.</b> Abayas, co-ords and hijabs are all in the shop to try.</p>
          <p><b>Altered to fit.</b> {SITE.alterations.summary} <Link to="/alterations" className="link">How alterations work</Link></p>
          <p><b>Click and collect.</b> Order online at launch and collect here.</p>
          <p><b>Pre-orders.</b> {SITE.preorders} Ask at the till or call us.</p>
        </div>
      </section>
    </>
  );
}

export function DeliveryReturns() {
  const d = SITE.delivery;
  return (
    <>
      <Seo title="Delivery and returns" path="/delivery-returns" description={`${DELIVERY_LINE} ${d.collect}. ${RETURNS_LINE}`}
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Delivery and returns", path: "/delivery-returns" }])} />
      <section className="wrap grid gap-x-16 gap-y-10 pb-16 pt-8 sm:pb-24 sm:pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col gap-4 self-start lg:sticky lg:top-24">
          <h1>Delivery and returns</h1>
          <p className="lede text-mute">Delivery is free on orders of {gbp(d.freeOver)} and over, or collect from the shop in Tooting.</p>
        </div>
        <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <h2>Delivery</h2>
          <table className="w-full text-left">
            <thead><tr className="border-b border-ink"><th scope="col" className="label py-3 text-mute">Option</th><th scope="col" className="label py-3 text-mute">Time</th><th scope="col" className="label py-3 text-right text-mute">Cost</th></tr></thead>
            <tbody>
              <tr className="border-b border-line"><td className="py-3 pr-3">Standard</td><td className="py-3 pr-3">{d.standard.time}</td><td className="py-3 text-right">{gbp(d.standard.price)}</td></tr>
              <tr className="border-b border-line"><td className="py-3 pr-3">Express</td><td className="py-3 pr-3">{d.express.time}</td><td className="py-3 text-right">{gbp(d.express.price)}</td></tr>
              <tr className="border-b border-line"><td className="py-3 pr-3">Free delivery</td><td className="py-3 pr-3">Orders of {gbp(d.freeOver)} and over</td><td className="py-3 text-right">Free</td></tr>
              <tr className="border-b border-line"><td className="py-3 pr-3">Click and collect</td><td className="py-3 pr-3">From {SITE.address.street}, {SITE.address.area}</td><td className="whitespace-nowrap py-3 text-right">In shop</td></tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3">
          <h2>Returns</h2>
          <p>You can return an item within {SITE.returns.days} days. Suits, bridal dresses and prom dresses can't be returned.</p>
          <p className="text-mute">How to return: [HOW TO RETURN].</p>
          <p className="text-mute">Pieces that have been altered for you: [RETURNS ON ALTERED ITEMS].</p>
        </div>
        </div>
      </section>
    </>
  );
}
