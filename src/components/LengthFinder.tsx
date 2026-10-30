import { useState } from "react";
import { LENGTHS, lengthForHeight } from "../data/site";
import { useLength } from "../lib/length";

// Height in, length out. Same component on Home and /find-your-length.
export function LengthFinder({ compact = false }: { compact?: boolean }) {
  const { length, setLength } = useLength();
  const [ft, setFt] = useState("");
  const [inch, setInch] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const f = Number(ft), i = Number(inch || 0);
    if (!f || f < 4 || f > 7 || i < 0 || i > 11) { setMsg("Enter your height in feet and inches, for example 5 and 5."); return; }
    const id = lengthForHeight(f * 12 + i);
    setLength(id);
    const l = LENGTHS.find((x) => x.id === id)!;
    setMsg(`${l.name} (${l.inches}") is your length. We'll show it on every page.`);
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lf-ft" className="label">Height</label>
          <div className="flex gap-2">
            <div className="relative"><input id="lf-ft" inputMode="numeric" value={ft} onChange={(e) => setFt(e.target.value.replace(/\D/g, "").slice(0, 1))} placeholder="5" className="h-12 w-20 rounded-pill border border-ink bg-paper px-3 pr-8 text-base" /><span className="pointer-events-none absolute right-3 top-3 text-mute">ft</span></div>
            <div className="relative"><input aria-label="Inches" inputMode="numeric" value={inch} onChange={(e) => setInch(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="5" className="h-12 w-20 rounded-pill border border-ink bg-paper px-3 pr-8 text-base" /><span className="pointer-events-none absolute right-3 top-3 text-mute">in</span></div>
          </div>
        </div>
        <button type="submit" className="btn btn-ink">Show my length</button>
      </form>
      <p role="status" className="min-h-6 text-sm">{msg}</p>
      <div className={`grid gap-3 ${compact ? "max-w-md" : "max-w-xl"} grid-cols-3`}>
        {LENGTHS.map((l) => (
          <button key={l.id} type="button" aria-pressed={length === l.id} onClick={() => { setLength(l.id); setMsg(`${l.name} saved. We'll show it on every page.`); }}
            className={`flex min-h-16 flex-col items-start justify-center rounded-pill border px-3 py-2 text-left transition-colors ${length === l.id ? "border-ink bg-ink text-paper" : "border-transparent bg-paper hover:border-ink"}`}>
            <span className="text-sm font-normal">{l.name} · {l.inches}"</span>
            <span className={`text-xs ${length === l.id ? "text-[#e3d6da]" : "text-mute"}`}>{l.fits}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
