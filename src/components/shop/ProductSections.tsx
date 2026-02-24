import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';

interface ProductSectionsProps {
  onProductClick?: (productId: string) => void;
  onSeeAllClick?: (section: string) => void;
}

const ProductSections = ({ onProductClick, onSeeAllClick }: ProductSectionsProps) => {
  const [sections, setSections] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const sectionConfigs = [
    { key: 'trending', title: 'Trending Now', field: 'is_trending' },
    { key: 'new', title: 'New Products', field: 'is_new' },
    { key: 'featured', title: 'Featured Products', field: 'is_featured' },
    { key: 'time_deal', title: 'Time Deals', field: 'is_time_deal' },
    { key: 'most_ordered', title: 'Most Ordered', field: 'is_most_ordered' },
    { key: 'health', title: 'Health & Wellness', field: 'is_health' },
    { key: 'immunity', title: 'Immunity Boosters', field: 'is_immunity' },
    { key: 'ayurveda', title: 'Ayurvedic Collection', field: 'is_ayurveda' },
    { key: 'sex_enhancement', title: 'Vitality & Performance', field: 'is_sex_enhancement' },
    { key: 'mind_power', title: 'Mind & Focus', field: 'is_mind_power' }
  ];

  useEffect(() => {
    fetchSectionProducts();
  }, []);

  const fetchSectionProducts = async () => {
    try {
      const sectionData: any = {};
      
      for (const section of sectionConfigs) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq(section.field, true)
          .eq('is_active', true)
          .limit(10)
          .order('created_at', { ascending: false });

        if (error) throw error;
        sectionData[section.key] = data || [];
      }
      
      setSections(sectionData);
    } catch (error) {
      console.error('Error fetching section products:', error);
    } finally {
      setLoading(false);
    }
  };

  const ProductCard = ({ product }: { product: any }) => (
    <div 
      className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
    >
      <div className="relative">
        <img 
          onClick={() => onProductClick?.(product.id)}
          src={product.images?.[0] || 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg'} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount_percentage > 0 && (
          <span className="absolute top-4 left-4 bg-terracotta text-white px-3 py-1 text-xs font-semibold rounded-full">
            {product.discount_percentage}% OFF
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 
          onClick={() => onProductClick?.(product.id)}
          className="text-lg font-semibold text-charcoal mb-2 line-clamp-2 cursor-pointer hover:text-forest-green"
        >
          {product.name}
        </h3>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{product.rating || 0}</span>
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.review_count || 0} reviews)</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-charcoal">₹{product.price}</span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
            )}
          </div>
        </div>

        <button
          onClick={async () => {
            try {
              await addToCart(product.id);
              toast.success("Added to cart");
            } catch (error) {
              console.error("Error adding to cart:", error);
              toast.error("Failed to add to cart");
            }
          }}
          className="w-full bg-forest-green text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-800 transition-colors"
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );

  const SectionSlider = ({ section, products }: { section: any, products: any[] }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

    const scroll = (direction: 'left' | 'right') => {
      if (!containerRef) return;
      
      const scrollAmount = 280; // Card width + gap
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      setScrollPosition(newPosition);
      containerRef.scrollTo({ left: newPosition, behavior: 'smooth' });
    };

    if (products.length === 0) return null;

    return (
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal">
            {section.title}
          </h2>
          <button 
            onClick={() => onSeeAllClick?.(section.key)}
            className="text-forest-green hover:text-green-800 transition-colors font-semibold"
          >
            See All →
          </button>
        </div>

        <div className="relative">
          <div 
            ref={(el) => setContainerRef(el)}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length > 3 && (
            <>
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-forest-green hover:text-white transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-forest-green hover:text-white transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green"></div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {sectionConfigs.map((section) => (
          <SectionSlider 
            key={section.key} 
            section={section} 
            products={sections[section.key] || []} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSections;