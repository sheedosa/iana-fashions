import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { AlterationsFigure, PhotoSlot, ShopMap } from "../components/Art";
import { clearInterest, loadInterest, saveInterest, type Interest } from "../lib/interest";
import { DELIVERY_LINE, RETURNS_LINE, SITE, gbp } from "../data/site";

const open = SITE.hours.replace("Monday to Sunday, ", "");

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
      <div className="flex flex-col items-start gap-4" role="status">
        <p className="t-sub">Thank you, {saved.name}. Your interest is saved on this device.</p>
        <p>Nothing has been sent yet. When bespoke opens, we'll ask you to call or visit; until then, the shop on {SITE.phone} is the quickest way to talk about it.</p>
        <button type="button" className="link tap" onClick={() => { clearInterest(); setSaved(null); }}>Remove my details</button>
      </div>
    );
  }
  return (
    <form noValidate className="flex flex-col gap-5" onSubmit={(e) => {
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
        <label htmlFor="bi-note" className="field-label">What would you like made? <span className="font-normal">Optional</span></label>
        <textarea id="bi-note" className="field" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <p>Saved on this device only. Nothing is sent while the site is in preview.</p>
      <p role="alert" className="font-medium empty:hidden">{err.form}</p>
      <button type="submit" className="btn self-start">Register interest</button>
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

      <section className="first grid md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col items-start gap-5 px-[var(--gutter)] pb-10 pt-6 sm:pt-12 md:pb-20 md:pr-12">
          <h1 className="t-hero">Alterations and bespoke</h1>
          <p className="lede">{SITE.alterations.summary} Put it on, show us what to change, and we pin it with you.</p>
          <a href={`tel:${SITE.phoneIntl}`} className="btn">Call {SITE.phone}</a>
          <Link to="/visit" className="link tap">Find the shop</Link>
        </div>
        <div className="grid place-items-center bg-oat p-8 sm:p-12"><AlterationsFigure className="w-full max-w-md" /></div>
      </section>

      <section className="wrap grid gap-x-20 gap-y-12 py-14 sm:py-24 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-6">
          <h2>What we can change</h2>
          <div><h3>Hem taken up</h3><p className="prose-w pt-1">The length shortened so the hem sits where you want it, in flats or heels.</p></div>
          <div><h3>Sleeves shortened</h3><p className="prose-w pt-1">Taken up so the cuff sits at your wrist.</p></div>
          <div><h3>Sides taken in</h3><p className="prose-w pt-1">A closer fit through the body, taken in along the side seams.</p></div>
          <p>Something else in mind? Ask in the shop.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h2>How to ask</h2>
          <p>Bring the abaya to {SITE.address.street}, {SITE.address.area}, any day, {open}.</p>
          <p>To ask about a piece first, call <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a>.</p>
          <p>Prices: [ALTERATION PRICES].</p>
          <p>Turnaround: [TURNAROUND].</p>
        </div>
      </section>

      <section className="bg-pink">
        <div className="wrap grid gap-x-20 gap-y-8 py-14 sm:py-24 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="flex flex-col gap-4">
            <h2>{SITE.alterations.bespoke}</h2>
            <p className="prose-w">An abaya cut for you, in the colour and fabric you choose. Leave your details and we'll tell you when it opens.</p>
            <p>Opening date: [BESPOKE LAUNCH DATE].</p>
          </div>
          <BespokeInterest />
        </div>
      </section>
    </>
  );
}

export function Visit() {
  const a = SITE.address;
  return (
    <>
      <Seo title="Visit the shop in Tooting" path="/visit"
        description={`Try on abayas, hijabs and co-ords, and have them altered, at ${a.street}, ${a.city} ${a.postcode}. Open ${SITE.hours}. Phone ${SITE.phone}.`}
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Visit", path: "/visit" }])} />
      <section className="first grid md:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
        <div className="flex flex-col items-start gap-4 px-[var(--gutter)] pb-10 pt-6 sm:pt-12 md:pb-20 md:pr-12">
          <h1 className="t-hero">Visit us in Tooting</h1>
          <p className="t-sub pt-2">{a.street}, {a.area}<br />{a.city} {a.postcode}</p>
          <p className="lede">{SITE.hours}. Walk in any day.</p>
          <a href={`tel:${SITE.phoneIntl}`} className="btn">Call {SITE.phone}</a>
          <a href={maps} className="link tap">Open in Google Maps</a>
        </div>
        <ShopMap className="h-full w-full bg-oat object-cover" />
      </section>
      <section className="grid items-center gap-y-10 py-14 sm:py-24 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="pic r45"><PhotoSlot caption="The shop front on Mitcham Road" /></div>
        <div className="prose-w flex flex-col gap-4 px-[var(--gutter)] md:px-[clamp(2rem,6vw,7rem)]">
          <h2>When you come in</h2>
          <p>Abayas, co-ords and hijabs are all in the shop to try on, and you can hold the hijab colours up against what you're wearing.</p>
          <p>{SITE.alterations.summary} <Link to="/alterations" className="link">How alterations work</Link></p>
          <p>{SITE.preorders} Ask at the till or call us.</p>
          <p>Once online ordering opens you can also order here and collect from the shop.</p>
        </div>
      </section>
    </>
  );
}

export function DeliveryReturns() {
  const d = SITE.delivery;
  const td = "py-2 pr-4 align-baseline";
  return (
    <>
      <Seo title="Delivery and returns" path="/delivery-returns" description={`${DELIVERY_LINE} ${d.collect}. ${RETURNS_LINE}`}
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Delivery and returns", path: "/delivery-returns" }])} />
      <section className="first bg-pink">
        <div className="wrap flex flex-col gap-4 pb-10 pt-6 sm:pb-14 sm:pt-12">
          <h1 className="t-hero">Delivery and returns</h1>
          <p className="lede">Delivery is free on orders of {gbp(d.freeOver)} and over, or collect from the shop in Tooting.</p>
        </div>
      </section>
      <section className="wrap grid gap-x-20 gap-y-12 py-14 sm:py-24 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2>Delivery</h2>
          <table className="w-full max-w-xl text-left">
            <thead><tr><th scope="col" className={`${td} font-medium`}>Option</th><th scope="col" className={`${td} font-medium`}>Time</th><th scope="col" className="py-2 text-right font-medium">Cost</th></tr></thead>
            <tbody>
              <tr><td className={td}>Standard</td><td className={td}>{d.standard.time}</td><td className="py-2 text-right align-baseline">{gbp(d.standard.price)}</td></tr>
              <tr><td className={td}>Express</td><td className={td}>{d.express.time}</td><td className="py-2 text-right align-baseline">{gbp(d.express.price)}</td></tr>
              <tr><td className={td}>Free delivery</td><td className={td}>Orders of {gbp(d.freeOver)} and over</td><td className="py-2 text-right align-baseline">Free</td></tr>
              <tr><td className={td}>Click and collect</td><td className={td}>From {SITE.address.street}, {SITE.address.area}</td><td className="whitespace-nowrap py-2 text-right align-baseline">In shop</td></tr>
            </tbody>
          </table>
        </div>
        <div className="prose-w flex flex-col gap-4">
          <h2>Returns</h2>
          <p>You can return an item within {SITE.returns.days} days. Suits, bridal dresses and prom dresses can't be returned.</p>
          <p>How to return: [HOW TO RETURN].</p>
          <p>Pieces that have been altered for you: [RETURNS ON ALTERED ITEMS].</p>
        </div>
      </section>
    </>
  );
}
