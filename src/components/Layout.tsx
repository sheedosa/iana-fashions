import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SITE } from "../data/site";
import { useLength } from "../lib/length";

const BASE = import.meta.env.BASE_URL;
export const NAV = [
  { to: "/shop/new-in", label: "New in" },
  { to: "/shop/abayas", label: "Abayas" },
  { to: "/shop/dresses", label: "Dresses" },
  { to: "/shop/co-ords", label: "Co-ords" },
  { to: "/shop/hijabs", label: "Hijabs" },
  { to: "/shop/prayer", label: "Prayer" },
  { to: "/shop/occasion", label: "Occasion" },
];

export function Logo({ white = false, className = "" }: { white?: boolean; className?: string }) {
  return <img src={`${BASE}img/logo/iana-fashions-horizontal-${white ? "white" : "ochre"}.svg`} alt="I&A Fashions" className={className} width="320" height="44" />;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { label } = useLength();
  return (
    <>
      {SITE.preview && (
        <div className="bg-ink px-4 py-2 text-center text-[13px] text-paper">
          Concept preview · products are samples and online ordering opens at launch
        </div>
      )}
      <div className="bg-pink px-4 py-2 text-center text-[13px] tracking-wide">
        {label ? <>Showing your length: <b>{label}</b> · <Link to="/find-your-length" className="underline">change</Link></> : <>Every abaya and dress in three lengths · <Link to="/find-your-length" className="underline">find yours</Link></>}
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center" onClick={() => setOpen(false)}><Logo className="h-6 w-auto sm:h-8" /></Link>
          <nav aria-label="Shop" className="hidden gap-7 text-sm tracking-wide lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${isActive ? "border-ink" : "border-transparent hover:border-ink/40"}`}>{n.label}</NavLink>)}
          </nav>
          <div className="flex items-center">
            <Link to="/visit" className="hidden min-h-11 items-center px-3 text-sm sm:inline-flex">Visit the shop</Link>
            <Link to="/shop/all" aria-label="Shop everything" className="inline-flex h-11 w-11 items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            </Link>
          </div>
        </div>
        {open && (
          <nav aria-label="Shop" className="border-t border-line bg-paper lg:hidden">
            <div className="wrap flex flex-col py-2">
              {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-lg">{n.label}</Link>)}
              <Link to="/find-your-length" onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-lg">Find your length</Link>
              <Link to="/visit" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-lg">Visit the shop</Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo white className="h-7 w-auto self-start" />
          <p className="max-w-xs text-sm text-[#e3d6da]">Modest wear from Tooting, London. Part of the I&amp;A family alongside <a className="underline" href={SITE.sister.url}>{SITE.sister.name}</a>.</p>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-[#e3d6da]">Shop</h2>
          <ul className="flex flex-col">{NAV.slice(1, 5).map((n) => <li key={n.to}><Link to={n.to} className="inline-flex min-h-11 items-center text-sm">{n.label}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-[#e3d6da]">Help</h2>
          <ul className="flex flex-col">
            <li><Link to="/find-your-length" className="inline-flex min-h-11 items-center text-sm">Find your length</Link></li>
            <li><Link to="/visit" className="inline-flex min-h-11 items-center text-sm">Visit the shop</Link></li>
            <li><a href={`tel:${SITE.phoneIntl}`} className="inline-flex min-h-11 items-center text-sm">{SITE.phone}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-[#e3d6da]">Visit</h2>
          <p className="text-sm">{SITE.address.street}<br />{SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</p>
          <div className="mt-3 flex gap-4 text-sm"><a href={SITE.social.instagram} className="inline-flex min-h-11 items-center underline">Instagram</a><a href={SITE.social.facebook} className="inline-flex min-h-11 items-center underline">Facebook</a></div>
        </div>
      </div>
      <div className="wrap border-t border-white/15 py-6 text-xs text-[#e3d6da]">© {SITE.legalName} · Company no. {SITE.companyNumber} · VAT {SITE.vat}</div>
    </footer>
  );
}
