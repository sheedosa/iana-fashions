import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function NotFound() {
  return (
    <section className="wrap flex flex-col items-center gap-4 py-24 text-center">
      <Seo title="Page not found" path="/404" description="That page isn't here." noindex />
      <h1 className="text-[44px]">That page isn't here</h1>
      <p className="text-mute">It may have moved. Try the latest pieces instead.</p>
      <Link to="/shop/new-in" className="btn btn-ink">Shop new in</Link>
    </section>
  );
}
