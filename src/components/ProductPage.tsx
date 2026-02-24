import { useState } from 'react';
import { Star, Plus, Minus, ShoppingCart, Zap, Shield, Leaf, Heart, ChevronLeft, ChevronRight, Award, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface ProductPageProps {
  productId?: string | null;
}

const ProductPage = ({ productId }: ProductPageProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('250g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');
  const [loading, setLoading] = useState(false);
  
  const { addToCart } = useCart();

  const product = {
    name: "Himalayan Ashwagandha Powder",
    subtitle: "Premium Root Extract",
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviews: 234,
    inStock: true,
    images: [
      "https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
      "https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
      "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
      "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
    ],
    sizes: [
      { size: '100g', price: 699, originalPrice: 899 },
      { size: '250g', price: 1299, originalPrice: 1599 },
      { size: '500g', price: 2199, originalPrice: 2799 }
    ],
    batchInfo: {
      region: "Himachal Pradesh",
      altitude: "1800m",
      harvest: "October 2024",
      batch: "HP-ASH-1024"
    }
  };

  const benefits = [
    { icon: <Zap className="w-5 h-5" />, text: "Reduces stress and anxiety naturally" },
    { icon: <Shield className="w-5 h-5" />, text: "Boosts immune system function" },
    { icon: <Heart className="w-5 h-5" />, text: "Supports cardiovascular health" },
    { icon: <Leaf className="w-5 h-5" />, text: "Enhances energy and vitality" }
  ];

  const ingredients = [
    { name: "Withania Somnifera", percentage: "100%", description: "Pure Ashwagandha root powder" }
  ];

  const reviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      date: "2 weeks ago",
      text: "Excellent quality! I can feel the difference in my energy levels within just a week of use.",
      verified: true
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      date: "1 month ago", 
      text: "Pure and authentic. The packaging clearly shows the batch details which gives me confidence.",
      verified: true
    },
    {
      name: "Anita Patel",
      rating: 4,
      date: "3 weeks ago",
      text: "Good product, though the taste is quite earthy. Mixing with honey helps.",
      verified: true
    }
  ];

  const getCurrentPrice = () => {
    const sizeData = product.sizes.find(s => s.size === selectedSize);
    return sizeData ? sizeData.price : product.price;
  };

  const getCurrentOriginalPrice = () => {
    const sizeData = product.sizes.find(s => s.size === selectedSize);
    return sizeData ? sizeData.originalPrice : product.originalPrice;
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(product.id || '1', quantity, selectedSize);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-sm text-gray-600">
          <a href="/" className="hover:text-forest-green">Home</a>
          <span className="mx-2">/</span>
          <a href="/shop" className="hover:text-forest-green">Shop</a>
          <span className="mx-2">/</span>
          <span className="text-charcoal">Himalayan Ashwagandha Powder</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-beige rounded-2xl overflow-hidden">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
              />
              
              {/* Navigation arrows */}
              <button 
                onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-forest-green' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">{product.subtitle}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>
              {product.inStock && (
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-charcoal">₹{getCurrentPrice()}</span>
              <span className="text-xl text-gray-500 line-through">₹{getCurrentOriginalPrice()}</span>
              <span className="bg-terracotta text-white px-3 py-1 rounded-full text-sm font-semibold">
                {Math.round((1 - getCurrentPrice() / getCurrentOriginalPrice()) * 100)}% OFF
              </span>
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-3">Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((sizeOption) => (
                  <button
                    key={sizeOption.size}
                    onClick={() => setSelectedSize(sizeOption.size)}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      selectedSize === sizeOption.size
                        ? 'border-forest-green bg-forest-green/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{sizeOption.size}</div>
                    <div className="text-sm text-gray-600">₹{sizeOption.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Total: ₹{(getCurrentPrice() * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <button 
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full bg-forest-green text-white py-4 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{loading ? 'Adding...' : 'Add to Cart'}</span>
            </button>

            {/* Batch Information */}
            <div className="bg-beige p-4 rounded-lg">
              <h3 className="font-semibold text-charcoal mb-2">Batch Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Region:</span>
                  <span className="ml-2 font-medium">{product.batchInfo.region}</span>
                </div>
                <div>
                  <span className="text-gray-600">Altitude:</span>
                  <span className="ml-2 font-medium">{product.batchInfo.altitude}</span>
                </div>
                <div>
                  <span className="text-gray-600">Harvest:</span>
                  <span className="ml-2 font-medium">{product.batchInfo.harvest}</span>
                </div>
                <div>
                  <span className="text-gray-600">Batch:</span>
                  <span className="ml-2 font-medium">{product.batchInfo.batch}</span>
                </div>
              </div>
            </div>

            {/* Compliance Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-forest-green" />
                <span className="text-sm font-medium">FSSAI Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-forest-green" />
                <span className="text-sm font-medium">Lab Tested</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['benefits', 'ingredients', 'usage', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-forest-green text-forest-green'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-playfair font-bold text-charcoal">Key Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="text-forest-green mt-1">{benefit.icon}</div>
                      <span className="text-gray-700">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-playfair font-bold text-charcoal">Ingredients</h3>
                <div className="space-y-4">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-charcoal">{ingredient.name}</h4>
                        <span className="text-forest-green font-medium">{ingredient.percentage}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{ingredient.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-playfair font-bold text-charcoal">How to Use</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-forest-green text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <p className="text-gray-700">Take 1/2 to 1 teaspoon (2-4g) of powder</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-forest-green text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <p className="text-gray-700">Mix with warm water, milk, or honey</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-forest-green text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <p className="text-gray-700">Consume twice daily, preferably with meals</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-forest-green text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                    <p className="text-gray-700">For best results, use consistently for 2-3 months</p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Consult your healthcare provider before use if pregnant, nursing, or taking medications.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-playfair font-bold text-charcoal">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{product.rating} out of 5</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-charcoal">{review.name}</h4>
                            {review.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-charcoal">₹{getCurrentPrice()}</div>
            <div className="text-sm text-gray-600">{selectedSize}</div>
          </div>
          <button className="bg-forest-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>{loading ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;