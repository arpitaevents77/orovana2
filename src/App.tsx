import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ProductSections from './components/shop/ProductSections';
import IngredientsSection from './components/IngredientsSection';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import FounderStory from './components/FounderStory';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ProductPage from './components/ProductPage';
import ShopPage from './components/ShopPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import UserDashboard from './components/dashboard/UserDashboard';
import CheckoutPage from './components/CheckoutPage';
import OrderSuccessPage from './components/OrderSuccessPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'product':
        return <ProductPage productId={selectedProductId} />;
      case 'shop':
        return <ShopPage section={selectedSection} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'dashboard':
        return <UserDashboard onCheckout={() => setCurrentPage('checkout')} />;
      case 'checkout':
        return <CheckoutPage onBack={() => setCurrentPage('dashboard')} />;
      case 'order-success':
        return (
          <OrderSuccessPage 
            sessionId={checkoutSessionId}
            onContinueShopping={() => setCurrentPage('home')}
          />
        );
      default:
        return (
          <>
            <Hero />
            <ProductSections 
              onProductClick={(productId) => {
                setSelectedProductId(productId);
                setCurrentPage('product');
              }}
              onSeeAllClick={(section) => {
                setSelectedSection(section);
                setCurrentPage('shop');
              }}
            />
            <IngredientsSection />
            <WhyChooseUs />
            <Testimonials />
            <FAQ />
            <FounderStory />
            <Newsletter />
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen">
          <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {renderPage()}
          {currentPage !== 'checkout' && currentPage !== 'order-success' && <Footer />}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1B4332',
              color: '#fff',
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;