import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
  const { pathname } = useLocation();
  const bar = useRef<HTMLElement>(null);
  const [top, setTop] = useState(98);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    setTop(bar.current?.getBoundingClientRect().bottom ?? 98);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); bar.current?.querySelector<HTMLElement>("button[aria-controls]")?.focus(); return; }
      if (e.key !== "Tab" || !bar.current) return;
      // Keep Tab inside the header and its open panel.
      const stops = [...bar.current.querySelectorAll<HTMLElement>("a[href], button")].filter((el) => el.offsetParent !== null);
      const first = stops[0], last = stops[stops.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || !bar.current.contains(at))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (at === last || !bar.current.contains(at))) { e.preventDefault(); first.focus(); }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", key); };
  }, [open]);

  return (
    <>
      <aside aria-label="Shop news" className="on-ink bg-ink text-paper">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-paper focus:px-4 focus:py-3 focus:text-ink">Skip to content</a>
        <div className="wrap flex h-[34px] items-center justify-between gap-3 text-[13px]">
          <p className="truncate">
            <span className="sm:hidden">Free delivery from {gbp(SITE.delivery.freeOver)}. Abayas altered in store.</span>
            <span className="hidden sm:inline">Free delivery on orders of {gbp(SITE.delivery.freeOver)} and over. Every abaya can be altered in our Tooting shop.</span>
          </p>
          {SITE.preview && <span className="shrink-0 rounded-pill border border-on-ink px-1.5 py-0.5 text-[11px] font-medium leading-none text-paper" title="Concept preview: products are samples and online ordering opens at launch">Preview</span>}
        </div>
      </aside>
      <header ref={bar} className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="-ml-2 inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center"><Logo className="h-6 w-auto sm:h-8" /></Link>
          <nav aria-label="Main" className="hidden gap-x-5 lg:flex xl:gap-x-7">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 min-w-11 items-center justify-center whitespace-nowrap border-b ${isActive ? "border-ink" : "border-transparent hover:border-ink/40"}`}>{n.label}</NavLink>)}
          </nav>
          <div className="-mr-2 flex items-center">
            <Link to="/visit" className="hidden min-h-11 items-center whitespace-nowrap px-2 sm:inline-flex">Visit the shop</Link>
            <Link to="/shop/all" className="link inline-flex min-h-11 items-center px-2 sm:hidden">Shop</Link>
          </div>
        </div>
      {open && (
        <div id="menu" className="menu lg:hidden" style={{ "--menu-top": `${top}px` } as React.CSSProperties}>
          <div className="wrap flex min-h-full flex-col justify-between gap-10 pb-8 pt-4">
            <nav aria-label="Menu" className="flex flex-col">
              {[...NAV, { to: "/shop/all", label: "Everything" }, { to: "/visit", label: "Visit the shop" }, { to: "/delivery-returns", label: "Delivery and returns" }].map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="t-sub flex min-h-[3.25rem] items-center border-b border-line">{n.label}</Link>
              ))}
            </nav>
            <div className="flex flex-col gap-1">
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink mb-3 self-start">Call {SITE.phone}</a>
              <p>{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</p>
              <p className="text-mute">{SITE.hours}</p>
            </div>
          </div>
        </div>
      )}
      </header>
    </>
  );
}

export function Footer() {
  const link = "tap hover:underline";
  return (
    <footer className="on-ink bg-ink text-paper">
      <div className="wrap grid gap-x-12 gap-y-10 pb-10 pt-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,2fr)_minmax(0,2.5fr)_minmax(0,3fr)]">
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <Logo white className="h-7 w-auto self-start" />
          <p className="voice max-w-[20em] text-paper">Abayas, hijabs and co-ords from Tooting, London, trading since {SITE.since}.</p>
          <p className="max-w-sm text-on-ink">Part of the I&amp;A family alongside <a className="link text-paper" href={SITE.sister.url}>{SITE.sister.name}</a>.</p>
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
          </ul>
        </div>
        <div>
          <h2 className="label mb-2 text-on-ink">Visit</h2>
          <p className="py-2.5">{SITE.address.street}, {SITE.address.area}<br />{SITE.address.city} {SITE.address.postcode}<br /><span className="text-on-ink">{SITE.hours}</span></p>
          <a href={`tel:${SITE.phoneIntl}`} className={`${link} underline`}>{SITE.phone}</a>
          <div className="flex gap-5"><a href={SITE.social.instagram} className={link}>Instagram</a><a href={SITE.social.facebook} className={link}>Facebook</a></div>
        </div>
      </div>
      <div className="wrap">
        <div className="grid gap-x-12 gap-y-2 border-t border-[#6b5a60] py-6 text-on-ink lg:grid-cols-[minmax(0,5fr)_minmax(0,7.5fr)]">
          <h2 className="label pt-1">Delivery and returns</h2>
          <p className="max-w-[46em]">{DELIVERY_LINE} {SITE.delivery.collect}. {RETURNS_LINE} <Link to="/delivery-returns" className="link text-paper">Read the detail</Link></p>
        </div>
        <p className="small border-t border-[#6b5a60] py-6 text-on-ink">© {SITE.legalName}. Company no. {SITE.companyNumber}. VAT {SITE.vat}.{SITE.preview ? " Concept preview: products are samples and online ordering opens at launch." : ""}</p>
      </div>
    </footer>
  );
}
