// Bespoke register-interest, kept on this device only until the shop has an inbox for it.
export type Interest = { name: string; contact: string; note: string; savedOn: string };
const KEY = "iana-bespoke-interest";

export function loadInterest(): Interest | null {
  try { const v = localStorage.getItem(KEY); return v ? (JSON.parse(v) as Interest) : null; } catch { return null; }
}
export function saveInterest(i: Interest): boolean {
  try { localStorage.setItem(KEY, JSON.stringify(i)); return true; } catch { return false; }
}
export function clearInterest() {
  try { localStorage.removeItem(KEY); } catch { /* private mode */ }
}
