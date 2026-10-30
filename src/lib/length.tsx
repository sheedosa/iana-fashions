import { createContext, useContext, useState, type ReactNode } from "react";
import { LENGTHS, type LengthId } from "../data/site";

// The shopper's length, remembered across visits. At launch this moves to the customer account.
type Ctx = { length: LengthId | null; setLength: (l: LengthId | null) => void; label: string | null };
const LengthContext = createContext<Ctx>({ length: null, setLength: () => {}, label: null });
const KEY = "iana-length";

export function LengthProvider({ children }: { children: ReactNode }) {
  const [length, set] = useState<LengthId | null>(() => {
    try { const v = localStorage.getItem(KEY); return LENGTHS.some((l) => l.id === v) ? (v as LengthId) : null; } catch { return null; }
  });
  const setLength = (l: LengthId | null) => {
    set(l);
    try { if (l) localStorage.setItem(KEY, l); else localStorage.removeItem(KEY); } catch { /* private mode */ }
  };
  const l = LENGTHS.find((x) => x.id === length);
  return <LengthContext.Provider value={{ length, setLength, label: l ? `${l.name} · ${l.inches}"` : null }}>{children}</LengthContext.Provider>;
}

export const useLength = () => useContext(LengthContext);
