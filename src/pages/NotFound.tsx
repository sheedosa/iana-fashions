import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function NotFound() {
  return (
    <section className="wrap flex flex-col items-start gap-5 py-20 sm:py-28">
      <Seo title="Page not found" path="/404" description="That page isn't here." noindex />
      <h1 className="t-hero">That page isn't here</h1>
      <p className="lede text-mute">It may have moved. Try what's new this week instead.</p>
      <div className="flex flex-wrap gap-3"><Link to="/shop/new-in" className="btn btn-ink">Shop new this week</Link><Link to="/shop/hijabs" className="btn btn-ghost">Browse hijabs</Link></div>
    </section>
  );
}
