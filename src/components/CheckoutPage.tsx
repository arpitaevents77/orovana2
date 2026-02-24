import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, createCheckoutSession } from '../lib/stripe';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Lock, ArrowLeft, Package, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckoutPageProps {
  onBack: () => void;
}

const CheckoutPage = ({ onBack }: CheckoutPageProps) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    first_name: userProfile?.first_name || '',
    last_name: userProfile?.last_name || '',
    email: userProfile?.email || '',
    mobile_no: userProfile?.mobile_no || '',
    address_1: userProfile?.address_1 || '',
    address_2: userProfile?.address_2 || '',
    city: userProfile?.city || '',
    state: userProfile?.state || '',
    postal_code: userProfile?.postal_code || '',
    country: userProfile?.country || 'India'
  });

  const subtotal = getCartTotal();
  const shipping = 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!userProfile) {
      toast.error('Please sign in to continue');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const sessionId = await createCheckoutSession(
        cartItems.map(item => ({
          product_id: item.product_id,
          name: item.products.name,
          price: item.products.price,
          quantity: item.quantity,
          size: item.size
        })),
        { ...userProfile, ...shippingInfo }
      );

      const { error } = await stripe.redirectToCheckout({
        sessionId
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to continue with checkout</p>
            <button
              onClick={onBack}
              className="bg-forest-green text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-forest-green hover:text-green-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-playfair font-bold text-charcoal mb-6">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.first_name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, first_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.last_name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, last_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={shippingInfo.mobile_no}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, mobile_no: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.address_1}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address_1: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  placeholder="Street address, P.O. Box, company name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={shippingInfo.address_2}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address_2: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.postal_code}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, postal_code: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Country *
                </label>
                <select
                  required
                  value={shippingInfo.country}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                >
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-playfair font-bold text-charcoal mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img 
                    src={item.products.images?.[0]} 
                    alt={item.products.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal">{item.products.name}</h3>
                    {item.size && (
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-charcoal">
                      ₹{(item.products.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-charcoal">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-charcoal">₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%):</span>
                <span className="text-charcoal">₹{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-charcoal">Total:</span>
                  <span className="text-charcoal">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="w-5 h-5 text-forest-green" />
                <span className="text-sm text-gray-600">
                  Estimated delivery: 3-5 business days
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-forest-green text-white py-4 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-5 h-5" />
                <span>{loading ? 'Processing...' : 'Proceed to Payment'}</span>
              </button>

              <div className="flex items-center justify-center space-x-2 mt-4">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  Secured by Stripe. Your payment information is encrypted and secure.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;