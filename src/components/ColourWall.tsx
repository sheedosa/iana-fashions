import { useState } from "react";
import { Link } from "react-router-dom";
import { Drape, FoldedChip, mix } from "./Art";
import { store } from "../lib/store";
import { gbp } from "../data/site";

/** The home hero. A wall of the real hijab colours as folded chips; choosing one drapes the large hijab in it,
    names it, and links to the styles that come in that colour. */
export function ColourWall() {
  const wall = store.hijabWall();
  const [name, setName] = useState("Blush");
  const pick = wall.find((w) => w.colour.name === name) ?? wall[0];
  const lower = pick.colour.name.toLowerCase();
  const n = pick.styles.length;
  const shop = `/shop/hijabs?colour=${encodeURIComponent(pick.colour.name)}`;

  return (
    <section aria-label="Hijab colours">
      <div className="wrap hero-grid">
        <div className="hero-copy flex flex-col gap-5">
          <h1 className="t-hero">Hijabs in your colour, abayas altered to fit you.</h1>
          <p className="lede hidden text-mute lg:block">About twenty hijab styles, each in five colours or more. New abayas every week, and every one can be taken up or amended in our Tooting shop.</p>
        </div>

        <div className="hero-wall flex flex-col gap-2">
          <p id="wall-hint" className="text-mute">Pick a colour to see it draped.</p>
          <div className="wall" role="group" aria-labelledby="wall-hint">
            {wall.map(({ colour }) => (
              <button key={colour.name} type="button" className="fchip" aria-pressed={colour.name === pick.colour.name} aria-label={colour.name} title={colour.name} onClick={() => setName(colour.name)}>
                <FoldedChip colour={colour} />
              </button>
            ))}
          </div>
        </div>

        <div className="hero-stage">
          <div className="stage" style={{ backgroundColor: mix("#fbfbf9", pick.colour.hex, 0.2) }}>
            <Drape colour={pick.colour} />
            <div className="flex flex-col gap-3 sm:gap-4" aria-live="polite">
              <p className="voice-lg">{pick.colour.name}</p>
              <p>{n === 1 ? "One hijab style comes" : `${n} hijab styles come`} in {lower}.</p>
              <ul className="hidden flex-col border-t border-ink/30 sm:flex">
                {pick.styles.map((p) => (
                  <li key={p.handle} className="border-b border-ink/15">
                    <Link to={`/products/${p.handle}?colour=${encodeURIComponent(pick.colour.name)}`} className="flex min-h-11 items-baseline justify-between gap-3 py-2 hover:underline">
                      <span className="t-card">{p.title}</span><span>{gbp(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="small hidden sm:block">Sample styles and prices.</p>
              <Link to={shop} className="btn btn-ink self-start">See {n === 1 ? "it" : "them"} in {lower}</Link>
            </div>
          </div>
        </div>

        <div className="hero-more flex flex-col gap-4">
          <p className="lede text-mute lg:hidden">About twenty hijab styles, each in five colours or more. New abayas every week, and every one can be taken up or amended in our Tooting shop.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Link to="/shop/new-in" className="link tap">Shop new this week</Link>
            <Link to="/alterations" className="link tap">How alterations work</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
