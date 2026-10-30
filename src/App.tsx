import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import { LengthProvider } from "./lib/length";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductPage } from "./pages/ProductPage";
import { FindYourLength, Visit } from "./pages/Info";
import { NotFound } from "./pages/NotFound";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LengthProvider>
        <ScrollTop />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-paper focus:px-4 focus:py-3">Skip to content</a>
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop/:handle" element={<Shop />} />
            <Route path="/products/:handle" element={<ProductPage />} />
            <Route path="/find-your-length" element={<FindYourLength />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </LengthProvider>
    </BrowserRouter>
  );
}
