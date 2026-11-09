import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductPage } from "./pages/ProductPage";
import { Alterations, DeliveryReturns, Visit } from "./pages/Info";
import { NotFound } from "./pages/NotFound";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:handle" element={<Shop />} />
          <Route path="/products/:handle" element={<ProductPage />} />
          <Route path="/alterations" element={<Alterations />} />
          <Route path="/find-your-length" element={<Navigate to="/alterations" replace />} />
          <Route path="/delivery-returns" element={<DeliveryReturns />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
