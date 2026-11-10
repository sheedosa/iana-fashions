import type { ComponentProps, MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Link, useNavigate } from "react-router-dom";

type Doc = Document & { startViewTransition?: (cb: () => void) => unknown };

/** A link that carries a shared element across the page change (the picture on a card becomes the picture on its page).
    Falls back to a plain link where the browser has no view transitions, on modified clicks, and under reduced motion. */
export function VLink({ to, onClick, ...rest }: ComponentProps<typeof Link> & { to: string }) {
  const navigate = useNavigate();
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    const doc = document as Doc;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    onClick?.(e); // the card names its picture here, only when a transition will run
    e.preventDefault();
    doc.startViewTransition(() => flushSync(() => navigate(to)));
  };
  return <Link to={to} onClick={go} {...rest} />;
}

/** The name a card picture and its product-page picture share, so one becomes the other. */
export const pieceVT = (handle: string) => `piece-${handle}`;
