import { useState } from 'react';
import { Menu, X, ShoppingBag, User, Badge } from 'lucide-react';
import { useBrandSettings } from '../hooks/useBrandSettings';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthModal from './auth/AuthModal';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navigation = ({ currentPage, setCurrentPage }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const { brandSettings, loading } = useBrandSettings();
  const { user, userProfile } = useAuth();
  const { getCartCount } = useCart();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsOpen(false);
  };

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    if (user) {
      setCurrentPage('dashboard');
    } else {
      setAuthMode(mode);
      setShowAuthModal(true);
    }
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to text logo if image fails to load
    e.currentTarget.style.display = 'none';
    const textLogo = e.currentTarget.nextElementSibling as HTMLElement;
    if (textLogo) {
      textLogo.style.display = 'block';
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => handleNavClick('home')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                {!loading && brandSettings?.logo_url && (
                  <>
                    <img
                      src={brandSettings.logo_url}
                      alt={brandSettings.logo_alt_text || 'Logo'}
                      className="h-10 w-auto object-contain"
                      onError={handleLogoError}
                    />
                    <div 
                      className="hidden text-2xl font-bold text-forest-green font-playfair"
                      style={{ display: 'none' }}
                    >
                      {brandSettings.brand_name}
                    </div>
                  </>
                )}
                
                {(loading || !brandSettings?.logo_url) && (
                  <div className="text-2xl font-bold text-forest-green font-playfair">
                    {brandSettings?.brand_name || "O'rovana"}
                  </div>
                )}
                
                {brandSettings?.brand_tagline && (
                  <div className="hidden sm:block text-sm text-gray-600 font-medium">
                    {brandSettings.brand_tagline}
                  </div>
                )}
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'text-forest-green border-b-2 border-forest-green'
                        : 'text-charcoal hover:text-forest-green'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavClick('shop')}
                className="p-2 text-charcoal hover:text-forest-green transition-colors relative"
              >
                <ShoppingBag size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-terracotta text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
              
              {user ? (
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center space-x-2 p-2 text-charcoal hover:text-forest-green transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:block text-sm font-medium">
                    {userProfile?.first_name || 'Account'}
                  </span>
                </button>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="px-4 py-2 text-sm font-medium text-charcoal hover:text-forest-green transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="px-4 py-2 text-sm font-medium bg-forest-green text-white rounded-lg hover:bg-green-800 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 text-charcoal hover:text-forest-green transition-colors"
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'text-forest-green bg-forest-green/5'
                        : 'text-charcoal hover:text-forest-green'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {!user && (
                  <div className="pt-2 border-t border-gray-200 space-y-1">
                    <button
                      onClick={() => handleAuthClick('signin')}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-charcoal hover:text-forest-green transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick('signup')}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-charcoal hover:text-forest-green transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
                
                {user && (
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-charcoal hover:text-forest-green transition-colors"
                    >
                      My Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={() => {
          setShowAuthModal(false);
          setCurrentPage('dashboard');
        }}
      />
    </>
  );
};

export default Navigation;