import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SITE, gbp } from "../data/site";

const BASE = import.meta.env.BASE_URL;
const LEFT = [{ to: "/shop/hijabs", label: "Hijabs" }, { to: "/shop/abayas", label: "Abayas" }];
const RIGHT = [{ to: "/shop/co-ords", label: "Co-ords" }, { to: "/shop/eid", label: "Eid pre-order" }];
const RAIL = [...LEFT, ...RIGHT, { to: "/shop/new-in", label: "New this week" }];

const logo = (tone: "ochre" | "white") => `${BASE}img/logo/iana-fashions-horizontal-${tone}.svg`;

function Links({ items }: { items: typeof LEFT }) {
  return <>{items.map((n) => <NavLink key={n.to} to={n.to} className="hdr-link">{n.label}</NavLink>)}</>;
}

/** The lockup in the middle with two links either side, lying over the first field of the page and turning Blush once the page moves.
    On phones there is no menu button: the categories are a swipe rail under the lockup. */
export function Header() {
  const { pathname } = useLocation();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);

  return (
    <header className="hdr" data-solid={solid}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-pom focus:px-4 focus:py-3 focus:text-blush">Skip to content</a>
      <div className="hdr-row">
        <nav aria-label="Hijabs and abayas" className="hdr-side"><Links items={LEFT} /></nav>
        <Link to="/" className="hdr-logo" aria-label="I&A Fashions, home">
          <img src={logo("ochre")} alt="" className="logo-ochre" width="320" height="44" />
          <img src={logo("white")} alt="" className="logo-white" width="320" height="44" />
        </Link>
        <nav aria-label="Co-ords and Eid" className="hdr-side"><Links items={RIGHT} /></nav>
      </div>
      <nav aria-label="Shop" className="hdr-rail"><Links items={RAIL} /></nav>
    </header>
  );
}

export function Footer() {
  const a = SITE.address, d = SITE.delivery;
  const link = "tap link";
  return (
    <footer className="bg-pink">
      <div className="wrap flex flex-col items-center gap-7 pb-10 pt-16 text-center sm:pt-24">
        <p className="t-hero max-w-[11em]">Come and try it on at {a.street}, {a.area}.</p>
        <p className="lede">
          {a.street}, {a.area}, {a.city} {a.postcode}. {SITE.hours}.<br />
          <a href={`tel:${SITE.phoneIntl}`} className={link}>{SITE.phone}</a>
        </p>
        <nav aria-label="Footer" className="foot-links max-w-3xl">
          <Link to="/shop/new-in" className={link}>New this week</Link>
          <Link to="/shop/hijabs" className={link}>Hijabs</Link>
          <Link to="/shop/abayas" className={link}>Abayas</Link>
          <Link to="/shop/co-ords" className={link}>Co-ords</Link>
          <Link to="/shop/eid" className={link}>Eid pre-order</Link>
          <Link to="/shop/all" className={link}>Everything</Link>
          <Link to="/alterations" className={link}>Alterations and bespoke</Link>
          <Link to="/visit" className={link}>Visit the shop</Link>
          <Link to="/delivery-returns" className={link}>Delivery and returns</Link>
          <a href={SITE.social.instagram} className={link}>Instagram</a>
          <a href={SITE.social.facebook} className={link}>Facebook</a>
        </nav>
        <p className="max-w-[44em]">
          Delivery is {gbp(d.standard.price)} in {d.standard.time} or {gbp(d.express.price)} in {d.express.time}, and free on orders of {gbp(d.freeOver)} and over. {d.collect}. {SITE.returns.days}-day returns; suits, bridal dresses and prom dresses are excluded.
        </p>
        <p>In Tooting since {SITE.since}. For school uniform, see <a className="link" href={SITE.sister.url}>{SITE.sister.name}</a>.</p>
        <img src={logo("ochre")} alt="" width="320" height="44" className="mt-4 h-6 w-auto" />
        <p className="small max-w-[52em]">© {SITE.legalName}. Company no. {SITE.companyNumber}. VAT {SITE.vat}.{SITE.preview ? " Concept preview: products are samples and online ordering opens at launch." : ""}</p>
      </div>
    </footer>
  );
}
