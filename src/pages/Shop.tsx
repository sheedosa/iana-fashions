import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { NotFound } from "./NotFound";
import { store } from "../lib/store";
import { SITE } from "../data/site";

const ALL = { handle: "all", title: "Everything", blurb: "Every hijab, abaya and co-ord in the shop." };

function FabricChips({ fabrics, on, toggle, count }: { fabrics: string[]; on: string[]; toggle: (f: string) => void; count: (f: string) => number }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Fabric">
      {fabrics.map((f) => (
        <button key={f} type="button" className="chip" aria-pressed={on.includes(f)} onClick={() => toggle(f)}>
          {f}<span className={`ml-1.5 ${on.includes(f) ? "text-on-ink" : "text-mute"}`}>{count(f)}</span>
        </button>
      ))}
    </div>
  );
}

export function Shop() {
  const { handle = "all" } = useParams();
  const c = handle === "all" ? ALL : store.collection(handle);
  const [fabric, setFabric] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  useEffect(() => { setFabric([]); setFilterOpen(false); }, [handle]);
  if (!c) return <NotFound />;

  const base = store.products({ collection: handle });
  const fabrics = [...new Set(base.map((p) => p.fabric))].sort();
  const list = store.products({ collection: handle, fabric });
  const toggle = (f: string) => setFabric((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]));
  const count = (f: string) => base.filter((p) => p.fabric === f).length;
  const showFilter = fabrics.length > 1;
  const hasAbayas = base.some(store.isAbaya);

  return (
    <>
      <Seo title={c.title} path={`/shop/${handle}`} description={`${c.blurb} From I&A Fashions in Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/shop/${handle}` }]),
          { "@context": "https://schema.org", "@type": "CollectionPage", name: c.title, description: c.blurb }]} />

      <section className="wrap flex flex-col gap-3 pb-5 pt-6 sm:gap-4 sm:pt-12">
        <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · {c.title}</nav>
        <h1>{c.title}</h1>
        <p className="hidden max-w-2xl text-[17px] text-mute sm:block">{c.blurb}</p>
        <nav aria-label="Collections" className="flex flex-wrap gap-2 pt-1">
          {[ALL, ...store.collections()].map((x) => (
            <Link key={x.handle} to={`/shop/${x.handle}`} className="chip" aria-current={x.handle === handle ? "page" : undefined}>{x.title}</Link>
          ))}
        </nav>
      </section>

      <section className="wrap grid gap-10 pb-10 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="hidden flex-col gap-7 lg:flex">
          {showFilter && (
            <div className="flex flex-col gap-3">
              <h2 className="label text-mute">Fabric</h2>
              <FabricChips fabrics={fabrics} on={fabric} toggle={toggle} count={count} />
            </div>
          )}
          {hasAbayas && (
            <div className="flex flex-col gap-2 rounded-pill bg-sage p-4">
              <p className="font-medium">Made to fit you</p>
              <p className="text-mute">{SITE.alterations.summary}</p>
              <Link to="/alterations" className="label inline-flex min-h-11 items-center underline">How it works</Link>
            </div>
          )}
        </aside>

        <div className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-mute" aria-live="polite">{list.length} {list.length === 1 ? "piece" : "pieces"}{fabric.length ? ` in ${fabric.join(" or ").toLowerCase()}` : ""}</p>
            {showFilter && (
              <button type="button" className="btn btn-ghost px-4 lg:hidden" aria-expanded={filterOpen} aria-controls="mobile-filter" onClick={() => setFilterOpen(!filterOpen)}>
                Filter{fabric.length ? ` (${fabric.length})` : ""}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={filterOpen ? "rotate-180" : ""}><path d="M3 6l5 5 5-5" /></svg>
              </button>
            )}
          </div>
          {showFilter && filterOpen && (
            <div id="mobile-filter" className="mb-6 flex flex-col gap-3 rounded-pill bg-stone p-4 lg:hidden">
              <p className="label text-mute">Fabric</p>
              <FabricChips fabrics={fabrics} on={fabric} toggle={toggle} count={count} />
            </div>
          )}
          <h2 className="sr-only">Pieces</h2>
          {list.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 xl:grid-cols-3">{list.map((p, i) => <ProductCard key={p.handle} p={p} eager={i < 3} />)}</div>
          ) : (
            <div className="rounded-pill bg-stone p-8 text-center">
              <p>Nothing matches that fabric here.</p>
              <button type="button" onClick={() => setFabric([])} className="btn btn-ghost mt-4">Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
