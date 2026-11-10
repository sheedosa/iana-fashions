import { useEffect, useId, useRef, type CSSProperties } from "react";
import type { Colour, HijabArt as Art } from "../lib/store";

// Drawn imagery: flat fills in the product's own colour, 1.5px strokes, no gradients.
export const OAT = "#efe5d8";
const INK = "#45353a";
const BLUSH = "#fff4f2";

export function mix(hex: string, to: string, t: number) {
  const a = hex.replace("#", ""), b = to.replace("#", "");
  const c = [0, 2, 4].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
const dark = (hex: string, t = 0.22) => mix(hex, "#000000", t);
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => { const v = parseInt(hex.slice(i, i + 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
/** A quiet ground for a drawn piece: Oat warmed with the piece's own colour. */
export const tint = (hex: string, t = 0.3) => mix(OAT, hex, t);
/** The home field for a colour: a step lighter or darker than the cloth so the drape stands off it,
    moved further if needed until the text on it passes AA. */
export function fieldFor(hex: string): { bg: string; fg: string; dark: boolean } {
  const isDark = lum(hex) < 0.3;
  const fg = isDark ? BLUSH : INK;
  let t = isDark ? 0.38 : 0.14, bg = mix(hex, isDark ? "#000000" : "#ffffff", t);
  while (contrast(bg, fg) < 4.8 && t < 0.95) { t += 0.05; bg = mix(hex, isDark ? "#000000" : "#ffffff", t); }
  return { bg, fg, dark: isDark };
}
const light = (hex: string, t = 0.28) => mix(hex, "#ffffff", t);
const S = { vectorEffect: "non-scaling-stroke" as const, strokeWidth: 1.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** A hijab style drawn folded in the chosen colour, until photography arrives. */
export function HijabArt({ art, colour, ground = OAT, className = "", style }: { art: Art; colour: Colour; ground?: string; className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  const c = colour.hex, d = dark(c), l = light(c);
  const isLight = parseInt(c.slice(1, 3), 16) > 200;
  const line = isLight ? dark(c, 0.35) : light(c, 0.22);

  const shelf = mix(ground, "#45353a", 0.07);
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
      {art.shape !== "instant" && <rect y="336" width="400" height="164" fill={shelf} />}
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
      <path d="M6 27 H43 a2 2 0 0 1 2 2 V34 a2 2 0 0 1 -2 2 H8 C5 36 3 34 3 31.5 C3 29 4 27 6 27 Z" fill={d} stroke="currentColor" {...S} strokeWidth={1} />
      <path d="M8 3 H43 a2 2 0 0 1 2 2 V28 a2 2 0 0 1 -2 2 H8 C4.5 30 3 24 3 16.5 C3 9 4.5 3 8 3 Z" fill={c} stroke="currentColor" {...S} strokeWidth={1} />
      <path d="M9 5.5 C6.6 8.5 6.4 24 9 27.5" fill="none" stroke={line} {...S} strokeWidth={1} />
      <path d="M40.5 7 V26" fill="none" stroke={line} {...S} strokeWidth={1} strokeDasharray="2 2.5" />
    </svg>
  );
}

/** Colour picks, as folded chips. */
export function Swatches({ colours, active, onPick, label, className = "chips" }: { colours: Colour[]; active?: string | null; onPick: (c: Colour) => void; label: string; className?: string }) {
  return (
    <div className={className} role="group" aria-label={label}>
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
export function Drape({ colour, className = "", arrive = false }: { colour: Colour; className?: string; arrive?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const first = useRef(true);
  const c = colour.hex, d = dark(c, 0.16), dd = dark(c, 0.32);
  const isLight = parseInt(c.slice(1, 3), 16) > 200;
  const line = isLight ? dark(c, 0.3) : light(c, 0.26);
  const ink = "currentColor";

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = ref.current;
    if (!el?.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate([{ transform: "scaleY(0.975) skewX(-0.6deg)" }, { transform: "none" }], { duration: 760, easing: "cubic-bezier(.16,1,.3,1)" });
  }, [c]);

  return (
    <svg ref={ref} viewBox="0 0 400 520" className={`drape ${arrive ? "drape-in" : ""} ${className}`} role="img" aria-label={`Drawing of a hijab hung over a rail, in ${colour.name.toLowerCase()}`}>
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

/** A co-ord drawn flat in its colour: the top laid over the trousers. Used until the set is photographed. */
export function CoordArt({ colour, wide = false, trim = false, ground = OAT, className = "", style }: { colour: Colour; wide?: boolean; trim?: boolean; ground?: string; className?: string; style?: CSSProperties }) {
  const c = colour.hex, d = dark(c, 0.2), dd = dark(c, 0.1);
  const isLight = parseInt(c.slice(1, 3), 16) > 200;
  const line = isLight ? dark(c, 0.32) : light(c, 0.26);
  const legs = wide
    ? "M222 196 H352 L372 520 H296 L288 290 L276 520 H206 Z"
    : "M226 196 H348 L356 520 H298 L288 290 L278 520 H220 Z";
  return (
    <svg viewBox="0 0 400 600" className={`art ${className}`} style={style} role="img" aria-label={`Drawing of the co-ord set, in ${colour.name.toLowerCase()}`} preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="600" fill={ground} />
      <g>
        <path d={legs} fill={dd} stroke={d} {...S} />
        <path d="M226 212 H350" fill="none" stroke={line} {...S} strokeDasharray="3 4" />
        <path d={wide ? "M212 506 H274 M298 506 H370" : "M224 506 H276 M300 506 H354"} fill="none" stroke={line} {...S} strokeDasharray="3 4" />
        <path d="M288 196 V290" fill="none" stroke={d} {...S} />
      </g>
      <g>
        <path d="M128 96 Q160 120 192 96 L246 112 L300 316 L262 328 L226 206 L236 440 L84 440 L94 206 L58 328 L20 316 L74 112 Z" fill={c} stroke={d} {...S} />
        <path d="M128 96 Q160 120 192 96" fill="none" stroke={d} {...S} />
        {trim && <path d="M118 100 Q160 140 202 100 M136 112 Q160 132 184 112 M160 124 V170" fill="none" stroke={line} {...S} strokeDasharray="2 4" />}
        <path d="M94 206 L104 150 M226 206 L216 150" fill="none" stroke={d} {...S} />
        <path d="M88 428 H232" fill="none" stroke={line} {...S} strokeDasharray="3 4" />
        <path d="M112 440 V380 M208 440 V380" fill="none" stroke={d} {...S} />
        <path d="M26 306 L62 318 M258 318 L294 306" fill="none" stroke={line} {...S} strokeDasharray="3 4" />
      </g>
    </svg>
  );
}

/** A designed slot where a photograph will go: it says what will be shot. */
export function PhotoSlot({ caption, className = "" }: { caption: string; className?: string }) {
  return (
    <div className={`flex flex-col justify-between bg-oat p-6 text-ink sm:p-10 ${className}`} role="img" aria-label={`To be photographed: ${caption}`}>
      <svg viewBox="0 0 120 150" className="w-24 sm:w-32" aria-hidden="true" fill="none" stroke="currentColor" {...S}>
        <path d="M60 14a7 7 0 1 1 7 7c-4 0-7 2-7 6v5L8 60h104L60 32" />
        <path d="M20 60 V140 M100 60 V140" strokeDasharray="3 5" />
      </svg>
      <div className="flex flex-col gap-1" aria-hidden="true">
        <span className="t-sub">To be photographed</span>
        <span>{caption}</span>
      </div>
    </div>
  );
}

/** Front view of an abaya with the three in-shop amendments marked. */
export function AlterationsFigure({ className = "" }: { className?: string }) {
  const ink = INK;
  return (
    <svg viewBox="0 0 470 480" className={className} role="img" aria-label="Drawing of an abaya marked where the shop can take up the hem, shorten the sleeves and take in the sides">
      <path d="M140 60 Q160 76 180 60 L222 72 L288 228 L258 240 L214 124 L238 440 L82 440 L106 124 L62 240 L32 228 L98 72 Z" fill="#ffcad4" stroke={ink} {...S} />
      <path d="M140 60 Q160 76 180 60" fill="none" stroke={ink} {...S} />
      {/* hem taken up */}
      <path d="M86 408 L234 408" stroke="#8a2d43" fill="none" {...S} strokeWidth={2} strokeDasharray="6 5" />
      {/* sleeve shortened */}
      <path d="M272 202 L244 213" stroke="#8a2d43" fill="none" {...S} strokeWidth={2} strokeDasharray="6 5" />
      {/* sides taken in */}
      <path d="M204 150 L224 380" stroke="#8a2d43" fill="none" {...S} strokeWidth={2} strokeDasharray="6 5" />
      <g fill={ink} fontFamily="Instrument Sans, sans-serif" fontSize="19">
        <text x="312" y="211">Sleeves</text><text x="312" y="234">shortened</text>
        <text x="312" y="305">Sides</text><text x="312" y="328">taken in</text>
        <text x="312" y="415">Hem</text><text x="312" y="438">taken up</text>
      </g>
    </svg>
  );
}

/** Schematic map of the shop by Tooting Broadway. Not to scale. */
export function ShopMap({ className = "" }: { className?: string }) {
  const ink = INK;
  return (
    <svg viewBox="0 0 560 360" className={className} role="img" aria-label="Sketch map: the shop is on Mitcham Road, a short walk east of Tooting Broadway station">
      <rect width="560" height="360" fill={OAT} />
      <g fill="none" stroke={BLUSH} strokeWidth="22" strokeLinecap="round">
        <path d="M150 180 L540 230" /><path d="M150 180 L60 30" /><path d="M150 180 L40 340" /><path d="M150 180 L300 20" />
      </g>
      <circle cx="150" cy="180" r="12" fill={ink} />
      <path d="M380 208 C380 188 404 188 404 208 C404 222 392 236 392 236 C392 236 380 222 380 208 Z" fill="#8a2d43" />
      <circle cx="392" cy="207" r="4" fill="#ffcad4" />
      <g fill={ink} fontFamily="Instrument Sans, sans-serif" fontSize="20">
        <text x="172" y="232">Tooting Broadway</text>
        <text x="300" y="272">I&amp;A, 84 Mitcham Road</text>
        <text x="214" y="170" transform="rotate(7.3 214 170)" fontSize="16">Mitcham Road</text>
        <text x="450" y="346" fontSize="16">Not to scale</text>
      </g>
    </svg>
  );
}
