import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/Home/HomePage';
import { CategoryPage } from './components/Product/CategoryPage';
import { ProductDetail } from './components/Product/ProductDetail';
import { GarmentCustomizer } from './components/Customizer/GarmentCustomizer';
import { CartView } from './components/CartCheckout/CartView';
import { CheckoutView } from './components/CartCheckout/CheckoutView';
import { OrderTrackingView } from './components/CartCheckout/OrderTrackingView';
import { ClientArea } from './components/ClientArea/ClientArea';
import { AdminPortal } from './components/Admin/AdminPortal';
import { StaticPages } from './components/Pages/StaticPages';
import { InvoicePackingModal } from './components/ClientArea/InvoicePackingModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { LanguageTranslator } from './i18n/LanguageTranslator';

const MainApp: React.FC = () => {
  const { activePage, toast, activeDocumentModal, language } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfb] text-gray-900 selection:bg-black selection:text-white">
      <LanguageTranslator language={language} />
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 transition-all transform animate-in fade-in duration-200">
          <div
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold border ${
              toast.type === 'success' ? 'bg-neutral-900 text-white border-neutral-700' :
              toast.type === 'warning' ? 'bg-amber-500 text-white border-amber-600' :
              'bg-blue-600 text-white border-blue-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-white shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-white shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1 flex flex-col">
        {activePage === 'home' && <HomePage />}
        {activePage === 'category' && <CategoryPage />}
        {activePage === 'product_detail' && <ProductDetail />}
        {activePage === 'customizer' && <GarmentCustomizer />}
        {activePage === 'cart' && <CartView />}
        {activePage === 'checkout' && <CheckoutView />}
        {activePage === 'order_tracking' && <OrderTrackingView />}
        {activePage === 'client_area' && <ClientArea />}
        {activePage === 'admin' && <AdminPortal />}
        {['catalogs', 'quality', 'stock_search', 'contact', 'claim_policy', 'privacy_policy', 'terms'].includes(activePage) && (
          <StaticPages />
        )}
      </main>

      {/* Printable Invoice / Packing List Modal */}
      {activeDocumentModal.isOpen && <InvoicePackingModal />}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
