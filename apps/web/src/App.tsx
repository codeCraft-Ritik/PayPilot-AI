import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { LandingPage } from './features/landing/LandingPage.js';
import { ShoppingWorkspace } from './features/assistant/ShoppingWorkspace.js';
import { CataloguePage } from './features/catalogue/CataloguePage.js';
import { ComparisonView } from './features/comparison/ComparisonView.js';
import { OrderConfirmationPage } from './features/orders/OrderConfirmationPage.js';
import { InsightsPage } from './features/insights/InsightsPage.js';
import { CartDrawer } from './features/cart/CartDrawer.js';
import { CheckoutModal } from './features/checkout/CheckoutModal.js';
import { ProductDetailsModal } from './features/details/ProductDetailsModal.js';

export const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/workspace" element={<ShoppingWorkspace />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/compare" element={<ComparisonView />} />
          <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailsModal />
    </div>
  );
};

export default App;
