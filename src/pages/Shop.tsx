import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { Swatches } from "../components/Art";
import { NotFound } from "./NotFound";
import { store } from "../lib/store";
import { SITE } from "../data/site";

const ALL = { handle: "all", title: "Everything", blurb: "Every hijab, abaya and co-ord in the shop." };

export function Shop() {
  const { handle = "all" } = useParams();
  const c = handle === "all" ? ALL : store.collection(handle);
  const [params, setParams] = useSearchParams();
  const [fabric, setFabric] = useState<string[]>([]);
  useEffect(() => { setFabric([]); }, [handle]);
  if (!c) return <NotFound />;

  const base = store.products({ collection: handle });
  const colours = store.colours(base);
  const colour = colours.find((x) => x.name === params.get("colour"))?.name ?? null;
  const fabrics = [...new Set(base.map((p) => p.fabric))].sort();
  const list = store.products({ collection: handle, fabric, colour });
  const inColour = store.products({ collection: handle, colour });
  const toggle = (f: string) => setFabric((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]));
  const setColour = (name: string | null) => setParams(name ? { colour: name } : {}, { replace: true, preventScrollReset: true });
  const clear = () => { setFabric([]); setColour(null); };
  const filtered = !!colour || fabric.length > 0;
  const hasAbayas = base.some(store.isAbaya);

  return (
    <>
      <Seo title={c.title} path={`/shop/${handle}`} description={`${c.blurb} From I&A Fashions in Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/shop/${handle}` }]),
          { "@context": "https://schema.org", "@type": "CollectionPage", name: c.title, description: c.blurb }]} />

      <section className="wrap grid gap-x-12 gap-y-4 pb-6 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
        <h1>{c.title}</h1>
        <div className="flex flex-col gap-2 lg:pb-2">
          <p className="lede text-mute">{c.blurb}</p>
          {hasAbayas && <p>{SITE.alterations.summary} <Link to="/alterations" className="link">How alterations work</Link></p>}
        </div>
      </section>

      <nav aria-label="Collections" className="wrap">
        <ul className="chip-rail !gap-2 border-b border-line !pb-5">
          {[ALL, ...store.collections()].map((x) => (
            <li key={x.handle} className="flex-none"><Link to={`/shop/${x.handle}`} className="chip" aria-current={x.handle === handle ? "page" : undefined}>{x.title}</Link></li>
          ))}
        </ul>
      </nav>

      <section className="wrap pb-16 pt-5 sm:pb-24" aria-labelledby="pieces-h">
        <h2 id="pieces-h" className="sr-only">Pieces</h2>
        <div className="flex flex-col gap-x-12 gap-y-4 lg:flex-row lg:items-end lg:justify-between">
          {colours.length > 1 && (
            <div className="flex min-w-0 flex-col gap-1">
              <p className="label text-mute" id="colour-l">In this colour</p>
              <Swatches colours={colours} active={colour} onPick={(x) => setColour(colour === x.name ? null : x.name)} label="Show pieces in this colour" className="chip-rail" />
            </div>
          )}
          {fabrics.length > 1 && (
            <div className="flex shrink-0 flex-col gap-2">
              <p className="label text-mute">Fabric</p>
              <div className="flex flex-wrap gap-2 pb-1 lg:flex-nowrap" role="group" aria-label="Fabric">
                {fabrics.map((f) => {
                  const n = inColour.filter((p) => p.fabric === f).length;
                  return <button key={f} type="button" className="chip" aria-pressed={fabric.includes(f)} onClick={() => toggle(f)}>{f}<span className={`ml-1.5 ${fabric.includes(f) ? "text-on-ink" : "text-mute"}`}>{n}</span></button>;
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 mt-5 flex min-h-11 flex-wrap items-center gap-x-5 gap-y-1 border-t border-line pt-3">
          <p aria-live="polite">
            {list.length} {list.length === 1 ? "piece" : "pieces"}
            {colour && <> in <span className="voice !text-[1.375rem]">{colour.toLowerCase()}</span></>}
            {fabric.length > 0 && <>{colour ? ", " : " in "}{fabric.join(" or ").toLowerCase()}</>}
          </p>
          {filtered && <button type="button" className="link tap" onClick={clear}>Clear filters</button>}
        </div>

        {list.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">{list.map((p, i) => <ProductCard key={p.handle} p={p} eager={i < 4} colour={colour} />)}</div>
        ) : (
          <div className="flex flex-col items-start gap-4 border-y border-line py-10">
            <p className="t-sub">Nothing here in that colour and fabric together.</p>
            <p className="text-mute">Try the colour on its own, or see everything in {c.title.toLowerCase()}.</p>
            <div className="flex flex-wrap gap-3">
              {colour && fabric.length > 0 && <button type="button" onClick={() => setFabric([])} className="btn btn-ink">Show all in {colour.toLowerCase()}</button>}
              <button type="button" onClick={clear} className="btn btn-ghost">Clear filters</button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
