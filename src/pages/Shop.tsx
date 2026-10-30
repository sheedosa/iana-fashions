import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ProductCard } from "../components/ProductCard";
import { NotFound } from "./NotFound";
import { store } from "../lib/store";
import { useLength } from "../lib/length";
import { LENGTHS } from "../data/site";

const ALL = { handle: "all", title: "Everything", blurb: "Every abaya, dress, co-ord, hijab and prayer piece." };

export function Shop() {
  const { handle = "all" } = useParams();
  const c = handle === "all" ? ALL : store.collection(handle);
  const { length, label } = useLength();
  const [mine, setMine] = useState(true);
  const [fabric, setFabric] = useState<string[]>([]);
  if (!c) return <NotFound />;

  const base = store.products({ collection: handle });
  const fabrics = [...new Set(base.map((p) => p.fabric))].sort();
  const list = store.products({ collection: handle, fabric, length: mine ? length : null });
  const lengthName = LENGTHS.find((l) => l.id === length)?.name;
  const toggle = (f: string) => setFabric((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]));

  return (
    <>
      <Seo title={c.title} path={`/shop/${handle}`} description={`${c.blurb} From I&A Fashions in Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/shop/${handle}` }]),
          { "@context": "https://schema.org", "@type": "CollectionPage", name: c.title, description: c.blurb }]} />

      <section className="wrap flex flex-col gap-4 pb-6 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · {c.title}</nav>
        <h1 className="text-[44px] sm:text-[56px]">{c.title}</h1>
        <p className="max-w-2xl text-[17px] text-mute">{c.blurb}</p>
        <nav aria-label="Collections" className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[ALL, ...store.collections()].map((x) => (
            <Link key={x.handle} to={`/shop/${x.handle}`} className="chip" aria-current={x.handle === handle ? "page" : undefined}>{x.title}</Link>
          ))}
        </nav>
      </section>

      <section className="wrap grid gap-10 pb-10 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="flex flex-col gap-7">
          {fabrics.length > 1 && (
            <fieldset className="flex flex-col gap-1">
              <legend className="label mb-2 text-mute">Fabric</legend>
              {fabrics.map((f) => (
                <label key={f} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                  <input type="checkbox" checked={fabric.includes(f)} onChange={() => toggle(f)} className="h-[18px] w-[18px] accent-[#45353a]" /> {f} <span className="text-mute">({base.filter((p) => p.fabric === f).length})</span>
                </label>
              ))}
            </fieldset>
          )}
          <fieldset className="flex flex-col gap-1">
            <legend className="label mb-2 text-mute">Length</legend>
            {length ? (
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" checked={mine} onChange={() => setMine(!mine)} className="h-[18px] w-[18px] accent-[#45353a]" /> Only show {lengthName}
              </label>
            ) : null}
            <div className="mt-1 flex flex-col gap-2 rounded-pill bg-sage p-4">
              <p className="text-sm font-normal">{label ? `Your length: ${label}` : "Not sure of your length?"}</p>
              <p className="text-sm text-mute">{label ? "Saved on this device." : "One question, ten seconds."}</p>
              <Link to="/find-your-length" className="label inline-flex min-h-11 items-center underline">{label ? "Change length" : "Find your length"}</Link>
            </div>
          </fieldset>
        </aside>

        <div className="min-w-0">
          <p className="mb-5 text-sm text-mute" aria-live="polite">{list.length} {list.length === 1 ? "piece" : "pieces"}{mine && lengthName ? ` in ${lengthName}` : ""}</p>
          {list.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 xl:grid-cols-3">{list.map((p, i) => <ProductCard key={p.handle} p={p} eager={i < 3} />)}</div>
          ) : (
            <div className="rounded-pill bg-stone p-8 text-center">
              <p>Nothing matches those filters.</p>
              <button type="button" onClick={() => { setFabric([]); setMine(false); }} className="btn btn-ghost mt-4">Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
