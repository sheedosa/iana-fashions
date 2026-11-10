import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Drape, FoldedChip, fieldFor, mix } from "./Art";
import { store } from "../lib/store";
import { gbp } from "../data/site";

/** The home hero: the first screen is a field in the chosen hijab colour. Every hijab colour is a folded chip;
    choosing one repaints the field, redrapes the hijab, names the colour and links to the styles that come in it. */
export function ColourWall() {
  const wall = store.hijabWall();
  const [name, setName] = useState("Blush");
  const pick = wall.find((w) => w.colour.name === name) ?? wall[0];
  const lower = pick.colour.name.toLowerCase();
  const n = pick.styles.length;
  const from = Math.min(...pick.styles.map((p) => p.price));
  const f = fieldFor(pick.colour.hex);

  // The header lies over this field, so it follows the field's tone.
  useEffect(() => {
    document.documentElement.dataset.top = f.dark ? "dark" : "light";
    return () => { delete document.documentElement.dataset.top; };
  }, [f.dark]);

  const btn = { "--btn-bg": f.dark ? "#fff4f2" : "#8a2d43", "--btn-fg": f.dark ? "#8a2d43" : "#fff4f2" } as CSSProperties;

  return (
    <section className="field-hero first" style={{ backgroundColor: f.bg, color: f.fg }} aria-label="Hijab colours">
      <div className="field-grid">
        <h1 className="t-hero field-head">Hijabs in your colour</h1>

        <div className="field-wall flex flex-col gap-1">
          <p id="wall-hint">Pick a colour.</p>
          <div className="wall" role="group" aria-labelledby="wall-hint">
            {wall.map(({ colour }) => (
              <button key={colour.name} type="button" className="fchip" aria-pressed={colour.name === pick.colour.name} aria-label={colour.name} title={colour.name} onClick={() => setName(colour.name)}>
                <FoldedChip colour={colour} />
              </button>
            ))}
          </div>
        </div>

        <div className="field-pick flex flex-col items-start gap-3" aria-live="polite">
          <p className="colour-name">{pick.colour.name}</p>
          <p>{n === 1 ? "One sample style" : `${n} sample styles`} in {lower}, from {gbp(from)}.</p>
          <ul className="hidden flex-wrap gap-x-6 min-[900px]:flex">
            {pick.styles.map((p) => (
              <li key={p.handle}><Link to={`/products/${p.handle}?colour=${encodeURIComponent(pick.colour.name)}`} className="link tap">{p.title}</Link></li>
            ))}
          </ul>
          <Link to={`/shop/hijabs?colour=${encodeURIComponent(pick.colour.name)}`} className="btn btn-field whitespace-nowrap max-[899px]:px-5" style={btn}><span>See<span className="max-[899px]:sr-only"> hijabs in {lower}</span><span className="min-[900px]:hidden" aria-hidden="true"> them</span></span></Link>
        </div>

        <div className="field-drape"><Drape colour={f.dark ? { name: pick.colour.name, hex: mix(pick.colour.hex, "#ffffff", 0.14) } : pick.colour} arrive /></div>
      </div>
    </section>
  );
}
