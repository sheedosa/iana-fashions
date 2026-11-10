import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function NotFound() {
  return (
    <section className="first bg-pink">
      <Seo title="Page not found" path="/404" description="That page isn't here." noindex />
      <div className="wrap flex flex-col items-start gap-5 pb-20 pt-12 sm:pb-28 sm:pt-20">
        <h1 className="t-hero">That page isn't here</h1>
        <p className="lede">It may have moved. The hijabs and this week's new pieces are still where they were.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3"><Link to="/shop/hijabs" className="btn">See the hijabs</Link><Link to="/shop/new-in" className="link tap">New this week</Link></div>
      </div>
    </section>
  );
}
