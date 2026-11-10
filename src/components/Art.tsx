import { useEffect, useId, useRef, type CSSProperties } from "react";
import type { Colour, HijabArt as Art } from "../lib/store";

// Drawn imagery: flat fills from the palette, 1.5px strokes, no gradients.

export function mix(hex: string, to: string, t: number) {
  const a = hex.replace("#", ""), b = to.replace("#", "");
  const c = [0, 2, 4].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
const dark = (hex: string, t = 0.22) => mix(hex, "#000000", t);
const light = (hex: string, t = 0.28) => mix(hex, "#ffffff", t);
const S = { vectorEffect: "non-scaling-stroke" as const, strokeWidth: 1.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** A hijab style drawn folded in the chosen colour, until photography arrives. */
export function HijabArt({ art, colour, ground = "#d8e2dc", className = "", style }: { art: Art; colour: Colour; ground?: string; className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  const c = colour.hex, d = dark(c), l = light(c);
  const isLight = parseInt(c.slice(1, 3), 16) > 200;
  const line = isLight ? dark(c, 0.35) : light(c, 0.22);

  const shelf = mix(ground, "#45353a", 0.08);
  const texture = (clip: string, x0: number, x1: number, y0: number, y1: number) => {
    if (art.texture === "crinkle") {
      const xs = Array.from({ length: Math.floor((x1 - x0) / 20) }, (_, i) => x0 + 14 + i * 20);
      const steps = Math.ceil((y1 - y0) / 24);
      return <g clipPath={`url(#${clip})`} fill="none" stroke={line} {...S} strokeWidth={1}>{xs.map((x) => <path key={x} d={`M${x} ${y0} ${Array.from({ length: steps }, (_, i) => `q${i % 2 ? -5 : 5} 12 0 24`).join(" ")}`} />)}</g>;
    }
    if (art.texture === "sheen") return <g clipPath={`url(#${clip})`}><path d={`M${x0 + 70} ${y0} L${x0 + 112} ${y0} L${x0 + 52} ${y1} L${x0 + 10} ${y1} Z`} fill={l} /><path d={`M${x0 + 128} ${y0} L${x0 + 144} ${y0} L${x0 + 84} ${y1} L${x0 + 68} ${y1} Z`} fill={l} /></g>;
    return null;
  };
  const face = art.texture === "sheer" ? mix(c, ground, 0.18) : c;

  return (
    <svg viewBox="0 0 400 500" className={`art ${className}`} style={style} role="img" aria-label={`Drawing of the hijab, in ${colour.name.toLowerCase()}`} preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="500" fill={ground} />
      {art.shape !== "instant" && <><rect y="336" width="400" height="164" fill={shelf} /><path d="M0 336 H400" stroke={mix(ground, "#45353a", 0.25)} {...S} /></>}
      {art.shape === "long" && (
        <g>
          <defs><clipPath id={`c${id}`}><path d="M118 196 H306 a4 4 0 0 1 4 4 V332 a4 4 0 0 1 -4 4 H118 C96 336 88 312 88 266 C88 220 96 196 118 196 Z" /></clipPath></defs>
          <path d="M126 204 H314 a4 4 0 0 1 4 4 V336 H126 Z" fill={d} />
          <path d="M224 330 C232 372 214 410 228 456 L296 456 C288 412 304 372 298 330 Z" fill={art.texture === "sheer" ? mix(c, ground, 0.35) : d} stroke={d} {...S} />
          <path d="M230 446 L292 446" stroke={line} fill="none" {...S} strokeDasharray="3 4" />
          <path d="M118 196 H306 a4 4 0 0 1 4 4 V332 a4 4 0 0 1 -4 4 H118 C96 336 88 312 88 266 C88 220 96 196 118 196 Z" fill={face} stroke={d} {...S} />
          {texture(`c${id}`, 88, 310, 196, 336)}
          <path d="M120 198 C106 212 102 236 102 266 C102 296 106 320 120 334" stroke={line} fill="none" {...S} />
          {art.texture === "sheer" && <path d="M150 196 C140 230 160 300 150 336 M210 196 C200 240 222 290 212 336" stroke={d} fill="none" {...S} strokeWidth={1} />}
        </g>
      )}
      {art.shape === "square" && (
        <g>
          <defs><clipPath id={`c${id}`}><rect x="96" y="186" width="208" height="150" rx="4" /></clipPath></defs>
          <rect x="104" y="194" width="208" height="142" rx="4" fill={d} />
          <rect x="96" y="186" width="208" height="150" rx="4" fill={face} stroke={d} {...S} />
          {texture(`c${id}`, 96, 304, 186, 336)}
          <path d="M96 186 L304 336" stroke={line} fill="none" {...S} />
          <path d="M168 336 L304 336 L240 444 Z" fill={d} stroke={d} {...S} strokeLinejoin="round" />
          <path d="M184 344 L292 344" stroke={line} fill="none" {...S} strokeDasharray="3 4" />
        </g>
      )}
      {art.shape === "instant" && (
        <g>
          <path d="M120 96 H280" stroke={mix(ground, "#45353a", 0.35)} {...S} />
          <circle cx="200" cy="112" r="7" fill={ground} stroke={mix(ground, "#45353a", 0.45)} {...S} />
          <path d="M200 120 C150 124 128 172 126 236 L96 428 H304 L274 236 C272 172 250 124 200 120 Z" fill={c} stroke={d} {...S} />
          <path d="M132 214 C166 250 234 250 268 214 L272 238 C236 276 164 276 128 238 Z" fill={isLight ? d : l} stroke={d} {...S} />
          <path d="M112 330 C150 350 250 350 288 330 M104 380 C148 402 252 402 296 380" stroke={line} fill="none" {...S} strokeWidth={1} />
          <path d="M100 416 H300" stroke={line} fill="none" {...S} strokeDasharray="3 4" />
        </g>
      )}
    </svg>
  );
}

/** One colour as a folded piece of cloth: the fold on the left, a stitched hem on the right, the layer beneath showing. */
export function FoldedChip({ colour }: { colour: Colour }) {
  const c = colour.hex, d = dark(c, 0.24);
  const isLight = parseInt(c.slice(1, 3), 16) > 200;
  const line = isLight ? dark(c, 0.3) : light(c, 0.24);
  return (
    <svg viewBox="0 0 48 38" aria-hidden="true">
      <path d="M6 27 H43 a2 2 0 0 1 2 2 V34 a2 2 0 0 1 -2 2 H8 C5 36 3 34 3 31.5 C3 29 4 27 6 27 Z" fill={d} stroke={d} {...S} strokeWidth={1} />
      <path d="M8 3 H43 a2 2 0 0 1 2 2 V28 a2 2 0 0 1 -2 2 H8 C4.5 30 3 24 3 16.5 C3 9 4.5 3 8 3 Z" fill={c} stroke={d} {...S} strokeWidth={1} />
      <path d="M9 5.5 C6.6 8.5 6.4 24 9 27.5" fill="none" stroke={line} {...S} strokeWidth={1} />
      <path d="M40.5 7 V26" fill="none" stroke={line} {...S} strokeWidth={1} strokeDasharray="2 2.5" />
    </svg>
  );
}

/** Colour picks, as folded chips. `sm` is a quiet read-only row for cards. */
export function Swatches({ colours, active, onPick, size = "md", label, className = "" }: { colours: Colour[]; active?: string | null; onPick?: (c: Colour) => void; size?: "sm" | "md" | "lg"; label: string; className?: string }) {
  if (!onPick) {
    return (
      <ul className={`flex flex-wrap items-center gap-1 ${className}`} aria-label={label}>
        {colours.map((c) => <li key={c.name}><span className="mini" style={{ background: c.hex }} title={c.name} /><span className="sr-only">{c.name}</span></li>)}
      </ul>
    );
  }
  return (
    <div className={`${className || (size === "lg" ? "chips chips-lg" : "chips")}`} role="group" aria-label={label}>
      {colours.map((c) => (
        <button key={c.name} type="button" className="fchip" aria-pressed={active === c.name} aria-label={c.name} title={c.name} onClick={() => onPick(c)}>
          <FoldedChip colour={c} />
        </button>
      ))}
    </div>
  );
}

/** The large hijab on the home page: one length of cloth hung over a rail, drawn in the chosen colour.
    The fills ease to the new colour and the cloth settles when the colour changes. */
export function Drape({ colour, className = "" }: { colour: Colour; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const first = useRef(true);
  const c = colour.hex, d = dark(c, 0.16), dd = dark(c, 0.32);
  const isLight = parseInt(c.slice(1, 3), 16) > 200;
  const line = isLight ? dark(c, 0.3) : light(c, 0.26);
  const ink = "#45353a";

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = ref.current;
    if (!el?.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate([{ transform: "scaleY(0.975) skewX(-0.6deg)" }, { transform: "none" }], { duration: 760, easing: "cubic-bezier(.16,1,.3,1)" });
  }, [c]);

  return (
    <svg ref={ref} viewBox="0 0 400 520" className={`drape drape-in ${className}`} role="img" aria-label={`Drawing of a hijab hung over a rail, in ${colour.name.toLowerCase()}`}>
      <path d="M58 20 V50 M342 20 V50" fill="none" stroke={ink} {...S} />
      <path d="M22 54 H378" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />
      {/* the shorter fall, behind */}
      <path d="M236 52 L316 50 C326 150 346 246 362 340 C346 350 334 338 318 346 C306 352 298 347 288 350 Z" fill={dd} stroke={dd} {...S} />
      <path d="M300 62 C310 160 324 250 340 340" fill="none" stroke={d} {...S} strokeWidth={1} />
      {/* the long fall, in front: gathered at the rail, opening towards the hem */}
      <path d="M100 58 C100 40 280 40 280 58 C288 190 306 330 330 462 C304 480 282 460 256 476 C230 492 204 464 176 480 C148 496 116 474 62 482 C84 340 98 190 100 58 Z" fill={c} stroke={d} {...S} />
      <path d="M146 46 C142 200 122 370 108 481 C126 487 146 490 164 484 C166 370 160 200 158 45 Z" fill={d} />
      <path d="M214 44 C220 200 236 360 250 478 C264 470 280 468 294 470 C276 350 240 200 226 44 Z" fill={d} />
      <path d="M120 60 C116 200 98 350 86 478 M188 46 C190 210 200 366 208 476 M262 52 C272 200 300 350 318 466" fill="none" stroke={line} {...S} strokeWidth={1} />
      <path d="M100 58 C100 40 280 40 280 58" fill="none" stroke={d} {...S} />
      <path d="M70 467 C130 481 262 474 324 449" fill="none" stroke={line} {...S} strokeDasharray="3 4" />
    </svg>
  );
}

/** A designed slot where a photograph will go. */
export function PhotoSlot({ caption, className = "" }: { caption: string; className?: string }) {
  return (
    <div className={`flex flex-col justify-between bg-ink p-5 text-paper sm:p-6 ${className}`} role="img" aria-label={`Photo to come: ${caption}`}>
      <svg viewBox="0 0 64 40" className="h-8 w-12 self-end text-on-ink" aria-hidden="true" fill="none" stroke="currentColor" {...S}><path d="M32 8a4 4 0 1 1 4 4c-2 0-4 1-4 3v3L4 34h56L32 18" /></svg>
      <div className="flex flex-col gap-2" aria-hidden="true">
        <span className="voice text-paper">Photo to come</span>
        <span className="text-base text-on-ink">{caption}</span>
      </div>
    </div>
  );
}

/** Front view of an abaya with the three in-shop amendments marked. */
export function AlterationsFigure({ className = "" }: { className?: string }) {
  const ink = "#45353a";
  return (
    <svg viewBox="0 0 470 480" className={className} role="img" aria-label="Drawing of an abaya marked where the shop can take up the hem, shorten the sleeves and take in the sides">
      <path d="M140 60 Q160 76 180 60 L222 72 L288 228 L258 240 L214 124 L238 440 L82 440 L106 124 L62 240 L32 228 L98 72 Z" fill="#fbfbf9" stroke={ink} {...S} />
      <path d="M140 60 Q160 76 180 60" fill="none" stroke={ink} {...S} />
      <path d="M160 70 L160 440" fill="none" stroke={ink} {...S} strokeDasharray="2 6" />
      {/* hem taken up */}
      <path d="M86 408 L234 408" stroke={ink} fill="none" {...S} strokeDasharray="6 5" />
      <path d="M250 440 L250 412 M244 420 L250 410 L256 420" stroke={ink} fill="none" {...S} />
      {/* sleeve shortened */}
      <path d="M272 202 L244 213" stroke={ink} fill="none" {...S} strokeDasharray="6 5" />
      {/* sides taken in */}
      <path d="M204 150 L224 380" stroke={ink} fill="none" {...S} strokeDasharray="6 5" />
      <g fill={ink} fontFamily="Instrument Sans, sans-serif" fontSize="19">
        <path d="M296 206 L330 206" stroke={ink} {...S} /><text x="338" y="211">Sleeves</text><text x="338" y="234">shortened</text>
        <path d="M226 300 L330 300" stroke={ink} {...S} /><text x="338" y="305">Sides</text><text x="338" y="328">taken in</text>
        <path d="M262 424 L330 424" stroke={ink} {...S} /><text x="338" y="429">Hem</text><text x="338" y="452">taken up</text>
      </g>
    </svg>
  );
}

/** Schematic map of the shop by Tooting Broadway. Not to scale. */
export function ShopMap({ className = "" }: { className?: string }) {
  const ink = "#45353a";
  return (
    <svg viewBox="0 0 560 360" className={className} role="img" aria-label="Sketch map: the shop is on Mitcham Road, a short walk east of Tooting Broadway station">
      <rect width="560" height="360" fill="#d8e2dc" />
      <g fill="none" stroke="#fbfbf9" strokeWidth="18" strokeLinecap="round">
        <path d="M150 180 L540 230" /><path d="M150 180 L60 30" /><path d="M150 180 L40 340" /><path d="M150 180 L300 20" />
      </g>
      <g fill="none" stroke={ink} {...S} strokeWidth={1}>
        <path d="M150 180 L540 230" /><path d="M150 180 L60 30" /><path d="M150 180 L40 340" /><path d="M150 180 L300 20" />
      </g>
      <circle cx="150" cy="180" r="11" fill="#fbfbf9" stroke={ink} {...S} />
      <path d="M144 180 H156" stroke={ink} {...S} />
      <path d="M380 210 C380 190 404 190 404 210 C404 224 392 236 392 236 C392 236 380 224 380 210 Z" fill={ink} />
      <circle cx="392" cy="208" r="4" fill="#ffcad4" />
      <g fill={ink} fontFamily="Instrument Sans, sans-serif" fontSize="20">
        <text x="168" y="232">Tooting Broadway</text>
        <text x="300" y="270">I&amp;A, 84 Mitcham Road</text>
        <text x="214" y="178" transform="rotate(7.3 214 178)" fontSize="15" letterSpacing="2">MITCHAM ROAD</text>
        <text x="450" y="346" fontSize="15">Not to scale</text>
      </g>
    </svg>
  );
}

export function Chevron() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="shrink-0 transition-transform [details[open]_&]:rotate-180"><path d="M3 6l5 5 5-5" /></svg>;
}
