import { Link, useParams, useSearchParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Tile } from "../components/Piece";
import { Swatches } from "../components/Art";
import { NotFound } from "./NotFound";
import { store } from "../lib/store";
import { SITE } from "../data/site";

const ALL = { handle: "all", title: "Everything", blurb: "Every hijab, abaya and co-ord in the shop." };
// Every fourth and first picture is the taller one, so neighbouring columns never line up.
const tall = (i: number) => i % 4 === 0 || i % 4 === 3;

export function Shop() {
  const { handle = "all" } = useParams();
  const c = handle === "all" ? ALL : store.collection(handle);
  const [params, setParams] = useSearchParams();
  if (!c) return <NotFound />;

  const base = store.products({ collection: handle });
  const colours = store.colours(base);
  const colour = colours.find((x) => x.name === params.get("colour"))?.name ?? null;
  // Hijabs are chosen by fabric first, then colour.
  const fabrics = handle === "hijabs" ? store.fabrics(base) : [];
  const fabric = fabrics.find((f) => f === params.get("fabric")) ?? null;
  const list = store.products({ collection: handle, fabric: fabric ? [fabric] : [], colour });
  const set = (next: { colour?: string | null; fabric?: string | null }) => {
    const q: Record<string, string> = {};
    const f = next.fabric === undefined ? fabric : next.fabric;
    const k = next.colour === undefined ? colour : next.colour;
    if (f) q.fabric = f;
    if (k) q.colour = k;
    setParams(q, { replace: true, preventScrollReset: true });
  };
  const hasAbayas = base.some(store.isAbaya);
  const dealt = store.dealColours(list);

  return (
    <>
      <Seo title={c.title} path={`/shop/${handle}`} description={`${c.blurb} From I&A Fashions in Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/shop/${handle}` }]),
          { "@context": "https://schema.org", "@type": "CollectionPage", name: c.title, description: c.blurb }]} />

      <section className="first bg-pink">
        <div className="wrap flex flex-col gap-4 pb-8 pt-6 sm:pb-12 sm:pt-12">
          <h1 className="t-hero">{c.title}</h1>
          <p className="lede">{c.blurb}{hasAbayas && handle !== "abayas" ? ` ${SITE.alterations.summary}` : ""}</p>
          {hasAbayas && <p><Link to="/alterations" className="link tap">How alterations work</Link></p>}
          {fabrics.length > 1 && (
            <div className="flex flex-wrap items-baseline gap-x-7 pt-2" role="group" aria-label="Fabric">
              <button type="button" className="pick t-sub" aria-pressed={!fabric} onClick={() => set({ fabric: null })}>All fabrics</button>
              {fabrics.map((f) => <button key={f} type="button" className="pick t-sub" aria-pressed={fabric === f} onClick={() => set({ fabric: f })}>{f}</button>)}
            </div>
          )}
        </div>
      </section>

      {colours.length > 1 && (
        <div className="ribbon">
          <Swatches colours={colours} active={colour} onPick={(x) => set({ colour: colour === x.name ? null : x.name })} label="Show pieces in this colour" className="ribbon-chips" />
        </div>
      )}

      <section className="pb-16 sm:pb-24" aria-labelledby="pieces-h">
        <h2 id="pieces-h" className="sr-only">Pieces</h2>
        <p className="flex min-h-11 flex-wrap items-baseline gap-x-4 px-[var(--gutter)] pb-4 pt-2" aria-live="polite">
          <span>
            {list.length} sample {list.length === 1 ? "piece" : "pieces"}
            {fabric && <> in {fabric.toLowerCase()}</>}
            {colour && <>{fabric ? "," : ""} in <span className="colour-name">{colour.toLowerCase()}</span></>}
            {SITE.preview && !colour && !fabric ? ", at sample prices" : ""}
          </span>
          {colour && <button type="button" className="link tap" onClick={() => set({ colour: null })}>All colours</button>}
        </p>

        {list.length ? (
          <div className="wall-pics">{list.map((p, i) => <Tile key={p.handle} p={p} tall={tall(i)} eager={i < 3} colour={colour ?? dealt.get(p.handle)} />)}</div>
        ) : (
          <div className="flex flex-col items-start gap-4 bg-oat px-[var(--gutter)] py-14">
            <p className="t-sub">No {fabric?.toLowerCase()} hijab comes in {colour?.toLowerCase()} yet.</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => set({ fabric: null })} className="btn">Every hijab in {colour?.toLowerCase()}</button>
              <button type="button" onClick={() => set({ colour: null })} className="btn btn-quiet">Every {fabric?.toLowerCase()} hijab</button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
