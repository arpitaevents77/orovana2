import { useState, useEffect } from 'react';
import { CheckCircle, Package, Truck, Download, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface OrderSuccessPageProps {
  sessionId?: string;
  onContinueShopping: () => void;
}

const OrderSuccessPage = ({ sessionId, onContinueShopping }: OrderSuccessPageProps) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (sessionId && user) {
      fetchOrderDetails();
    }
  }, [sessionId, user]);

  const fetchOrderDetails = async () => {
    try {
      // In a real implementation, you would fetch the order using the session ID
      // For now, we'll fetch the most recent order for the user
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, images)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-forest-green text-white p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-playfair font-bold mb-2">
              Order Confirmed!
            </h1>
            <p className="text-green-100">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <div className="p-8">
            {order && (
              <>
                {/* Order Details */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-playfair font-bold text-charcoal">
                        Order #{order.order_number}
                      </h2>
                      <p className="text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-charcoal">
                        ₹{order.total_amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Package className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-800">Order Processing</h3>
                        <p className="text-sm text-blue-600">
                          We're preparing your order for shipment. You'll receive a tracking number soon.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-charcoal mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <img 
                            src={item.product_image || item.products?.images?.[0]} 
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-charcoal">{item.product_name}</h4>
                            {item.size && (
                              <p className="text-sm text-gray-600">Size: {item.size}</p>
                            )}
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-charcoal">₹{item.total_price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-charcoal mb-3">Shipping Address</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-charcoal">
                          {order.shipping_first_name} {order.shipping_last_name}
                        </p>
                        <p className="text-gray-600">{order.shipping_address_1}</p>
                        {order.shipping_address_2 && (
                          <p className="text-gray-600">{order.shipping_address_2}</p>
                        )}
                        <p className="text-gray-600">
                          {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                        </p>
                        <p className="text-gray-600">{order.shipping_country}</p>
                        {order.shipping_mobile && (
                          <p className="text-gray-600 mt-2">{order.shipping_mobile}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-charcoal mb-3">Estimated Delivery</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Truck className="w-6 h-6 text-forest-green" />
                          <div>
                            <p className="font-medium text-charcoal">3-5 Business Days</p>
                            <p className="text-sm text-gray-600">
                              You'll receive tracking information via email
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Next Steps */}
            <div className="bg-beige rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-forest-green text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <p className="text-gray-700">We'll send you an order confirmation email shortly</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-forest-green text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <p className="text-gray-700">Your order will be processed and prepared for shipping</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-forest-green text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <p className="text-gray-700">You'll receive tracking information once your order ships</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onContinueShopping}
                className="flex-1 bg-forest-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="flex-1 border border-forest-green text-forest-green py-3 px-6 rounded-lg font-semibold hover:bg-forest-green hover:text-white transition-colors flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;