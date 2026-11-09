import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { DELIVERY_LINE, RETURNS_LINE, SITE, gbp } from "../data/site";
import { store } from "../lib/store";

const BASE = import.meta.env.BASE_URL;
export const NAV = [
  { to: "/shop/new-in", label: "New this week" },
  { to: "/shop/hijabs", label: "Hijabs" },
  { to: "/shop/abayas", label: "Abayas" },
  { to: "/shop/co-ords", label: "Co-ords" },
  { to: "/shop/eid", label: "Eid pre-order" },
  { to: "/alterations", label: "Alterations" },
];

export function Logo({ white = false, className = "" }: { white?: boolean; className?: string }) {
  return <img src={`${BASE}img/logo/iana-fashions-horizontal-${white ? "white" : "ochre"}.svg`} alt="I&A Fashions" className={className} width="320" height="44" />;
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside aria-label="Shop news" className="bg-ink text-paper">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-paper focus:px-4 focus:py-3">Skip to content</a>
        <div className="wrap flex h-[34px] items-center justify-between gap-3 text-[13px]">
          <p className="truncate">
            <span className="sm:hidden">Free delivery over {gbp(SITE.delivery.freeOver)} · alterations in store</span>
            <span className="hidden sm:inline">Free delivery on orders of {gbp(SITE.delivery.freeOver)} and over · every abaya can be altered in our Tooting shop</span>
          </p>
          {SITE.preview && <span className="label shrink-0 rounded-pill border border-on-ink px-1.5 py-0.5 text-[10px] leading-none text-paper" title="Concept preview: products are samples and online ordering opens at launch">Preview</span>}
        </div>
      </aside>
      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="-ml-2 inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center" onClick={() => setOpen(false)}><Logo className="h-6 w-auto sm:h-8" /></Link>
          <nav aria-label="Main" className="hidden gap-6 text-sm tracking-wide lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${isActive ? "border-ink" : "border-transparent hover:border-line"}`}>{n.label}</NavLink>)}
          </nav>
          <div className="-mr-2 flex items-center">
            <Link to="/visit" className="hidden min-h-11 items-center px-3 text-sm sm:inline-flex">Visit the shop</Link>
            <Link to="/shop/all" className="inline-flex min-h-11 items-center px-2 text-sm underline underline-offset-4 sm:hidden">Shop</Link>
          </div>
        </div>
        {open && (
          <nav aria-label="Main" className="border-t border-line bg-paper lg:hidden">
            <div className="wrap flex flex-col py-2">
              {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-lg">{n.label}</Link>)}
              <Link to="/shop/all" onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-lg">Everything</Link>
              <Link to="/visit" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-lg">Visit the shop</Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  const link = "inline-flex min-h-11 items-center text-base";
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="wrap border-b border-[#6b5a60] py-5 text-base text-on-ink">
        <span className="text-paper">Delivery:</span> {DELIVERY_LINE} {SITE.delivery.collect}. {RETURNS_LINE} <Link to="/delivery-returns" className="underline">Delivery and returns</Link>
      </div>
      <div className="wrap grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo white className="h-7 w-auto self-start" />
          <p className="max-w-xs text-base text-on-ink">Abayas, hijabs and co-ords from Tooting, London, trading since {SITE.since}. Part of the I&amp;A family alongside <a className="underline" href={SITE.sister.url}>{SITE.sister.name}</a>.</p>
        </div>
        <div>
          <h2 className="label mb-2 text-on-ink">Shop</h2>
          <ul className="flex flex-col">
            {store.collections().map((c) => <li key={c.handle}><Link to={`/shop/${c.handle}`} className={link}>{c.title}</Link></li>)}
            <li><Link to="/shop/all" className={link}>Everything</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-2 text-on-ink">Help</h2>
          <ul className="flex flex-col">
            <li><Link to="/alterations" className={link}>Alterations and bespoke</Link></li>
            <li><Link to="/delivery-returns" className={link}>Delivery and returns</Link></li>
            <li><Link to="/visit" className={link}>Visit the shop</Link></li>
            <li><a href={`tel:${SITE.phoneIntl}`} className={link}>{SITE.phone}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-2 text-on-ink">Visit</h2>
          <p className="text-base">{SITE.address.street}<br />{SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</p>
          <div className="mt-2 flex gap-4 text-base"><a href={SITE.social.instagram} className="inline-flex min-h-11 items-center underline">Instagram</a><a href={SITE.social.facebook} className="inline-flex min-h-11 items-center underline">Facebook</a></div>
        </div>
      </div>
      <div className="wrap border-t border-[#6b5a60] py-6 text-xs text-on-ink">© {SITE.legalName} · Company no. {SITE.companyNumber} · VAT {SITE.vat}{SITE.preview ? " · Concept preview: products are samples and online ordering opens at launch" : ""}</div>
    </footer>
  );
}
